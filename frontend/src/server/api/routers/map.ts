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

export async function getCoordinates(address: string) {
  const response = await axios.get('https://geocode-maps.yandex.ru/1.x/', {
    params: {
      geocode: address,
      format: 'json',
      apikey: env.YMAPS_API_KEY
    },
  });

  const coordinates = response.data.response.GeoObjectCollection.featureMember[0].GeoObject.Point.pos.split(' ').map(Number).reverse();
  return coordinates;
}


export const mapRouter = createTRPCRouter({
  getCoordinates: publicProcedure.input(z.string()).query(async ({ ctx, input }) => {
    return await getCoordinates(input) as [number, number];
  }),
});
