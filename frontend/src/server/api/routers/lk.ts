import { LkEvent } from "~/types/entities"
import { createTRPCRouter, protectedProcedure } from "../trpc"
import strapi from "~/server/strapi"
import { off } from "process"

export const lkRouter = createTRPCRouter({
  getMyEvents: protectedProcedure.query(async ({ ctx }) => {
    const { data: payments } = await strapi.get('orders', {
      filters: {
        email: ctx.session.user.attributes.email,
        expired: false
      },
      populate: '*',
      pagination: {
        limit: 1000,
      }
    })

    const events = []

    for (const payment of payments) {
      const eventId = payment.attributes.event.data?.id
      if (!eventId) continue

      const { data } = await strapi.get('events/' + eventId, {
        populate: {
          tags: "*",
          speakers: {
            populate: "*"
          },
          image: "*",
          city: "*"
        },
       
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
  }),
  getBonucePage: protectedProcedure.query(async ({ ctx }) => {
    const {data: levels} = await strapi.get('levels', { populate: "*" })

    const {data: payments} = await strapi.get('orders', {
      filters: {
        email: ctx.session.user.attributes.email,
        is_paid: true
      },
      pagination: {
        limit: 1000
      }
    })

    return {
      levels: levels.map((e: any) => ({
        name: e.attributes.name,
        color: e.attributes.color,
        cashbackPercent: e.attributes.cashback_percent,
        requiredEventsVisits: e.attributes.required_events_visits,
        additionalBonuses: e.attributes.privileges?.map?.((e: any) => e.name) || []
      })).sort(((a: any, b: any) => a.requiredEventsVisits - b.requiredEventsVisits)),
      userBonuses: {
        eventsVisited: payments.length,
        bonuses: ctx.session.user.attributes.bonuses
      }
    }
  })
})


