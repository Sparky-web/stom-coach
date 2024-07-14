"use client";
import Image from "next/image"
import { EventBadge } from "~/components/ui/event-badge"
import { Event } from "~/types/entities"
import { DateTime } from "luxon"
import { CheckCircleIcon, MapPin, Pin, Wallet, XCircleIcon } from "lucide-react"
import { Settings } from 'luxon';
import { useContext } from "react"
import { DataContext } from "~/app/context"
import Link from "next/link"
import { env } from "~/env";
import { LkEvent } from "~/types/entities";
import { Button } from "~/components/ui/button";
import LabelGroup from "~/app/_components/label-group";
import imageLoader from "~/functions/loader";

Settings.defaultLocale = 'ru';

export default function LkEventCard(props: { event: LkEvent }) {
  const { settings } = useContext(DataContext)
  const prettyPrice = new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
    minimumFractionDigits: 0,
  }).format(props.event.order.price)

  let _thumbnail = props.event.attributes.image?.data?.attributes?.formats?.thumbnail?.url || props.event.attributes.speakers?.data[0]?.attributes.avatar?.data?.attributes?.formats?.thumbnail?.url
  const thumbnail = _thumbnail ? env.NEXT_PUBLIC_STRAPI_URL + _thumbnail : null

  return (
    <div className="rounded-[18px]  bg-gray-50 grid grid-rows-[250px,1fr] ">
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
          <Link href={`/events/${props.event.id}`}>
            <h3 className="text-[18px] font-bold line-clamp-3 my-0 py-0 mt-2" >{props.event.attributes.name}</h3>
          </Link>

          {props.event.order.option_name && <LabelGroup label="выбранная опция" className="mt-3 text-sm font-semibold">
            {props.event.order.option_name}
          </LabelGroup>}

          {!!props.event.attributes.tags?.length && <div className="flex flex-wrap gap-3 mt-3 mb-3">
            {props.event.attributes.tags?.map(tag => (
              <EventBadge variant={"outline"}>{tag.name}</EventBadge>
            ))}
          </div>}

          <p className="mt-3 text-sm text-muted-foreground">
            {DateTime.fromISO(props.event.attributes.date.toString()).toLocaleString(DateTime.DATE_HUGE)}
          </p>
        </div>
      
        <div className="flex gap-3 mt-4">
          {props.event.order.is_paid && <div className="pointer-events-none bg-green-500 rounded-xl py-2 flex-1 text-white flex justify-center gap-2 items-center">
            <CheckCircleIcon className="w-5 h-5" />
            оплачено
          </div>}
          {
            props.event.order.is_paid === false &&
            <div className="bg-red-500/10 rounded-xl py-2 flex-1 text-red-500 flex justify-center gap-2 items-center ">
              <XCircleIcon className="w-5 h-5" />
              не оплачено
            </div>
          }

          <div className="ml-auto py-2 px-3 border-black border-[2px] font-bold rounded-xl ">
            {prettyPrice}
          </div>
        </div>

        {!props.event.order.is_paid && <Link href={props.event.order.sberbank_payment_url} target="_blank">
          <Button className="mt-4 w-full font-medium" variant={'tenary'}>
            <Wallet className="h-5 w-5" /> Оплатить
          </Button>
        </Link>}

      </div>
    </div>
  )
}