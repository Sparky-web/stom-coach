import { z } from "zod";
import { cookies } from 'next/headers'

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
  rateLimiter,
} from "~/server/api/trpc";
import strapi from "~/server/strapi";

import axios from "axios";
import { env } from "~/env";

import jwt from "jsonwebtoken";

const secret = env.JWT_SECRET;

export type User = {
  id: string;
  isCompleted: boolean;
  attributes: {
    phone: string;
    first_name: string | null;
    last_name: string | null;
    second_name: string | null;
    email: string | null;
    workplace: string | null;
    speciality: {
      data: {
        id: number;
        attributes: {
          name: string;
        }
      }
    };
    position: {
      data: {
        id: number;
        attributes: {
          name: string;
        }
      }
    };
    custom_speciality: string | null;
    custom_position: string | null;
  };
}


// TODO: ограничить кол-во запросов
export const authRouter = createTRPCRouter({
  getSmsCode: publicProcedure.input(z.string().length(11)).query(async ({ ctx, input: phone }) => {
    const { data: codes } = await strapi.get('sms-codes', {
      filters: {
        phone,
        expires_at: {
          lt: new Date().toISOString()
        }
      }
    });

    const foundCode = codes[0] ?? null;

    const code = foundCode?.attributes?.code || Math.floor(1000 + Math.random() * 9000);

    const { data } = await axios.post('https://api.exolve.ru/number/customer/v1/GetList', {}, {
      headers: {
        'Authorization': `Bearer ${env.EXOLVE_API_KEY}`,
      }
    }).catch(err => ({ data: err.response.data }))

    const number = data.numbers?.[0]?.number_name;
    if (!number) throw new Error('неизвестная ошибка')

    const { data: d1 } = await axios.post('https://api.exolve.ru/messaging/v1/SendSMS', {
      number,
      destination: phone,
      text: `${code} — ваш код для входа в личный кабинет учебного центра StomCoach`
    }, {
      headers: {
        'Authorization': `Bearer ${env.EXOLVE_API_KEY}`,
      }
    });
    console.log('Отправлено сообщение на телефон', d1)
    // let message_id = '1234'

    if (!foundCode) {
      await strapi.insert('sms-codes', {
        phone,
        code,
        expires_at: new Date(Date.now() + 1000 * 60 * 10),
      })
    }

    return {}
  }),
  validateCode: publicProcedure.input(
    z.object({
      phone: z.string().length(11),
      code: z.number().min(1000).max(9999),
    })
  ).query(async ({ ctx, input }) => {
    const { phone, code } = input

    const { data: [foundCode] } = await strapi.get('sms-codes', {
      filters: {
        phone,
        expires_at: {
          gt: new Date().toISOString()
        }
      }
    });

    if (!foundCode) throw new Error('авторизация не удалась')
    if (foundCode.attributes.code !== code) throw new Error('неверный код')

    let { data: [client] } = await strapi.get('clients', {
      filters: {
        phone
      }
    })

    if (!client) {
      let id = await strapi.insert('clients', {
        phone
      })

      const { data } = await strapi.get('clients/' + id, { populate: "*" })
      client = data
    }

    const token = jwt.sign({ phone }, secret, { expiresIn: '12h' });

    return {
      token,
      user: client as User
    }
  }),
  me: protectedProcedure.query(async ({ ctx }) => {
    if (!ctx.session.user) throw new Error('нет авторизации')

    const isUserCompleted = ctx.session.user.attributes.first_name && ctx.session.user.attributes.last_name && ctx.session.user.attributes.phone
      && ctx.session.user.attributes.email && ctx.session.user.attributes.workplace
      && ctx.session.user.attributes.position?.data?.id

    return { ...ctx.session.user, isCompleted: isUserCompleted }
  }),
})

