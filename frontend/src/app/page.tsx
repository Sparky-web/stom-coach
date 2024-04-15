
import { api } from "~/trpc/server";
import Hero from "./_components/hero";

export default async function Home() {
  const settings = await api.strapi.getSettings.query()
  return (
    <main>
      <Hero data={settings} />
    </main>
  );
}

