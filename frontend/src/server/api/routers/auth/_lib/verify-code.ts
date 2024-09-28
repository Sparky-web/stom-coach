import strapi from "~/server/strapi";

export default async function verifyCode(code: number, email: string) {
  const { data } = await strapi.get('sms-codes', {
    filters: {
      code,
      email
    }
  })

  if (data.length === 0) {
    throw new Error('Неверный код')
  }

  const codeData = data[0]
  await strapi.update('sms-codes', codeData.id, {
    expires_at: new Date(Date.now())
  })

  return codeData
}