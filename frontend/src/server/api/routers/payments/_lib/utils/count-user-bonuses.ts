import { Level } from "~/app/lk/bonuses/_lib/types";
import strapi from "~/server/strapi";

export default async function countUserBonuses(strapiOrder: any) {
  const { data: [user] } = await strapi.get('clients', {
    filters: {
      email: strapiOrder.attributes.email
    },
    populate: "*"
  })

  if (!user) return

  let newBonuses = user.attributes.bonuses
  if (strapiOrder.attributes.bonuses > 0) {
    newBonuses = newBonuses - strapiOrder.attributes.bonuses
  } else {
    const level = await getUserLevel(strapiOrder.attributes.email)
    newBonuses = newBonuses + strapiOrder.attributes.price * level.cashbackPercent / 100
  }

  await strapi.update('clients', user.id, {
    bonuses: newBonuses
  })
}

async function getUserLevel(email: string) {
  const { data: levels } = await strapi.get('levels')

  const { data: payments } = await strapi.get('orders', {
    filters: {
      email,
      is_paid: true
    },
    pagination: {
      limit: 1000
    }
  })

  const eventsVisited = payments.length
  let currentLevelIndex = 0
  for (let i = 0; i < levels.length; i++) {
    if (eventsVisited >= levels[i].requiredEventsVisits) {
      currentLevelIndex = i
    }
  }

  const level = levels[currentLevelIndex]

  return {
    name: level.attributes.name,
    color: level.attributes.color,
    cashbackPercent: level.attributes.cashback_percent,
    requiredEventsVisits: level.attributes.required_events_visits,
  } as SmallLevel
}

type SmallLevel = Omit<Level, 'additionalBonuses'>