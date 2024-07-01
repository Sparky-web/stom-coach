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
  getPaymentLink: publicProcedure.input(z.object({
    eventId: z.number(),
    optionId: z.number().optional().nullable(),
    phone: z.string(),
    email: z.string().email()
  })).query(async ({ ctx, input }) => {

    const { data } = await axios.post('https://3dsec.sberbank.ru/payment/rest/register.do', undefined, {
      params: {
        userName: env.SBER_LOGIN,
        password: env.SBER_PASSWORD,
        amount: 1 * 100,
        currency: 643,
        language: 'ru',
        email: "babinovvlad@gmail.com",
        phone: "9998888888",

        // orderNumber: input.eventId,
        returnUrl: "http://localhost:3000/payment/success",
        orderBundle: JSON.stringify({
          customerDetails: {
            phone: "%2B79888888877",
            inn: "516974792202",
            passport: "4507 443564",
          },
          cartItems: {
            items: [
              {
                positionId: 1,
                name: "По-аджарски \"Лодочка\" SMALL",
                quantity: {
                  value: "1",
                  measure: "0",
                },
                itemCode: "270_235.00",
                itemPrice: 23500,
                itemAttributes: {
                  attributes: [
                    {
                      name: "paymentMethod",
                      value: "1",
                    },
                    {
                      name: "paymentObject",
                      value: "4",
                    },
                    {
                      name: "supplier_info.phones",
                      value: "%2B79222075050", 
                    },
                    {
                      name: "supplier_info.inn",
                      value: "6686043920",
                    },
                    {
                      name: "excise",
                      value: "10.0",
                    },
                    {
                      name: "country_code",
                      value: "810",
                    },
                    {
                      name: "declaration_number",
                      value: "12332234533",
                    },
                    {
                      name: "userData",
                      value: "user data",
                    },
                    {
                      name: "sectoralItemProps[0].federalId",
                      value: "001",
                    },
                    {
                      name: "sectoralItemProps[0].date",
                      value: "10.10.2021",
                    },
                    {
                      name: "sectoralItemProps[0].number",
                      value: "123/4567",
                    },
                    {
                      name: "sectoralItemProps[0].value",
                      value: "value1",
                    },
                    {
                      name: "sectoralItemProps[1].federalId",
                      value: "003",
                    },
                    {
                      name: "sectoralItemProps[1].date",
                      value: "11.10.2021",
                    },
                    {
                      name: "sectoralItemProps[1].number",
                      value: "321/4567",
                    },
                    {
                      name: "sectoralItemProps[1].value",
                      value: "value2",
                    },
                  ],
                },
              },
            ],
          },
        }),
      }
    })
  })
});
