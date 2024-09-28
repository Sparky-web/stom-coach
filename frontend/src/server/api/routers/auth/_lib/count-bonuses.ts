import strapi from "~/server/strapi";

export default async function countBonuses(email: string) {
  const { data } = await strapi.get('orders', {
    filters: {
      email,
      is_paid: true
    },
    pagination: {
      limit: 1000
    }
  })

  let {data: levels} = await strapi.get('levels')

  levels = levels.sort((a: any, b: any) => a.attributes.required_events_visits - b.attributes.required_events_visits)

  let bonusesAmount = 500

  for (let i = 0; i < data.length; i++) {
    const order = data[i]

    let currentLevel
    for(let level of levels) { 
      if(i + 1 >= level.attributes.required_events_visits) {
        currentLevel = level
      }
    }

    bonusesAmount += order.attributes.price / 100 * currentLevel.attributes.cashback_percent 
  }

  return bonusesAmount
}

