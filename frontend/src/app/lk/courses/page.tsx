"use client";

import { api } from "~/trpc/react";
import LkEventCard from "./lk-event-card";
import { Button } from "~/components/ui/button";
import Link from "next/link";



export default function Courses() {
  const { data: events, isPending } = api.lk.getMyEvents.useQuery()

  return <div className="grid gap-4 mt-2">
    <h2 className="text-2xl font-semibold">Мои курсы</h2>
    {events && <div className="grid md:grid-cols-[1fr,1fr] xl:grid-cols-[1fr,1fr,1fr] gap-3">
      {events?.map(event => <LkEventCard event={event} />)}
    </div>}

    {!isPending && events?.length === 0 && <div className="text-center py-8 grid gap-2 justify-center justify-items-center">
      <h2 className="text-xl font-semibold">Тут пока пусто</h2>
      <p className="text-sm text-muted-foreground">Вы еще не записались ни на одно мероприятие</p>

      <Link href="/events">
        <Button variant={'tenary'} className="w-fit mt-3">
          к мероприятиям
        </Button>
      </Link>
    </div>}
  </div>
}