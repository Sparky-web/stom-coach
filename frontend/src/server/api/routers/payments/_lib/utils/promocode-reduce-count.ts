import strapi from "~/server/strapi";

export default async function promocodeReduceCount(promocode: string) {
  const { data } = await strapi.get('promocodes', { filters: { promocode: promocode } });

  if(!data.length) return

  const limit = data[0].attributes.usage_limit

  await strapi.update('promocodes', data[0].id, {
    usage_limit: limit - 1
  })
}
