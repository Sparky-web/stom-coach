import { DateTime } from "luxon";
import { env } from "~/env";
import { addOrderToSpreadsheet } from "~/lib/add-new-order-to-spreadsheet";
import { transporter } from "~/lib/mail";
import fs from "fs/promises"
import strapi from "~/server/strapi";
import countUserBonuses from "./count-user-bonuses";

export default async function onPaymentSuccess(orderId: string) {
  console.log(`Заказ ${orderId} оплачен`)
  const orders = await strapi.get('orders', { filters: { sberbank_order_id: orderId }, populate: "*" });
  const strapiOrder = orders.data[0]

  await strapi.update('orders', strapiOrder.id, {
    is_paid: true
  })

  await countUserBonuses(strapiOrder)

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
    if (env.ENABLE_EMAILS) {
      let info = await transporter.sendMail(mailOptions);
      console.log('Письмо отправлено: %s', info.messageId);


      for (const email of adminEmails) {
        await transporter.sendMail({
          ...adminMailOptions,
          to: email
        });
      }

      console.log('Письмо отправлено админам: %s', info.messageId);
    }

    await addOrderToSpreadsheet({
      event_name: order.attributes.event.data.attributes.name,
      option_name: order.attributes.option_name,
      first_name: order.attributes.first_name,
      last_name: order.attributes.last_name,
      second_name: order.attributes.second_name,
      email: order.attributes.email,
      price: order.attributes.price,
      is_paid: order.attributes.is_paid,
      sberbank_order_id: order.attributes.sberbank_order_id,
      sberbank_payment_url: order.attributes.sberbank_payment_url,
      workplace: order.attributes.workplace,
      position: order.attributes.position?.data?.attributes.name,
      speciality: order.attributes.speciality?.data?.attributes.name,
      phone: order.attributes.phone,
      bonuses: order.attributes.bonuses,
      promocode: order.attributes.promocode
    })

    // console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  } catch (error) {
    console.error('Ошибка при отправке письма:', error);
  }
}