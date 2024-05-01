import { TRPCError } from "@trpc/server";
import axios from "axios";
import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import strapi from "~/server/strapi";
import { Settings, Event } from "~/types/entities";
import { APIResponseCollection } from "~/types/types";


export const strapiRouter = createTRPCRouter({
  getSettings: publicProcedure.query(async ({ ctx, input }) => {
    const data = await strapi.get("nastrojki", { populate: "*" });
    return data.data.attributes as Settings;
  }),
  getEvents: publicProcedure.input(z.object({
    filters: z.record(z.string(), z.any()).optional(),
    options: z.record(z.string(), z.any()).optional()
  }).optional()).query(async ({ ctx, input }) => {
    const data = await strapi.get("events", {
      populate: {
        tags: "*",
        speakers: {
          populate: "*"
        },
        image: "*",
        city: "*"
      }, sort: "date:asc",
      filters: input?.filters,
      ...input?.options
    });
    return data.data as APIResponseCollection<"api::event.event">["data"];
  }),
  getEvent: publicProcedure.input(z.number()).query(async ({ ctx, input }) => {
    try {
      const data = await strapi.get(`events/${input}`, {
        populate: {
          tags: "*",
          speakers: {
            populate: "*"
          },
          image: "*",
          city: "*"
        }
      });

      return data.data as Event;
    } catch (e: any) {
      if (axios.isAxiosError(e) && e.response?.status === 404) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Такое мероприятие не найдено',
          // optional: pass the original error to retain stack trace
          cause: e,
        });
      }
      else {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Ошибка сервера',
          // optional: pass the original error to retain stack trace
          cause: e,
        });
      }

    }
  }),
  getCities: publicProcedure.query(async ({ ctx }) => {
    const data = await strapi.get("cities", { populate: "" });
    return data.data as APIResponseCollection<"api::city.city">["data"];

  })
});
