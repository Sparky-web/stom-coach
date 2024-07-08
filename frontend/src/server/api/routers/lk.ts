import { LkEvent } from "~/types/entities"
import { createTRPCRouter, protectedProcedure } from "../trpc"
import strapi from "~/server/strapi"

export const lkRouter = createTRPCRouter({
  getMyEvents: protectedProcedure.query(async ({ ctx }) => {
    const { data: payments } = await strapi.get('orders', {
      filters: {
        phone: ctx.session.user.attributes.phone,
        expired: false
      },
      populate: '*'
    })

    const events = []

    for (const payment of payments) {
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
        },
        order: payment.attributes
      })
    }

    return events as LkEvent[]
  })
})

