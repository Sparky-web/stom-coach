import { publicProcedure } from "~/server/api/trpc"
import { z } from "zod";
import axios from "axios";
import { env } from "~/env";
import https from "https"
import { TRPCError } from "@trpc/server";
import { Event } from "~/types/entities";
import startCheckingPayment from "../utils/start-checking-payment";
import strapi from "~/server/strapi";
import onPaymentSuccess from "../utils/on-payment-success";
import { createPayment } from "../utils/yookassa";

const getPaymentLink = publicProcedure.input(z.object({
  eventId: z.number(),
  optionId: z.number().optional().nullable(),
  phone: z.string(),
  email: z.string().email(),
  first_name: z.string(),
  last_name: z.string(),
  second_name: z.string(),
  speciality: z.number().nullable().optional(),
  custom_speciality: z.string().optional().nullable(),
  position: z.number(),
  custom_position: z.string().optional().nullable(),
  workplace: z.string(),
  useBonuses: z.boolean(),
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

    let bonusesWrittenOff = 0
    if (input.useBonuses && ctx.session?.user?.attributes?.bonuses) {
      const bonusesAmount = ctx.session?.user.attributes?.bonuses

      if (bonusesAmount < price) {
        price -= bonusesAmount
        bonusesWrittenOff = bonusesAmount
      } else {
        price = 1
        bonusesWrittenOff = bonusesAmount - price + 1
      }
    }

    const optionName = input.optionId ? event.attributes.options.find(e => e.id === input.optionId)?.name : null
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
      option_name: optionName,
      price: price,
      bonuses: bonusesWrittenOff
    })

    if (!env.ENABLE_PAYMENTS) {
      const orderId = Math.floor(1000 + Math.random() * 9000).toString()
      await strapi.update('orders', order, {
        sberbank_order_id: orderId,
        sberbank_payment_url: Math.floor(1000 + Math.random() * 9000).toString(),
        // is_paid: true
      })
      onPaymentSuccess(orderId)
      return
    }

    // const { data } = await axios.post('https://securepayments.sberbank.ru/payment/rest/register.do', null, {
    //   params: {
    //     userName: env.SBER_LOGIN,
    //     password: env.SBER_PASSWORD,
    //     amount: price * 100,
    //     currency: 643,
    //     sessionTimeoutSecs: 1200,
    //     language: 'ru',
    //     email: input.email,
    //     // phone: "9998888888",

    //     orderNumber: new Date().getTime().toString(),
    //     returnUrl: env.BASE_URL + "/payment/success",
    //     orderBundle: JSON.stringify({
    //       // customerDetails: {
    //       //   phone: "%2B79888888877",
    //       //   inn: "516974792202",
    //       //   passport: "4507 443564",
    //       // },
    //       cartItems: {
    //         items: [
    //           {
    //             positionId: 1,
    //             name: event.attributes.name,
    //             quantity: {
    //               value: "1",
    //               measure: "0",
    //             },
    //             itemCode: input.optionId ? `${event.id}_${input.optionId}` : event.id + "_" + price,
    //             itemPrice: price * 100,
    //             // itemAttributes: {
    //             //   attributes: [
    //             //     {
    //             //       name: "paymentMethod",
    //             //       value: "1",
    //             //     },
    //             //     {
    //             //       name: "paymentObject",
    //             //       value: "4",
    //             //     },
    //             //     // {
    //             //     //   name: "supplier_info.phones",
    //             //     //   value: "%2B79222075050", 
    //             //     // },
    //             //     // {
    //             //     //   name: "supplier_info.inn",
    //             //     //   value: "6686043920",
    //             //     // },
    //             //     {
    //             //       name: "excise",
    //             //       value: "10.0",
    //             //     },
    //             //     {
    //             //       name: "country_code",
    //             //       value: "810",
    //             //     },
    //             //     {
    //             //       name: "declaration_number",
    //             //       value: "12332234533",
    //             //     },
    //             //     {
    //             //       name: "userData",
    //             //       value: "user data",
    //             //     },
    //             //     {
    //             //       name: "sectoralItemProps[0].federalId",
    //             //       value: "001",
    //             //     },
    //             //     {
    //             //       name: "sectoralItemProps[0].date",
    //             //       value: "10.10.2021",
    //             //     },
    //             //     {
    //             //       name: "sectoralItemProps[0].number",
    //             //       value: "123/4567",
    //             //     },
    //             //     {
    //             //       name: "sectoralItemProps[0].value",
    //             //       value: "value1",
    //             //     },
    //             //     {
    //             //       name: "sectoralItemProps[1].federalId",
    //             //       value: "003",
    //             //     },
    //             //     {
    //             //       name: "sectoralItemProps[1].date",
    //             //       value: "11.10.2021",
    //             //     },
    //             //     {
    //             //       name: "sectoralItemProps[1].number",
    //             //       value: "321/4567",
    //             //     },
    //             //     {
    //             //       name: "sectoralItemProps[1].value",
    //             //       value: "value2",
    //             //     },
    //             //   ],
    //             // },
    //           },
    //         ],
    //       },
    //     }),
    //   },

    //   // params: {
    //   //   orderNumber: 'order-12345', // Уникальный номер заказа
    //   //   amount: 2000000, // Сумма в копейках (20000 руб)
    //   //   returnUrl: 'https://example.com/success', // URL для успешного редиректа после оплаты
    //   //   failUrl: 'https://example.com/fail', // URL для редиректа в случае ошибки оплаты
    //   //   currency: 643, // Код валюты (643 для RUB)
    //   //   description: 'Лекционный курс',
    //   //   language: 'ru',
    //   //   userName: 'p6686043920-api', // Ваш логин для доступа к API Сбербанка
    //   //   password: 'XdwptxLu' // Ваш пароль для доступа к API Сбербанка
    //   // },
    //   httpsAgent: new https.Agent({
    //     rejectUnauthorized: false
    //   })
    // })

    const { id, paymentUrl } = await createPayment({
      amount: price,
      returnUrl: env.BASE_URL + "/payment/success",
      description: event.attributes.name +  optionName ? ` — ${optionName}` : '',
      orderId: order,
      email: input.email
    })

    console.log('Платеж создан:', id, paymentUrl)

    await strapi.update('orders', order, {
      sberbank_order_id: id,
      sberbank_payment_url: paymentUrl,
      // is_paid: true
    })

    startCheckingPayment(id)

    return {
      orderId: id,
      formUrl: paymentUrl
    } as {
      orderId: string;
      formUrl: string;
    }

  }
  catch (e) {
    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Ошибка при создании заказа на оплату',
    })
  }
})

export default getPaymentLink
// Функция проверки статуса платежа
// Основная функция