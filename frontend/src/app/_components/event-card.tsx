"use client";
import Image from "next/image"
import { EventBadge } from "~/components/ui/event-badge"
import { Event } from "~/types/entities"
import { DateTime } from "luxon"
import { MapPin, Pin } from "lucide-react"
import { Settings } from 'luxon';
import { useContext } from "react"
import { DataContext } from "../context"
import Link from "next/link"
import { env } from "~/env";
import imageLoader from "~/functions/loader";

Settings.defaultLocale = 'ru';

export default function EventCard(props: { event: Event, className?: string }) {
  const { settings } = useContext(DataContext)

  const cheapestOption = props.event.attributes.options.length ? props.event.attributes.options.reduce((a, b) => a.price < b.price ? a : b) : null

  const prettyPrice = new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
    minimumFractionDigits: 0,
  }).format(cheapestOption?.price || props.event.attributes.price)

  let _thumbnail = props.event.attributes.image?.data?.attributes?.formats?.thumbnail?.url || props.event.attributes.speakers?.data[0]?.attributes.avatar?.data?.attributes?.formats?.thumbnail?.url
  const thumbnail = _thumbnail ? env.NEXT_PUBLIC_STRAPI_URL + _thumbnail : null


  return (
    <Link href={`/events/${props.event.id}`}>
      <div className={"rounded-[18px] h-full bg-white grid grid-rows-[250px,1fr] " + (props.className || '')}>
        <Image
          loader={imageLoader}
          src={props.event.attributes.image?.data?.attributes.url ||
            props.event.attributes.speakers?.data[0]?.attributes.avatar?.data?.attributes.url ||
            settings.eventPlaceholderImage?.data.attributes.url ||
            ""}
          {...(thumbnail ? {
            placeholder: "blur",
            blurDataURL: thumbnail
          } : {})}
          width={300}
          height={500}
          alt={props.event.attributes.name} className="rounded-t-[18px] w-full h-[250px] object-cover" />
        <div className="p-5 flex-col flex  justify-between h-full">
          <div>
            <span className="flex gap-2 content-center items-center text-sm text-muted-foreground">
              <MapPin className="w-4 h-4" />
              <span>г. {props.event.attributes.city.data.attributes.name}</span>
            </span>
            <h3 className="text-[18px] font-bold line-clamp-3 my-0 py-0 mt-2 hover:text-gray-700 transition" >{props.event.attributes.name}</h3>
            {!!props.event.attributes.tags?.length && <div className="flex flex-wrap gap-3 mt-3 mb-3">
              {props.event.attributes.tags?.map(tag => (
                <EventBadge variant={"outline"}>{tag.name}</EventBadge>
              ))}
            </div>}
            {!!props.event.attributes.speakers?.data && <p className="mt-3 line-clamp-2">{
              props.event.attributes.speakers.data.map(speaker => speaker.attributes.name).join(", ")
            }</p>}
            <p className="mt-3 text-sm text-muted-foreground">
              {DateTime.fromISO(props.event.attributes.date.toString()).toLocaleString(DateTime.DATE_HUGE)}
            </p>
          </div>
          <div className="mt-3"></div>

          {new Date(props.event.attributes.date) < new Date() ? <div className="bg-primary/10 text-primary rounded-xl w-full p-2 text-sm text-center font-semibold">завершено</div>
            :
            <div className="ml-auto py-2 px-3 border-black border-[2px] font-bold rounded-xl">
              {cheapestOption ? 'от ' + prettyPrice : prettyPrice}
            </div>
          }

        </div>
      </div>
    </Link>
  )
}