import { transporter } from "~/lib/mail";
import strapi from "~/server/strapi";

export default async function sendCode(email: string) {
  const { data } = await strapi.get('sms-codes', {
    filters: {
      email,
      expires_at: {
        gt: new Date().toISOString()
      }
    }
  })
  if (data.length > 0) {
    const code = data[0].attributes.code
    await transporter.sendMail({
      from: '"Учебный центр STOMCOACH" <education@stom-coach.ru>', // Адрес отправителя
      to: email, // Адрес получателя
      subject: 'Код подтверждения для регистрации в StomClub', // Тема письма
      text: `Ваш код подтверждения: ${code}. Если вы не регистрируетесь в StomClub, просто проигнорируйте это письмо.`
    });
    return
  }
  const code = Math.floor(1000 + Math.random() * 9000).toString()
  await strapi.insert('sms-codes', {
    email,
    code,
    expires_at: new Date(Date.now() + 1000 * 60 * 15)
  })

  await transporter.sendMail({
    from: '"Учебный центр STOMCOACH" <education@stom-coach.ru>', // Адрес отправителя
    to: email, // Адрес получателя
    subject: 'Код подтверждения для регистрации в StomClub', // Тема письма
    text: `Ваш код подтверждения: ${code}. Если вы не регистрируетесь в StomClub, просто проигнорируйте это письмо.`
  });
}
