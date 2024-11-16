import CityBadge from "./city-badge";
import { api } from "~/trpc/server";
import EventCard from "../_components/event-card";
import { getConfig } from "~/lib/getConfig";
import ClientEvents from "./client-events";
import _ from "lodash";

export const metadata = {
  title: "Все мероприятия | Учебный центр STOMCOACH"
}


export default async function Events() {
  const { city } = await getConfig()
  const cityId = await api.strapi.getCityId.query(city)
  const events = await api.strapi.getEvents.query({
    filters: {
      city: cityId,
      date: {
        $gte: new Date().toISOString()
      }
    }
  })

  const cities = await api.strapi.getCities.query()

  const specsAndPositions = await api.strapi.getSpecsAndPositions.query()

  return (
    <div className="container py-[32px]">
      <ClientEvents events={events} cityId={cityId} cities={cities} specs={specsAndPositions.specs.filter(e => e.attributes.name !== 'Другое')}  />
    </div>
  )
}