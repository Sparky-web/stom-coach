import { MapPin, User } from "lucide-react";
import { DateTime, Settings } from "luxon";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";

import { api } from "~/trpc/server";

import MapComponent from "./map";
import cn from "~/functions/cn";
import ErrorPage from "./404";
import SignUpDialog from "./sign-up-dialog";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "~/components/ui/accordion";
import { BlocksRenderer } from "@strapi/blocks-react-renderer";
import { Event } from "~/types/entities";
import { formatDate } from "~/lib/utils";
import ClientImage, { SpeakerImage } from "./client-image";
import SignUpDialogLegal from "./sign-up-dialog-legal";


export default async function EventPage({ params }: { params: { id: string } }) {

  let event: Event | null;
  try {
    event = await api.strapi.getEvent.query(+params.id);
  } catch (e) {
    return <ErrorPage />
  }

  const coordinates: [number, number] = event.attributes.location ? await api.map.getCoordinates.query(event.attributes.location) : [0, 0];

  const formattedDate = formatDate(event.attributes.date.toString());

  const localizer = new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', maximumFractionDigits: 0 });

  const priceFormattedLocalized = localizer.format(event.attributes.price);

  return (
    <div>
      <head>
        <title>{event.attributes.name} | STOMCOACH</title>
      </head>
      <div className="relative">
        {event.attributes.image?.data && <ClientImage url={event.attributes.image?.data?.attributes.url} alt={event.attributes.image?.data.attributes.name} />}

        <div className="absolute h-full w-full bg-primary" style={{ background: event.attributes.image?.data ? 'linear-gradient(180deg, rgba(28.85, 36.66, 52.06, 0.70) 0%, rgba(29, 37, 52, 0.50) 38%, rgba(29, 37, 52, 0.25) 100%), linear-gradient(0deg, rgba(0, 0, 0, 0.20) 0%, rgba(0, 0, 0, 0.20) 100%)' : '' }} />

        <div className="container">
          <div className="flex flex-col gap-3 relative text-white  py-[64px]  max-w-[650px]">
            {!!event.attributes.tags?.length && <div className="text-white/70 font-semibold text-sm items-center whitespace-pre">
              {event.attributes.tags.map(e => e.name).join("  •  ")}
            </div>}
            <h1 className="font-bold text-[42px] leading-snug">
              {event.attributes.name}
            </h1>
            {event.attributes.city.data && <div className="text-white/70 font-semibold text-sm items-center mt-3 ">
              {["г. " + event.attributes.city.data?.attributes.name, ...(event.attributes.speakers?.data || []).map(e => e.attributes.name)].join("  •  ")}
            </div>}
          </div>
        </div>
      </div>

      <div className="container py-[48px] grid lg:grid-cols-[1fr,1fr] gap-[36px]">
        <div className="grid gap-8 content-between">
          <div className="grid gap-6">
            <h2 className="text-xl font-semibold">{formattedDate}</h2>
            <div className="text-black/70 prose" dangerouslySetInnerHTML={{ __html: event.attributes.description }}>
            </div>
          </div>
          {new Date(event.attributes.date) > new Date() ? <div className="flex flex-col gap-4">
            <h2 className="text-xl font-semibold">Оплата: </h2>
            {!event.attributes.options?.length && <div className="grid gap-4">
              {event.attributes?.ticketsLeft < 10 && <Badge className="py-2 px-6 text-[16px] border-black" variant={'outline'}>осталось мест: {event.attributes.ticketsLeft}</Badge>}

              <div className="flex justify-between gap-4">
                <span className="text-3xl font-bold">{priceFormattedLocalized}</span>
                {event.attributes.ticketsLeft > 0 && <div className="flex gap-3">
                  <SignUpDialog event={event} selectedOption={null} />
                  <SignUpDialogLegal event={event} selectedOption={null} />
                  {/* <Button variant={'outline'} className="uppercase">Для юр. лиц</Button> */}
                </div>}
              </div>
            </div>}

            {!!event.attributes.options?.length && <div className="grid gap-4">
              {event.attributes.options.map(e => {
                return (
                  <div className="grid gap-2 rounded-xl bg-neutral-100 p-4 text-sm font-semibold">
                    <h4>{e.name}</h4>
                    <div className="flex justify-between gap-4">
                      <span className="text-3xl font-bold">{localizer.format(e.price)}</span>
                      {e.ticketsLeft > 0 ? <div className="flex gap-3">
                        <SignUpDialog event={event} selectedOption={e} />
                        <SignUpDialogLegal event={event} selectedOption={e} />
                      </div> :
                        <Badge className="py-2 px-6 text-[16px] border-amber-600 text-amber-600" variant={'outline'}>мест нет</Badge>
                      }
                    </div>
                    {e.ticketsLeft < 10 && e.ticketsLeft > 0 && <Badge className="py-2 px-6 text-[16px] border-amber-600 text-amber-600" variant={'outline'}>осталось мест: {e.ticketsLeft}</Badge>}
                  </div>
                )
              })}
            </div>}
          </div>
            : <Badge className="py-2 px-6 text-[16px] border-black" variant={'outline'}>мероприятие завершено</Badge>
          }

        </div>
        <div className={cn("grid gap-4", event.attributes.location ? "content-between" : "content-start")}>
          <div className="flex-col gap-4 flex">
            <div className=" text-xl font-semibold ">Спикеры:</div>

            {event.attributes.speakers?.data.map(e => (
              <Accordion type="single" collapsible>
                <AccordionItem value={e.id} asChild>
                  <div className=" px-5 py-3 rounded-2xl bg-neutral-100 grid gap-3">
                    <div className="flex justify-between items-center ">
                      <div className="justify-start items-center gap-4 flex">
                        {
                          e.attributes.avatar?.data?.attributes.url ?
                            <SpeakerImage url={e.attributes.avatar?.data?.attributes.url || ""} alt={e.attributes.name} />
                            : <div className="w-16 h-16 rounded-3xl bg-blue-800 flex items-center justify-center">
                              <User className="w-10 h-8 text-white" />
                            </div>
                        }

                        <div className="flex-col gap-1 ">
                          <div className="text-black text-base font-bold">{e.attributes.name}</div>
                          <div className="text-black text-opacity-60 text-sm font-normal">{e.attributes.workplace || ""}</div>
                        </div>
                      </div>

                      <AccordionTrigger className="hover:no-underline">
                        <Button variant={'outline'} className="uppercase mr-3" style={{ textDecoration: 'none !important' }} size={'sm'}>Биография</Button>
                      </AccordionTrigger>
                    </div>
                    <AccordionContent>
                      {e.attributes.bio ? <BlocksRenderer content={e.attributes.bio} /> : 'Нет описания'}
                    </AccordionContent>
                  </div>
                </AccordionItem>
              </Accordion>
            ))}

          </div>
          <div className="flex-col gap-3 flex ">
            <div className="gap-3 inline-flex items-center ">
              <MapPin className="w-4 h-4" />
              <div className="text-black text-base font-normal">{event.attributes.location || event.attributes.city.data?.attributes.name}</div>
            </div>
            {event.attributes.location && <div className="h-56 bg-zinc-300 rounded-2xl relative overflow-hidden">
              <MapComponent coordinates={coordinates} />
            </div>}
          </div>
        </div>
      </div>
    </div>)
}