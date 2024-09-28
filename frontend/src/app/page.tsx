import { api } from "~/trpc/server";

import Hero from "./_lib/components/hero";
import Menu from "./_lib/components/menu";
import Events from "./_lib/components/events";
import AboutUs from "./_lib/components/about-us";
import { getServerAuthSession } from "~/server/auth";

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
    <main className="flex flex-col">
      <div className="flex flex-col gap-[36px] mt-3 md:mt-8">
        <Hero data={settings} event={mainEvent} />
        <Menu />
      </div>

      <div className="h-[36px]"></div>
      <Events events={events} />
      <AboutUs />
    </main>
  );
}

