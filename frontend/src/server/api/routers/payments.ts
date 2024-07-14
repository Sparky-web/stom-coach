import { custom, z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import strapi from "~/server/strapi";
import { Settings, Event } from "~/types/entities";
import { APIResponseCollection } from "~/types/types";

// import emailTemplate from "~/email-template.html";
import nodemailer from "nodemailer";

import axios from "axios";

import { env } from "~/env";
import https from "https"
import { TRPCClientError } from "@trpc/client";
import { TRPCError } from "@trpc/server";
import fs from "fs/promises";
import { DateTime } from "luxon";

export const paymentRouder = createTRPCRouter({
  getPaymentLink: publicProcedure.input(z.object({
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
          sessionTimeoutSecs: 1200,
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
        sberbank_payment_url: data.formUrl,
        // is_paid: true
      })

      startCheckingPayment(data.orderId)

      return data as {
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
  }),
  legalSignUp: publicProcedure.input(z.object({
    event: z.string(),
    option: z.string().optional().nullable(),
    name: z.string(),
    phone: z.string(),
    email: z.string().email(),
    company: z.string().nullable().optional()
  })).mutation(async ({ ctx, input }) => {
    try {
      const { data: settings } = await strapi.get('nastrojki', { populate: "admin_emails" });
      const adminEmails = settings.attributes.admin_emails.map(e => e.email)

      let transporter = nodemailer.createTransport({
        host: 'smtp.stom-coach.ru', // SMTP-сервер
        port: 587, // Порт
        secure: false, // true для 465, false для других портов
        auth: {
          user: 'education@stom-coach.ru', // Ваш email
          pass: '9kA949gKxKmR5urN' // Ваш пароль от email
        },
        tls: {
          rejectUnauthorized: false // This bypasses the certificate validation
        }
      });

      const emailOptions = {
        from: '"Учебный центр STOMCOACH" <education@stom-coach.ru>', // Адрес отправителя
        subject: 'Новая заявка на мероприятие от юр. лица', // Тема письма
        text: `` +
          `Новая заявка на мероприятие в Учебном центре STOMCOACH от юр. лица
Название мероприятия: ${input.event} ${input.option ? `— ${input.option}` : ''}
контактное лицо: ${input.name}
телефон: ${input.phone}
email: ${input.email}
название компании: ${input.company}`
      }

      for (const email of adminEmails) {
        await transporter.sendMail({
          ...emailOptions,
          to: email
        });
      }
    }
    catch (e) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Ошибка при создании заявки',
      })
    }
  })
})

