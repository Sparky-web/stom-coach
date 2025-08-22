import { publicProcedure } from "~/server/api/trpc";
import { z } from "zod";
import strapi from "~/server/strapi";
import { env } from "~/env";
import { TRPCError } from "@trpc/server";
import { addLegalOrderToSpreadsheet } from "~/lib/add-new-order-to-spreadsheet";
import { transporter } from "~/lib/mail";
import fs from "fs/promises";

const legalSignUp = publicProcedure
  .input(
    z.object({
      event: z.string(),
      option: z.string().optional().nullable(),
      name: z.string(),
      phone: z.string(),
      email: z.string().email(),
      company: z.string().nullable().optional(),
      companyFull: z.string(),
      position: z.string(),
      speciality: z.string(),
    })
  )
  .mutation(async ({ ctx, input }) => {
    try {
      const { data: settings } = await strapi.get("nastrojki", {
        populate: "admin_emails",
      });
      const adminEmails = settings.attributes.admin_emails.map((e) => e.email);

      await addLegalOrderToSpreadsheet({
        event_name: input.event,
        option_name: input.option || "",
        name: input.name,
        phone: input.phone,
        company: input.company || "",
        email: input.email,
        companyFull: input.companyFull,
        position: input.position,
        speciality: input.speciality,
      });

      const emailOptions = {
        from: '"Учебный центр STOMCOACH" <education@stom-coach.ru>', // Адрес отправителя
        subject: "Новая заявка на мероприятие от юр. лица", // Тема письма
        text:
          `` +
          `Новая заявка на мероприятие в Учебном центре STOMCOACH от юр. лица
Название мероприятия: ${input.event} ${input.option ? `— ${input.option}` : ""}
ФИО: ${input.name}
телефон: ${input.phone}
email: ${input.email}
должность: ${input.position}
специальность: ${input.speciality}
компания: ${input.company}

карточка компании:
${input.companyFull}`,
      };

      let emailTemplate = await fs.readFile(
        "./src/email-template-legal.html",
        "utf8"
      );

      emailTemplate = emailTemplate
        .replace(
          /{event}/g,
          `${input.event} ${input.option ? `— ${input.option}` : ""}`
        )
        .replace(/{name}/g, input.name)
        .replace(/{phone}/g, input.phone)
        .replace(/{email}/g, input.email)
        .replace(/{position}/g, input.position)
        .replace(/{speciality}/g, input.speciality)
        .replace(/{company}/g, input.company || "")
        .replace(/{companyFull}/g, input.companyFull);

      // Определяем параметры письма
      let mailOptions = {
        from: '"Учебный центр STOMCOACH" <education@stom-coach.ru>', // Адрес отправителя
        to: input.email, // Адрес получателя
        subject: "Заявка успешно отправлена", // Тема письма
        // text: 'This is a test email sent from Node.js using SMTP!', // Текст письма
        html: emailTemplate, // HTML-версия письма
      };

      if (env.ENABLE_EMAILS) {
        let info = await transporter.sendMail(mailOptions);
        console.log("Письмо отправлено: %s", info.messageId);

        for (const email of adminEmails) {
          await transporter.sendMail({
            ...emailOptions,
            to: email,
          });
        }
      }
    } catch (e) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Ошибка при создании заявки",
      });
    }
  });

export default legalSignUp;
