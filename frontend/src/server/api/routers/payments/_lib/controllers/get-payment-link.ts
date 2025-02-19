import { publicProcedure } from "~/server/api/trpc"
import { z } from "zod";
import axios from "axios";
import { env } from "~/env";
import https from "https"
import { TRPCError } from "@trpc/server";
import { Event } from "~/types/entities";
import startCheckingPayment from "../utils/start-checking-payment";
import strapi from "~/server/strapi";
import onPaymentSuccess from "../utils/on-payment-success";
import { createPayment } from "../utils/yookassa";
import promocodes, { validateCode } from "../../../promocodes";
import promocodeReduceCount from "../utils/promocode-reduce-count";

const getPaymentLink = publicProcedure.input(z.object({
  eventId: z.number(),
  optionId: z.number().optional().nullable(),
  phone: z.string(),
  email: z.string().email(),
  first_name: z.string(),
  last_name: z.string(),
  second_name: z.string(),
  speciality: z.number().nullable().optional(),
  custom_speciality: z.string().optional().nullable(),
  position: z.number(),
  custom_position: z.string().optional().nullable(),
  workplace: z.string(),
  city: z.string().optional(),
  useBonuses: z.boolean(),
  usePromocode: z.boolean(),
  promocode: z.string().optional().nullable(),
})).mutation(async ({ ctx, input }) => {
  try {
    const res = await strapi.get('events/' + input.eventId, {
      populate: "*"
    })

    const event = res.data as Event

    let name = event.attributes.name
    let price = event.attributes.price

    if (input.optionId) {
      const found = event.attributes.options.find(e => e.id === input.optionId)
      if (found) {
        name += " — " + found.name
        price = found.price
      }
    }

    let bonusesWrittenOff = 0
    if (input.useBonuses && !input.usePromocode && ctx.session?.user?.attributes?.bonuses) {
      const bonusesAmount = ctx.session?.user.attributes?.bonuses

      if (bonusesAmount < price) {
        price -= bonusesAmount
        bonusesWrittenOff = bonusesAmount
      } else {
        price = 1
        bonusesWrittenOff = bonusesAmount - price + 1
      }
    }

    if (input.usePromocode && input.promocode && !input.useBonuses) {
      const promocodeData = await validateCode(input.promocode, event.id)
      const bonusesAmount = promocodeData.attributes.amount
      if (bonusesAmount < price) {
        price -= bonusesAmount
        bonusesWrittenOff = bonusesAmount
      } else {
        price = 1
        bonusesWrittenOff = bonusesAmount - price + 1
      }

      await promocodeReduceCount(input.promocode)
    }

    const optionName = input.optionId ? event.attributes.options.find(e => e.id === input.optionId)?.name : null
    const order = await strapi.insert('orders', {
      event: event.id,
      phone: input.phone,
      first_name: input.first_name,
      last_name: input.last_name,
      second_name: input.second_name,
      email: input.email,
      workplace: input.workplace,
      speciality: input.speciality,
      position: input.position,
      custom_position: input.custom_position,
      custom_speciality: input.custom_speciality,
      is_paid: false,
      option_id: input.optionId,
      option_name: optionName,
      price: price,
      bonuses: bonusesWrittenOff,
      promocode: input.promocode,
      city: input.city || '',
    })

    if (!env.ENABLE_PAYMENTS) {
      const orderId = Math.floor(1000 + Math.random() * 9000).toString()
      await strapi.update('orders', order, {
        sberbank_order_id: orderId,
        sberbank_payment_url: Math.floor(1000 + Math.random() * 9000).toString(),
      })
      onPaymentSuccess(orderId)
      return
    }

    const { id, paymentUrl } = await createPayment({
      amount: price,
      returnUrl: env.BASE_URL + "/payment/success",
      description: event.attributes.name + optionName ? ` — ${optionName}` : '',
      orderId: order,
      email: input.email
    })

    console.log('Платеж создан:', id, paymentUrl)

    await strapi.update('orders', order, {
      sberbank_order_id: id,
      sberbank_payment_url: paymentUrl,
      // is_paid: true
    })

    startCheckingPayment(id)

    return {
      orderId: id,
      formUrl: paymentUrl
    } as {
      orderId: string;
      formUrl: string;
    }

  }
  catch (e) {
    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Ошибка при создании заказа на оплату',
    })
  }
})

export default getPaymentLink
// Функция проверки статуса платежа
// Основная функция