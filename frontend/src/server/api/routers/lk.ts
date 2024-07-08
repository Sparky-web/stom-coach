import { LkEvent } from "~/types/event"
import { createTRPCRouter, protectedProcedure } from "../trpc"
import strapi from "~/server/strapi"

export const lkRouter = createTRPCRouter({
  getMyEvents: protectedProcedure.query(async ({ ctx }) => {
    const { data: payments } = await strapi.get('orders', {
      filters: {
        client: ctx.session.user.id
      },
      populate: '*'
    })

    const events = []

    for (const payment of payments) {
      console.log(payment)
      const eventId = payment.attributes.event.data.id

      const { data } = await strapi.get('events/' + eventId, {
        populate: {
          tags: "*",
          speakers: {
            populate: "*"
          },
          image: "*",
          city: "*"
        }
      })
      events.push({
        ...data,
        attributes: {
          ...data.attributes,
          isPaid: payment.attributes.isPaid
        }
      })
    }

    return events as LkEvent[]
  })
})

