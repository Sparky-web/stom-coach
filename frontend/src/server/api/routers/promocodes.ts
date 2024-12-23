import { z } from "zod";
import { createTRPCRouter, publicProcedure, rateLimiter, rateLimitMiddleware } from "../trpc";
import strapi from "~/server/strapi";


export const validateCode = async (code: string) => {
  const { data } = await strapi.get('promocodes', { filters: { promocode: code } });

  if (!data.length) throw new Error('Промокод не найден')  

  const limit = data[0].attributes.usage_limit

  if(limit === 0) throw new Error('Промокод уже использован')

  return data[0]
}

export default createTRPCRouter({
  getPromoCode: publicProcedure.use(rateLimiter).input(z.string()).query(async ({ ctx, input }) => {
    const data = await validateCode(input)
    return data.attributes as {
      promocode: string;
      usage_limit: number;
      amount: number;
    }
  }),
})