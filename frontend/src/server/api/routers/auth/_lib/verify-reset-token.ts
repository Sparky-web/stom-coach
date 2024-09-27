import strapi from '~/server/strapi';
import jwt from 'jsonwebtoken';
import { env } from '~/env';
import { decrypt } from './create-token';

const secret = env.NEXTAUTH_SECRET;

export default async function verifyResetToken(token: string) {
  let email: string;
  let password: string;

  try {
    const decoded = jwt.verify(token, secret) as {data: string};
    console.log(decoded)
    const decryptedPayload = decrypt(decoded.data) as { email: string, password: string };

    email = decryptedPayload.email;
    password = decryptedPayload.password;

    const { data: [client] } = await strapi.get('clients', { filters: { email } });
    if (!client) throw new Error('cсылка на сброс пароля недействительна')
    if (client.attributes.password !== password) throw new Error('cсылка на сброс пароля недействительна')
  } catch (e) {
    throw new Error('ссылка на сброс пароля недействительна')
  }

  return {
    email
  }
}