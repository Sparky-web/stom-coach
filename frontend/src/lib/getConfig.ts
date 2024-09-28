import { headers } from 'next/headers'
import { cache } from 'react'
import getCity from '~/functions/getCity'
import { api } from '~/trpc/server'

export const getConfig = cache(async () => {
  const item = await api.strapi.getSettings.query()

  const heads = headers()
  const city = await getCity(
    heads.get('x-forwarded-for') as string
  )

  return { ...item, city }
})
