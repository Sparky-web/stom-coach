import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import strapi from "~/server/strapi";
import { Settings, Event } from "~/types/entities";
import { APIResponseCollection } from "~/types/types";

import axios from "axios";

import { env } from "~/env";
import getCity from "~/functions/getCity";

export const serviceRouter = createTRPCRouter({
  getLocationByIp: publicProcedure.query(async ({ ctx }) => {
    return await getCity(ctx.headers.get('x-forwarded-for') as string);
  }),
});