async function startCheckingPayment(orderId: string, count: number = 0) {
  const maxCountCheck = (1000 * 60 * 20 / 30000) // 20 минут

  if (count > maxCountCheck) {
    const { data: [order] } = await strapi.get('orders', { filters: { sberbank_order_id: orderId } });
    await strapi.update('orders', order.id, {
      expired: true
    })

    return
  }

  try {
    console.log(`Проверка статуса заказа ${orderId}, попытка ${count}`)
    const status = await getOrderStatus(orderId)

    if (status === 2) {
      console.log(`Заказ ${orderId} не оплачен`)
      const orders = await strapi.get('orders', { filters: { sberbank_order_id: orderId }, populate: "*" });
      console.log('Заказы:', orders)
      const strapiOrder = orders.data[0]

      // console.log(`Заказ ${strapiOrder.id} `)

      await strapi.update('orders', strapiOrder.id, {
        is_paid: true
      })

      console.log(`Оплачен заказ ${strapiOrder.id}`)

      const { data: event } = await strapi.get('events/' + strapiOrder.attributes.event.data.id, { populate: "*" });

      console.log(`Уменьшаем количество билетов на ${event.id}`)

      const update = strapiOrder.attributes.option_id ? {
        options: [
          ...event.attributes.options.filter(e => e.id !== strapiOrder.attributes.option_id),
          {
            ...event.attributes.options.find(e => e.id === strapiOrder.attributes.option_id),
            id: strapiOrder.attributes.option_id,
            ticketsLeft: event.attributes.options.find(e => e.id === strapiOrder.attributes.option_id).ticketsLeft - 1,
          }
        ]
      } : {
        ticketsLeft: event.attributes.ticketsLeft - 1
      }

      console.log('Обновляем состояние мероприятия:', update)

      await strapi.update('events', event.id, update)

      console.log(`Заказ ${orderId} оплачен`)

      await onPaymentSuccess(orderId)

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
  }

  const response = await axios.post(url, null, { params: data, httpsAgent: new https.Agent({ rejectUnauthorized: false }) });
  console.log('Ответ от API Сбербанка:', response.data)

  if (response.data.errorCode === '0') {
    return response.data.orderStatus;
  } else {
    throw new Error('Ошибка получения статуса заказа:' + response.data.errorMessage);
  }
}

const onPaymentSuccess = async (orderId: string) => {
  // 
  const { data: settings } = await strapi.get('nastrojki', { populate: "admin_emails" });
  const adminEmails = settings.attributes.admin_emails.map(e => e.email)

  const { data: [order] } = await strapi.get('orders', { filters: { sberbank_order_id: orderId }, populate: "*" });

  let emailTemplate = await fs.readFile('./src/email-template.html', 'utf8');

  emailTemplate = emailTemplate.replace(/{{order_number}}/g, order.id)
    .replace(/{{order_date}}/g, DateTime.fromISO(order.attributes.updatedAt).toLocaleString(DateTime.DATETIME_MED))
    .replace(/{{event_name}}/g, order.attributes.event.data.attributes.name + (order.attributes.option_name ? " — " + order.attributes.option_name : ""))
    .replace(/{{event_url}}/g, env.BASE_URL + '/events/' + order.attributes.event.data.id)
    .replace(/{{client_name}}/g, order.attributes.first_name + " " + order.attributes.second_name)
    .replace(/{{event_date}}/g, DateTime.fromISO(order.attributes.event.data.attributes.date).toLocaleString(DateTime.DATE_FULL))
    .replace(/{{location}}/g, order.attributes.event.data.attributes.location)

  let transporter = nodemailer.createTransport({
    host: 'smtp.stom-coach.ru', // SMTP-сервер
    port: 587, // Порт
    secure: false, // true для 465, false для других портов
    auth: {
      user: 'education@stom-coach.ru', // Ваш email
      pass: '9kA949gKxKmR5urN' // Ваш пароль от email
    },
    tls: {
      rejectUnauthorized: false // This bypasses the certificate validation
    }
  });

  // Определяем параметры письма
  let mailOptions = {
    from: '"Учебный центр STOMCOACH" <education@stom-coach.ru>', // Адрес отправителя
    to: order.attributes.email, // Адрес получателя
    subject: 'Вы записаны на мероприятие', // Тема письма
    // text: 'This is a test email sent from Node.js using SMTP!', // Текст письма
    html: emailTemplate // HTML-версия письма
  };

  let adminMailOptions = {
    from: '"Учебный центр STOMCOACH" <education@stom-coach.ru>', // Адрес отправителя
    // to: adminEmails, // Адрес получателя
    subject: 'Новая запись на мероприятие', // Тема письмYj
    text: `` +
      `Новая запись на мероприятие в Учебном центре STOMCOACH

Название мероприятия: ${order.attributes.event?.data.attributes.name} ${order.attributes.option_name ? `— ${order.attributes.option_name}` : ''}

Статус заказа: ${order.attributes.is_paid ? 'Оплачен' : 'Не оплачен'}

Order ID из Сбербанка: ${order.attributes.sberbank_order_id}

Дата и время оплаты: ${DateTime.fromISO(order.attributes.updatedAt).toLocaleString(DateTime.DATETIME_MED)}

Участник:  ${order.attributes.last_name} ${order.attributes.first_name} ${order.attributes.second_name}

Email: ${order.attributes.email}

Номер телефона: ${order.attributes.phone}

Место работы: ${order.attributes.workplace}

Должность: ${order.attributes.position?.data?.attributes.name || order.attributes.custom_position}

Специальность: ${order.attributes.speciality?.data?.attributes.name || order.attributes.custom_speciality}

Сумма оплаты: ${order.attributes.price} руб.
`

    // html: emailTemplate // HTML-версия письма
  };

  try {
    let info = await transporter.sendMail(mailOptions);
    console.log('Письмо отправлено: %s', info.messageId);

    for (const email of adminEmails) {
      await transporter.sendMail({
        ...adminMailOptions,
        to: email
      });
    }

    console.log('Письмо отправлено админам: %s', info.messageId);

    // console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  } catch (error) {
    console.error('Ошибка при отправке письма:', error);
  }
}