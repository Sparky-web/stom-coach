import { api } from "~/trpc/server";
import BonusesComponent from "./_lib/components/bonuses-component";
import { BonusPage } from "./_lib/types";

// In your main component or page
export default async function Bonuses() {
  const data  = await api.lk.getBonucePage.query()
  return <div>
    <BonusesComponent {...data} />
  </div>
}