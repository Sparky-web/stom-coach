import {
  createTRPCRouter,
  publicProcedure,
} from "~/server/api/trpc";
import getCity from "~/functions/getCity";


export const serviceRouter = createTRPCRouter({
  getLocationByIp: publicProcedure.query(async ({ ctx }) => {
    return await getCity(ctx.headers.get('x-forwarded-for') as string);
  })
});
