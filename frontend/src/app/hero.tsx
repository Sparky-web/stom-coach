import Image from "next/image"
import { APIResponse } from "~/types/types"
import { Badge } from "~/components/ui/badge"
import { EventBadge } from "~/components/ui/event-badge"
import { Clock, MapPin, User } from "lucide-react"
import { Button } from "~/components/ui/button"
import { Event } from "~/types/entities"
import { DateTime } from "luxon"
import Link from "next/link"

const Hero = (props: { data: APIResponse<"api::nastrojki.nastrojki">['data']['attributes'], event: Event }) => {
  const logoUrl = props.data.logo?.data.attributes.url

  return (
    <div className="container min-h-[400px] grid max-lg:gap-6 lg:grid-cols-[1fr,1fr] mt-6">
      <div className="p-8 bg-primary/10 rounded-l-xl flex justify-between items-start gap-8 max-lg:rounded-xl">
        <h1 className="font-medium text-2xl">Учебный центр для стоматологов и зубных техников</h1>
        {logoUrl && <Image
          className="min-w-[96px]"
          alt="StomCoach логотип"
          src={logoUrl}
          width={64}
          height={64}
        />}
      </div>
      {props.event && <div className="p-8 bg-neutral-800 rounded-r-xl text-white flex flex-col justify-between max-lg:rounded-xl gap-8">
        <EventBadge variant={"yellow"}>Актуальное</EventBadge>
        <div className="flex flex-col gap-5">
          <h2 className="font-semibold text-[24px] ">
            {props.event.attributes.name}
            {/* Стоматологический конгресс SNOWRESTO */}
          </h2>
          <div className="grid gap-3">
            <div className="flex gap-2  items-center content-center">
              <User className="w-4 h-4" />
              <p>{props.event.attributes.speakers?.data?.map(e => e.attributes.name).join(", ")}</p>
            </div>
            <div className="flex gap-2  items-center content-center">
              <Clock className="w-4 h-4" />
              <p>{DateTime.fromISO(props.event.attributes.date).toLocaleString(DateTime.DATE_FULL)}</p>
            </div>
            <div className="flex gap-2  items-center content-center">
              <MapPin className="w-4 h-4" />
              <p>г. {props.event.attributes.city.data?.attributes.name}</p>
            </div>
          </div>
        </div>

        <Link href={'/events/' + props.event.id}>
          <Button variant={"outline"} className="uppercase w-fit text-white border-white hover:text-black hover:bg-neutral-200">Подробнее</Button>
        </Link>
      </div>}
    </div >
  )
}

export default Hero