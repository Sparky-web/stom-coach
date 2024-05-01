"use client";

import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "~/components/ui/carousel"
import { Card, CardContent } from "~/components/ui/card"
import React from "react"
import EventComponent from "./_components/event-card"
import { Event } from "~/types/entities";



export default function Events(props: { events: Event[] }) {
  const [api, setApi] = React.useState<CarouselApi>()
  const [current, setCurrent] = React.useState(0)
  const [count, setCount] = React.useState(0)

  React.useEffect(() => {
    if (!api) {
      return
    }

    setCount(api.scrollSnapList().length)
    setCurrent(api.selectedScrollSnap() + 1)

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1)
    })
  }, [api])

  return (
    <div className="bg-slate-200">
      <div className="container py-[48px]">
        <Carousel
          setApi={setApi}
          opts={{
            align: "start",
          }}
          className="w-full"
        >
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold mt-0">
              Ближайшие мероприятия
            </h2>

            <div className="flex gap-6">
              <CarouselPrevious variant="ghost" className="text-primary hover:text-primary/90" />
              <CarouselNext variant="ghost" className="text-primary hover:text-primary/90" />
            </div>

          </div>
          <CarouselContent>
            {props.events.map((e, index) => (
              <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                <EventComponent event={e} />
              </CarouselItem>
            ))}
          </CarouselContent>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            {Array(count).fill("").map((e, i) => (
              <span key={e} className={`inline-block w-[10px] h-[10px] rounded-full mx-2 ${current === i + 1 ? "bg-primary" : "bg-primary/25"}`}></span>
            ))}
          </div>
        </Carousel>
      </div>
    </div>

  )
}