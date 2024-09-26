import "server-only"

import nodemailer from "nodemailer";
import { env } from "~/env";

export const transporter = nodemailer.createTransport({
  host: env.SMTP_HOST, // SMTP-сервер
  port: env.SMTP_PORT, // Порт
  secure: false, // true для 465, false для других портов
  auth: {
    user: env.SMPT_EMAIL, // Ваш email
    pass: env.SMTP_PASSWORD // Ваш пароль от email.
  },
  tls: {
    rejectUnauthorized: false // This bypasses the certificate validation
  }
});
