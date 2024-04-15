import { createTRPCRouter } from "~/server/api/trpc";
import { strapiRouter } from "./routers/strapi";

export const appRouter = createTRPCRouter({
  strapi: strapiRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;
