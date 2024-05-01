import CityBadge from "./city-badge";
import { api } from "~/trpc/server";
import EventCard from "../_components/event-card";
import { getConfig } from "~/lib/getConfig";
import ClientEvents from "./client-events";
import _ from "lodash";

export default async function Events() {
  const { city } = await getConfig()
  const events = await api.strapi.getEvents.query({
    filters: {
      city: {
        $eq: city
      },
      date: {
        $gte: new Date().toISOString()
      }
    }
  })

  const actualCities = await api.strapi.getEvents.query({
    filters: {
      // date: {
      //   $gte: new Date().toISOString()
      // }
    },
    options: {
      populate: ""
    }
  })

  console.log(_.uniq(actualCities.map(e => e.attributes?.city)))

  return (
    <div className="container py-[32px]">
      <ClientEvents events={events} city={city} />
    </div>
  )
}