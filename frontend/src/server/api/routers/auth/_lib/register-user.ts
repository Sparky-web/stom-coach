import bcrypt from 'bcrypt';
import strapi from '~/server/strapi';


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
    throw new Error('Пользователь с таким номером уже зарегистрирован')
  }

  if (clientByEmail) {
    throw new Error('Пользователь с таким email уже зарегистрирован')
  }

  const id = await strapi.insert('clients', {
    phone,
    email,
    password: hashedPassword
  })

  return id;
}
