import bcrypt from 'bcrypt';
import strapi from '~/server/strapi';


export default async function registerUser( phone: string, email: string, password: string) {
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const [client] = await strapi.get('clients', {
      filters: {
        phone
      }
    })

    if (client) {
      throw new Error('Пользователь с таким номером уже зарегистрирован')
    }

    const id = await strapi.insert('clients', {
      phone,
      email,
      password: hashedPassword
    })

    return id;
}
