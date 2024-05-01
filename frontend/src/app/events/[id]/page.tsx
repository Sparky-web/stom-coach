
import { MapPin, User } from "lucide-react";
import { DateTime, Settings } from "luxon";
import { redirect } from 'next/navigation'
import Image from "next/image";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "~/components/ui/collapsible";
import { api } from "~/trpc/server";

import MapComponent from "./map";
import cn from "~/functions/cn";
import { APIResponseData } from "~/types/types";
import ErrorPage from "./404.tsx";
import Contacts from "~/app/_components/contacts";

Settings.defaultLocale = 'ru';

export default async function EventPage({ params }: { params: { id: string } }) {

  let event: APIResponseData<"api::event.event"> | null;
  try {
    event = await api.strapi.getEvent.query(+params.id);
  } catch (e) {
    return <ErrorPage />
  }

  const coordinates = event.attributes.location ? await api.map.getCoordinates.query(event.attributes.location) : [0, 0];

  const eventDate = DateTime.fromISO(event.attributes.date.toString());
  let formattedDate = eventDate.toFormat("dd MMMM, EEEE, HH:mm");
  formattedDate = formattedDate.slice(-5) === "00:00" ? formattedDate.slice(0, -7) : formattedDate;

  const priceFormattedLocalized = new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', maximumFractionDigits: 0 }).format(event.attributes.price);

  return (
    <div>
      <div className="relative">
        {event.attributes.image?.data && <Image src={event.attributes.image?.data?.attributes.url} width={700} height={700}
          className="object-cover object-center absolute h-full w-full "
          alt={event.attributes.image?.data.attributes.name} />}

        <div className="absolute h-full w-full bg-primary" style={{ background: event.attributes.image?.data ? 'linear-gradient(180deg, rgba(28.85, 36.66, 52.06, 0.70) 0%, rgba(29, 37, 52, 0.50) 38%, rgba(29, 37, 52, 0.25) 100%), linear-gradient(0deg, rgba(0, 0, 0, 0.20) 0%, rgba(0, 0, 0, 0.20) 100%)' : '' }} />

        <div className="container">
          <div className="flex flex-col gap-3 relative text-white  py-[64px]  max-w-[650px]">
            {!!event.attributes.tags?.length && <div className="text-white/70 font-semibold text-sm items-center whitespace-pre">
              {event.attributes.tags.map(e => e.name).join("  •  ")}
            </div>}
            <h1 className="font-bold text-[42px] leading-snug">
              {event.attributes.name}
            </h1>
            <div className="text-white/70 font-semibold text-sm items-center mt-3 whitespace-pre">
              {["г. " + event.attributes.city, ...(event.attributes.speakers?.data || []).map(e => e.attributes.name)].join("  •  ")}
            </div>
            <Button variant={'outline'} className="mt-5 uppercase">Записаться</Button>
          </div>
        </div>
      </div>

      <div className="container py-[48px] grid md:grid-cols-[1fr,1fr] gap-[36px]">
        <div className="grid gap-8 content-start">
          <h2 className="text-xl font-semibold">{formattedDate}</h2>
          <p className="text-black/70">
            Практический курс:
            <br />Особенности восстановления контактных пунктов.
            <br />1. Планирование. Фотопротокол
            <br />2. Как получить эстетичный и функциональный краевой валик?
            <br />3. Планирование. Фотопротокол
            <br />4. Планирование. Фотопротокол
            <br />5. Как получить эстетичный и функциональный краевой валик?
            <br />6. Как получить эстетичный и функциональный краевой валик?
          </p>
          <div className="flex flex-col gap-4">
            <h2 className="text-xl font-semibold">Оплата: </h2>
            <Badge className="py-2 px-6 text-[16px] border-black" variant={'outline'}>осталось мест: {event.attributes.ticketsLeft || event.attributes.ticketsAmount}/{event.attributes.ticketsAmount}</Badge>

            {!event.attributes.options?.length && <div className="flex justify-between gap-4">
              <span className="text-3xl font-bold">{priceFormattedLocalized}</span>
              <div className="flex gap-3">
                <Button variant={'default'} className="uppercase">Записаться</Button>
                <Button variant={'outline'} className="uppercase">Для юр. лиц</Button>
              </div>
            </div>}
          </div>


        </div>
        <div className={cn("grid gap-4", event.attributes.location ? "content-between" : "content-start")}>
          <div className="flex-col gap-4 flex">
            <div className=" text-xl font-semibold ">Спикеры:</div>

            {event.attributes.speakers?.data.map(e => (
              <Collapsible>
                <div className=" px-5 py-3 rounded-2xl bg-neutral-100 grid gap-3">
                  <div className="flex justify-between items-center ">
                    <div className="justify-start items-center gap-4 flex">
                      {
                        e.attributes.avatar?.data?.attributes.url ?
                          <Image src={e.attributes.avatar?.data?.attributes.url || ""} alt={e.attributes.name} width={70} height={70} className="w-16 h-16 rounded-3xl border-3 border-blue-800" />
                          : <div className="w-16 h-16 rounded-3xl bg-blue-800 flex items-center justify-center">
                            <User className="w-10 h-8 text-white" />
                          </div>
                      }

                      <div className="flex-col gap-1 ">
                        <div className="text-black text-base font-bold">{e.attributes.name}</div>
                        <div className="text-black text-opacity-60 text-sm font-normal">{e.attributes.workplace || ""}</div>
                      </div>
                    </div>
                    <CollapsibleTrigger asChild>
                      <Button variant={'outline'} className="uppercase" size={'sm'}>Биография</Button>
                    </CollapsibleTrigger>
                  </div>
                  <CollapsibleContent>
                    {e.attributes.bio}
                  </CollapsibleContent>
                </div>
              </Collapsible>


            ))}
          </div>
          <div className="flex-col gap-3 flex ">
            <div className="gap-3 inline-flex items-center ">
              <MapPin className="w-4 h-4" />
              <div className="text-black text-base font-normal">{event.attributes.location || event.attributes.city}</div>
            </div>
            {event.attributes.location && <div className="h-56 bg-zinc-300 rounded-2xl relative overflow-hidden">
              <MapComponent address="Денисова уральского 5А" coordinates={coordinates} />
            </div>}
          </div>

        </div>

      </div>
      <Contacts />
    </div>)
}