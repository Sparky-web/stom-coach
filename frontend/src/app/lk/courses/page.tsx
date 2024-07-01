"use client";

import { api } from "~/trpc/react";
import LkEventCard from "./lk-event-card";

export default function Courses() {
  const { data: events } = api.lk.getMyEvents.useQuery()

  console.log(events)

  return <div className="grid gap-4 mt-2">
    <h2 className="text-2xl font-semibold">Мои курсы</h2>
    {events && <div className="grid grid-cols-[1fr,1fr,1fr] gap-3">
      {events?.map(event => <LkEventCard event={event} />)}
    </div>}
  </div>
}