import { createTRPCRouter } from "~/server/api/trpc";
import { strapiRouter } from "./routers/strapi";
import { mapRouter } from "./routers/map";
import { serviceRouter } from "./routers/service";
import { authRouter } from "./routers/auth";
import { lkRouter } from "./routers/lk";
import { paymentRouder } from "./routers/payments";
import promocodes from "./routers/promocodes";

export const appRouter = createTRPCRouter({
  strapi: strapiRouter,
  map: mapRouter,
  service: serviceRouter,
  auth: authRouter,
  lk: lkRouter,
  payments: paymentRouder,
  promocodes
});

// export type definition of API
export type AppRouter = typeof appRouter;
