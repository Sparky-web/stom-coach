import { z } from "zod";
// import { cookies } from 'next/headers'

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
import registerUser from "./_lib/register-user";
import { transporter } from "~/lib/mail";
import bcrypt from 'bcrypt';
import verifyResetToken from "./_lib/verify-reset-token";
import createToken from "./_lib/create-token";

const secret = env.NEXTAUTH_SECRET;

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

  sendResetPasswordLink: publicProcedure.input(z.object({
    email: z.string().email(),
  })).mutation(async ({ ctx, input }) => {
    const { data: [client] } = await strapi.get('clients', { filters: { email: input.email } });

    if (!client) return;

    const token = createToken(input.email, client.attributes.password)

    await transporter.sendMail({
      from: '"Учебный центр STOMCOACH" <education@stom-coach.ru>', // Адрес отправителя
      to: client.attributes.email, // Адрес получателя
      subject: 'Восстановление пароля', // Тема письма
      text: `` +
        `Восстановление пароля в Учебном центре STOMCOACH\n` +
        `Ссылка для восстановления пароля: https://stom-coach.ru/auth/reset-password/reset?token=${token} \n` +
        `Если вы не запрашивали сброс пароля, просто проигнорируйте это письмо.`
    });
  }),
  resetPassword: publicProcedure.input(z.object({
    token: z.string(),
    password: z.string().min(6).max(255),
  })).mutation(async ({ ctx, input }) => {
    const { token } = input;

    const {email} = await verifyResetToken(token)

    const {data: [client]} = await strapi.get('clients', { filters: { email } });

    await strapi.update('clients', client.id, {
      password: await bcrypt.hash(input.password, 10)
    })

    return {
      message: 'Пароль успешно изменен'
    }
  }),
  checkToken: publicProcedure.input(z.object({
    token: z.string(),
  })).query(async ({ ctx, input }) => {
    const { token } = input
    return await verifyResetToken(token)
  }),
  me: protectedProcedure.query(async ({ ctx }) => {
    if (!ctx.session.user) throw new Error('нет авторизации')

    const isUserCompleted = ctx.session.user.attributes.first_name && ctx.session.user.attributes.last_name && ctx.session.user.attributes.phone
      && ctx.session.user.attributes.email && ctx.session.user.attributes.workplace
      && ctx.session.user.attributes.position?.data?.id

    return { ...ctx.session.user, isCompleted: isUserCompleted }
  }),
  signUp: publicProcedure.input(z.object({
    phone: z.string().length(11),
    password: z.string().min(6).max(255),
    email: z.string().email(),
  })).mutation(async ({ input }) => {
    await registerUser(input.phone, input.email, input.password)
  }),
})