
import { api } from "~/trpc/server";

import Hero from "./hero";
import Menu from "./menu";
import Events from "./events";
import Contacts from "./_components/contacts";

export default async function Home() {
  const settings = await api.strapi.getSettings.query()
  const events = await api.strapi.getEvents.query({
    filters: {
      date: {
        $gte: new Date().toISOString()
      }
    }
  })

  return (
    <main className="flex flex-col">
      <div className="flex flex-col gap-[36px]">
        <Hero data={settings} />
        <Menu />
      </div>
      <Events events={events} />
      <Contacts settings={settings} />
    </main>
  );
}

