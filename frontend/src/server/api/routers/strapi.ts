import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import strapi from "~/server/strapi";
import { APIResponse } from "~/types/types";

export type Settings =
  APIResponse<"api::nastrojki.nastrojki">["data"]["attributes"];

export const strapiRouter = createTRPCRouter({
  getSettings: publicProcedure.query(async ({ ctx }) => {
    const data = await strapi.get("nastrojki", { populate: "*" });
    return data.data.attributes as Settings;
  }),
});
