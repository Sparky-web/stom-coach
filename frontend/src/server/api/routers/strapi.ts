import { BlocksContent } from "@strapi/blocks-react-renderer";
import { TRPCError } from "@trpc/server";
import axios from "axios";
import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import strapi from "~/server/strapi";
import {
  Settings,
  Event,
  City,
  PhotoAlbum,
  StudyDocument,
} from "~/types/entities";

export const strapiRouter = createTRPCRouter({
  getSettings: publicProcedure.query(async ({ ctx, input }) => {
    const data = await strapi.get("nastrojki", { populate: "*" });
    return data.data.attributes as Settings;
  }),
  getEvents: publicProcedure
    .input(
      z
        .object({
          filters: z.record(z.string(), z.any()).optional(),
          options: z.record(z.string(), z.any()).optional(),
        })
        .optional()
    )
    .query(async ({ ctx, input }) => {
      const data = await strapi.get("events", {
        populate: {
          tags: "*",
          speakers: {
            populate: "*",
          },
          image: "*",
          cover_image: "*",
          city: "*",
          options: "*",
        },
        sort: "date:asc",
        filters: input?.filters,
        ...input?.options,
        pagination: {
          limit: 100,
        },
      });
      return data.data as Event[];
    }),
  // getShortEventsAll: async () => {
  //   const data = await strapi.get('events', {
  //     pagination: {
  //       limit: 1000
  //     }
  //   })

  //   return data.data.map((e: any) => ({ id: e.id, name: e.attributes.name })) as {
  //     id: number,
  //     name: string
  //   }[]
  // },
  getEvent: publicProcedure.input(z.number()).query(async ({ ctx, input }) => {
    try {
      const data = await strapi.get(`events/${input}`, {
        populate: {
          tags: "*",
          speakers: {
            populate: "*",
          },
          image: "*",
          city: "*",
          options: "*",
        },
      });

      return data.data as Event;
    } catch (e: any) {
      if (axios.isAxiosError(e) && e.response?.status === 404) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Такое мероприятие не найдено",
          // optional: pass the original error to retain stack trace
          cause: e,
        });
      } else {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Ошибка сервера",
          // optional: pass the original error to retain stack trace
          cause: e,
        });
      }
    }
  }),
  getCities: publicProcedure.query(async ({ ctx }) => {
    const data = await strapi.get("cities", { populate: "" });
    return data.data as City[];
  }),
  getCityId: publicProcedure.input(z.string()).query(async ({ ctx, input }) => {
    const data = await strapi.get("cities", {
      populate: "",
      filters: {
        name: input,
      },
    });
    return data.data[0]?.id || (null as number | null);
  }),
  getSpecsAndPositions: publicProcedure.query(async ({ ctx }) => {
    const { data: specs } = await strapi.get("specialities", { populate: "" });
    const { data: positions } = await strapi.get("positions", { populate: "" });
    return {
      specs: specs as {
        id: number;
        attributes: {
          name: string;
        };
      }[],
      positions: positions as {
        id: number;
        attributes: {
          name: string;
          enableSpeciality: boolean;
        };
      }[],
    };
  }),
  getPrivacyPolicy: publicProcedure.query(async ({ ctx }) => {
    const data = await strapi.get("politika-obrabotki-personalnyh-dannyh", {
      populate: "*",
    });
    return data.data as { id: number; attributes: { text: BlocksContent } };
  }),
  updateUser: protectedProcedure
    .input(
      z.object({
        first_name: z.string().min(2).max(50),
        last_name: z.string().min(2).max(50),
        second_name: z.string().min(2).max(50),
        phone: z.string().min(10).max(20),
        email: z.string().email(),
        workplace: z.string().min(2).max(255),
        position: z.number().nullable(),
        speciality: z.number().nullable(),
        custom_position: z.string().min(0).max(255).optional().nullable(),
        custom_speciality: z.string().min(0).max(255).optional().nullable(),
        city: z.string().min(2).max(255),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { data } = await strapi.update(
        "clients",
        ctx.session.user.id,
        input
      );

      return true;
    }),
  getMainEvent: publicProcedure.query(async ({ ctx }) => {
    const { data } = await strapi.get("glavnaya", { populate: "*" });
    const eventId = data?.attributes.main_event?.data?.id;

    if (!eventId) return null;

    const event = await strapi.get(`events/${eventId}`, {
      populate: {
        tags: "*",
        speakers: {
          populate: "*",
        },
        image: "*",
        city: "*",
        options: "*",
      },
    });

    return {
      event: event.data as Event,
      image: data.attributes?.main_event_image as Image,
    };
  }),
  getPhotoAlbums: publicProcedure.query(async ({ ctx }) => {
    const { data } = await strapi.get("photoalbums", { populate: "*" });
    return data as PhotoAlbum[];
  }),

  getStudyDocuments: publicProcedure.query(async ({ ctx }) => {
    const { data } = await strapi.get("study-documents", { populate: "*" });
    return data as StudyDocument[];
  }),

  // add: publicProcedure.query(async ({ ctx }) => {
  //   const positions = [
  //     { name: "Врач-стоматолог" },
  //     { name: "Главный врач" },
  //     { name: "Заведующий отделением" },
  //     { name: "Старшая медсестра/медбрат" },
  //     { name: "Ординатор" },
  //     { name: "Студент", enableSpeciality: false },
  //     { name: "Зубной техник", enableSpeciality: false },
  //     { name: "Ассистент", enableSpeciality: false },
  //     { name: "Администратор", enableSpeciality: false },
  //     { name: "Другое" },
  //   ]
  //   const specs = [
  //     { name: "Стоматолог-терапевт" },
  //     { name: "Стоматолог-ортопед" },
  //     { name: "Стоматолог-хирург" },
  //     { name: "Имплантолог" },
  //     { name: "Детский стоматолог" },
  //     { name: "Пародонтолог" },
  //     { name: "Ассистент" },
  //     { name: "Медсестра/медбрат" },
  //     { name: "Зубной техник" },
  //     { name: "Другое" },
  //   ]

  //   for (let pos of positions) {
  //     const { data } = await strapi.insert("positions", pos)
  //   }

  //   for (let spec of specs) {
  //     const { data } = await strapi.insert("specialities", spec)
  //   }
  // })
});
