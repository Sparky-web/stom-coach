import { api } from "~/trpc/server";

import Hero from "./hero";
import Menu from "./menu";
import Events from "./events";

export default async function Home() {
  const settings = await api.strapi.getSettings.query()
  const mainEvent = await api.strapi.getMainEvent.query()

  const events = await api.strapi.getEvents.query({
    filters: {
      date: {
        $gte: new Date().toISOString()
      }
    }
  })

  return (
    <main className="flex flex-col gap-[36px]">
      <div className="flex flex-col gap-[36px]">
        <Hero data={settings} event={mainEvent} />
        <Menu />
      </div>
      <Events events={events} />
    </main>
  );
}

