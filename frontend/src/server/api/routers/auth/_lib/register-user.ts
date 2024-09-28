import bcrypt from 'bcrypt';
import strapi from '~/server/strapi';
import countBonuses from './count-bonuses';


export default async function registerUser(phone: string, email: string, password: string) {
  const hashedPassword = await bcrypt.hash(password, 10);

  const { data: [client] } = await strapi.get('clients', {
    filters: {
      phone
    }
  })

  const { data: [clientByEmail] } = await strapi.get('clients', {
    filters: {
      email
    }
  })

  if (client) {
    throw new Error('пользователь с таким номером уже зарегистрирован')
  }

  if (clientByEmail) {
    throw new Error('пользователь с таким email уже зарегистрирован')
  }

  const id = await strapi.insert('clients', {
    phone,
    email,
    password: hashedPassword,
    bonuses: await countBonuses(email)
  })

  return id;
}
