import { publicProcedure } from "~/server/api/trpc"
import { z } from "zod";
import strapi from "~/server/strapi";
import { env } from "~/env";
import { TRPCError } from "@trpc/server";
import { addLegalOrderToSpreadsheet } from "~/lib/add-new-order-to-spreadsheet";
import { transporter } from "~/lib/mail";


const legalSignUp = publicProcedure.input(z.object({
  event: z.string(),
  option: z.string().optional().nullable(),
  name: z.string(),
  phone: z.string(),
  email: z.string().email(),
  company: z.string().nullable().optional(),
  companyFull: z.string(),
  position: z.string(),
  speciality: z.string()
})).mutation(async ({ ctx, input }) => {
  try {
    const { data: settings } = await strapi.get('nastrojki', { populate: "admin_emails" });
    const adminEmails = settings.attributes.admin_emails.map(e => e.email)

    await addLegalOrderToSpreadsheet({
      event_name: input.event,
      option_name: input.option || '',
      name: input.name,
      phone: input.phone,
      company: input.company || '',
      email: input.email,
      companyFull: input.companyFull,
      position: input.position,
      speciality: input.speciality
    })

    const emailOptions = {
      from: '"Учебный центр STOMCOACH" <education@stom-coach.ru>', // Адрес отправителя
      subject: 'Новая заявка на мероприятие от юр. лица', // Тема письма
      text: `` +
        `Новая заявка на мероприятие в Учебном центре STOMCOACH от юр. лица
Название мероприятия: ${input.event} ${input.option ? `— ${input.option}` : ''}
ФИО: ${input.name}
телефон: ${input.phone}
email: ${input.email}
должность: ${input.position}
специальность: ${input.speciality}
компания: ${input.company}

карточка компании:
${input.companyFull}`
    }

    if (env.ENABLE_EMAILS) {
      for (const email of adminEmails) {
        await transporter.sendMail({
          ...emailOptions,
          to: email
        });
      }
    }
  }

  catch (e) {
    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Ошибка при создании заявки',
    })
  }
})

export default legalSignUp