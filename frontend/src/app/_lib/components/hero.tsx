"use client"
import NextImage from "next/image"
import { APIResponse } from "~/types/types"
import { Badge } from "~/components/ui/badge"
import { EventBadge } from "~/components/ui/event-badge"
import { Clock, MapPin, User } from "lucide-react"
import { Button } from "~/components/ui/button"
import { Event } from "~/types/entities"
import { DateTime } from "luxon"
import Link from "next/link"
import imageLoader from "~/functions/loader"
import SignUpBonus from "../../_lib/components/sign-up-bonus"
import { useAuth } from "~/app/auth-context"
import { type Image } from "~/types/entities"

const Hero = (props: {
  data: APIResponse<"api::nastrojki.nastrojki">['data']['attributes'], event: {
    event: Event,
    image: Image
  }
}) => {
  const logoUrl = props.data.logo?.data.attributes.url
  const { user } = useAuth()

  const event = props.event.event

  return (
    <div className="container min-h-[400px] grid max-lg:gap-6 lg:grid-cols-[1fr,1fr] mt-6 gap-5">
      <div className="grid gap-5 grid-rows-[1fr]">
        <div className="p-8 bg-muted h-full rounded-xl flex justify-between items-start gap-8 max-lg:rounded-xl flex-wrap">
          <div className="grid gap-6 ">
            <h1 className="font-medium text-xl md:text-2xl leading-relaxed max-w-[400px] ">
              Учебный центр для стоматологов и зубных техников
            </h1>
          </div>
          {logoUrl && <NextImage
            loader={imageLoader}
            className="min-w-[96px]"
            alt="StomCoach логотип"
            src={logoUrl}
            width={64}
            height={64}
          />}

        </div>
        {!user && <SignUpBonus />}
      </div>
      {event && <div className="relative bg-neutral-800 rounded-xl overflow-hidden">
        {props.event.image && <NextImage
          layout="fill"
          objectFit="cover"
          loader={imageLoader}
          src={props.event.image.data?.attributes.url}
          placeholder="blur"
          blurDataURL={props.event.image.data?.attributes.placeholder}
          alt={event.attributes.name}
        />
        }
        <div className="relative text-white flex flex-col justify-between max-lg:rounded-xl gap-8 h-full p-8 bg-black/50">
          <EventBadge variant={"yellow"}>Актуальное</EventBadge>
          <div className="flex flex-col gap-5">
            <h2 className="font-semibold text-xl ">
              {event.attributes.name}
              {/* Стоматологический конгресс SNOWRESTO */}
            </h2>
            <div className="grid gap-3">
              <div className="flex gap-2  items-center content-center">
                <User className="w-4 h-4" />
                <p>{event.attributes.speakers?.data?.map(e => e.attributes.name).join(", ")}</p>
              </div>
              <div className="flex gap-2  items-center content-center">
                <Clock className="w-4 h-4" />
                <p>{DateTime.fromISO(event.attributes.date).toLocaleString(DateTime.DATE_FULL)}</p>
              </div>
              <div className="flex gap-2  items-center content-center">
                <MapPin className="w-4 h-4" />
                <p>г. {event.attributes.city.data?.attributes.name}</p>
              </div>
            </div>
          </div>

          <Link href={'/events/' + event.id}>
            <Button variant={"outline"} className="uppercase w-fit text-white border-white hover:text-black hover:bg-neutral-200">Подробнее</Button>
          </Link>
        </div>

      </div>}
    </div >
  )
}

export default Hero