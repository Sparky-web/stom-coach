import { custom, z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import strapi from "~/server/strapi";
import { Settings, Event } from "~/types/entities";
import { APIResponseCollection } from "~/types/types";

import axios from "axios";

import { env } from "~/env";
import https from "https"
import { TRPCClientError } from "@trpc/client";
import { TRPCError } from "@trpc/server";

export const paymentRouder = createTRPCRouter({
  getPaymentLink: publicProcedure.input(z.object({
    eventId: z.number(),
    optionId: z.number().optional().nullable(),
    phone: z.string(),
    email: z.string().email(),
    first_name: z.string(),
    last_name: z.string(),
    second_name: z.string(),
    speciality: z.number(),
    custom_speciality: z.string().optional().nullable(),
    position: z.number(),
    custom_position: z.string().optional().nullable(),
    workplace: z.string()
  })).mutation(async ({ ctx, input }) => {
    try {
      const res = await strapi.get('events/' + input.eventId, {
        populate: "*"
      })

      const event = res.data as Event

      let name = event.attributes.name
      let price = event.attributes.price

      if (input.optionId) {
        const found = event.attributes.options.find(e => e.id === input.optionId)
        if (found) {
          name += " — " + found.name
          price = found.price
        }
      }

      const order = await strapi.insert('orders', {
        event: event.id,
        phone: input.phone,
        first_name: input.first_name,
        last_name: input.last_name,
        second_name: input.second_name,
        email: input.email,
        workplace: input.workplace,
        speciality: input.speciality,
        position: input.position,
        custom_position: input.custom_position,
        custom_speciality: input.custom_speciality,
        is_paid: false,
        option_id: input.optionId,
        option_name: input.optionId ? event.attributes.options.find(e => e.id === input.optionId)?.name : null,
        price: price
      })

      const { data } = await axios.post('https://securepayments.sberbank.ru/payment/rest/register.do', null, {
        params: {
          userName: env.SBER_LOGIN,
          password: env.SBER_PASSWORD,
          amount: price * 100,
          currency: 643,
          language: 'ru',
          email: input.email,
          // phone: "9998888888",

          orderNumber: new Date().getTime().toString(),
          returnUrl: env.BASE_URL + "/payment/success",
          orderBundle: JSON.stringify({
            // customerDetails: {
            //   phone: "%2B79888888877",
            //   inn: "516974792202",
            //   passport: "4507 443564",
            // },
            cartItems: {
              items: [
                {
                  positionId: 1,
                  name: event.attributes.name,
                  quantity: {
                    value: "1",
                    measure: "0",
                  },
                  itemCode: input.optionId ? `${event.id}_${input.optionId}` : event.id + "_" + price,
                  itemPrice: price * 100,
                  // itemAttributes: {
                  //   attributes: [
                  //     {
                  //       name: "paymentMethod",
                  //       value: "1",
                  //     },
                  //     {
                  //       name: "paymentObject",
                  //       value: "4",
                  //     },
                  //     // {
                  //     //   name: "supplier_info.phones",
                  //     //   value: "%2B79222075050", 
                  //     // },
                  //     // {
                  //     //   name: "supplier_info.inn",
                  //     //   value: "6686043920",
                  //     // },
                  //     {
                  //       name: "excise",
                  //       value: "10.0",
                  //     },
                  //     {
                  //       name: "country_code",
                  //       value: "810",
                  //     },
                  //     {
                  //       name: "declaration_number",
                  //       value: "12332234533",
                  //     },
                  //     {
                  //       name: "userData",
                  //       value: "user data",
                  //     },
                  //     {
                  //       name: "sectoralItemProps[0].federalId",
                  //       value: "001",
                  //     },
                  //     {
                  //       name: "sectoralItemProps[0].date",
                  //       value: "10.10.2021",
                  //     },
                  //     {
                  //       name: "sectoralItemProps[0].number",
                  //       value: "123/4567",
                  //     },
                  //     {
                  //       name: "sectoralItemProps[0].value",
                  //       value: "value1",
                  //     },
                  //     {
                  //       name: "sectoralItemProps[1].federalId",
                  //       value: "003",
                  //     },
                  //     {
                  //       name: "sectoralItemProps[1].date",
                  //       value: "11.10.2021",
                  //     },
                  //     {
                  //       name: "sectoralItemProps[1].number",
                  //       value: "321/4567",
                  //     },
                  //     {
                  //       name: "sectoralItemProps[1].value",
                  //       value: "value2",
                  //     },
                  //   ],
                  // },
                },
              ],
            },
          }),
        },

        // params: {
        //   orderNumber: 'order-12345', // Уникальный номер заказа
        //   amount: 2000000, // Сумма в копейках (20000 руб)
        //   returnUrl: 'https://example.com/success', // URL для успешного редиректа после оплаты
        //   failUrl: 'https://example.com/fail', // URL для редиректа в случае ошибки оплаты
        //   currency: 643, // Код валюты (643 для RUB)
        //   description: 'Лекционный курс',
        //   language: 'ru',
        //   userName: 'p6686043920-api', // Ваш логин для доступа к API Сбербанка
        //   password: 'XdwptxLu' // Ваш пароль для доступа к API Сбербанка
        // },
        httpsAgent: new https.Agent({
          rejectUnauthorized: false
        })
      })

      await strapi.update('orders', order, {
        sberbank_order_id: data.orderId,
        // is_paid: true
      })

      startCheckingPayment(data.orderId)

      return data
    }
    catch (e) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Ошибка при создании заказа на оплату',
      })
    }
  })
});

async function startCheckingPayment(orderId: string, count: number = 0) {
  const maxCountCheck = (1000 * 60 * 20 / 30000) // 20 минут

  if (count > maxCountCheck) {
    return
  } 

  try {
    console.log(`Проверка статуса заказа ${orderId}, попытка ${count}`)
    const status = await getOrderStatus(orderId)

    if(status === 2) {
      const [strapiOrder] = await strapi.get('orders', {filters: {sberbank_order_id: orderId}});
      
      await strapi.update('orders', strapiOrder.id, {
        is_paid: true
      })
      console.log(`Заказ ${orderId} оплачен`)

      return
    }
  } catch (e) {
    console.error(`Ошибка проверки статуса заказа ${orderId}, попытка ${count}`, e)
  }

  setTimeout(() => {
    startCheckingPayment(orderId, count + 1)
  }, 30000)
}

async function getOrderStatus(orderId: string) {
  const url = 'https://securepayments.sberbank.ru/payment/rest/getOrderStatusExtended.do'; // Тестовый URL для API Сбербанка
  const data = {
    orderId: orderId, // Уникальный идентификатор заказа, который вы получили при создании счета
    userName: env.SBER_LOGIN, // Ваш логин для доступа к API Сбербанка
    password: env.SBER_PASSWORD // Ваш пароль для доступа к API Сбербанка
  };

  const response = await axios.post(url, null, { params: data, httpsAgent: new https.Agent({ rejectUnauthorized: false }) });
  if (response.data.errorCode === '0') {
    return response.data.orderStatus;
  } else {
    throw new Error('Ошибка получения статуса заказа:' + response.data.errorMessage);
  }
}

`
Подтверждение регистрации на мероприятие учебного центра STOMCOACH
`

const onPaymentSuccess = async (orderId: string) => {

}