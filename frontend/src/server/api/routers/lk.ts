import { LkEvent } from "~/types/event"
import { createTRPCRouter, protectedProcedure } from "../trpc"
import strapi from "~/server/strapi"

export const lkRouter = createTRPCRouter({
  getMyEvents: protectedProcedure.query(async ({ ctx }) => {
    const { data: payments } = await strapi.get('payments', {
      filters: {
        client: ctx.session.user.id
      },
      populate: '*'
    })

    const events = []

    for (const payment of payments) {
      const eventIds = payment.attributes.events.map((event: any) => event.id)
      for (let eventId of eventIds) {
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
    }

    return events as LkEvent[]
  })
})

