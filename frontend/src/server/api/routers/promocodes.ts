import { z } from "zod";
import { createTRPCRouter, publicProcedure, rateLimiter, rateLimitMiddleware } from "../trpc";
import strapi from "~/server/strapi";


export const validateCode = async (code: string, event_id?: number) => {
  const { data } = await strapi.get('promocodes', { filters: { promocode: code }, populate: "*" });

  if (!data.length) throw new Error('Промокод не найден')

  const limit = data[0].attributes.usage_limit

  if (limit === 0) throw new Error('Промокод уже использован')

  if (event_id && data[0].attributes.events?.data?.length) {
    let isEventFilterPassed = false
    for (const event of data[0].attributes.events?.data) {
      if (event.id === event_id) {
        isEventFilterPassed = true
        break
      }
    }

    if (!isEventFilterPassed) throw new Error('Промокод не применим к этому мероприятию')
  }

  return data[0]
}

export default createTRPCRouter({
  getPromoCode: publicProcedure.use(rateLimiter).input(
    z.object({
      promocode: z.string(),
      event_id: z.number(),
    })
  ).query(async ({ ctx, input }) => {
    const data = await validateCode(input.promocode, input.event_id)
    return data.attributes as {
      promocode: string;
      usage_limit: number;
      amount: number;
    }
  }),
})