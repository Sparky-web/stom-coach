import Image from "next/image"
import { APIResponse } from "~/types/types"
import { Badge } from "~/components/ui/badge"
import { EventBadge } from "~/components/ui/event-badge"
import { Clock, User } from "lucide-react"
import { Button } from "~/components/ui/button"

const Hero = (props: { data: APIResponse<"api::nastrojki.nastrojki">['data']['attributes'] }) => {
    const logoUrl = props.data.logo?.data.attributes.url

    return (
        <div className="container min-h-[400px] grid lg:grid-cols-[1fr,1fr] mt-4">
            <div className="p-8 bg-primary/10 rounded-l-xl flex justify-between items-start gap-8">
                <h1 className="font-medium text-2xl">Учебный центр для стоматологов и зубных техников</h1>
                {logoUrl && <Image
                    className="min-w-[96px]"
                    alt="StomCoach логотип"
                    src={logoUrl}
                    width={64}
                    height={64}
                />}
            </div>
            <div className="p-8 bg-neutral-800 rounded-r-xl text-white flex flex-col justify-between">
                <EventBadge variant={"yellow"}>Актуальное</EventBadge>
                <div className="flex flex-col gap-5">
                    <h2 className="font-semibold text-[24px] ">
                        Стоматологический конгресс SNOWRESTO
                    </h2>
                    <div className="flex gap-2  items-center content-center">
                        <User className="w-4 h-4" />
                        <p>Иван Рузин, Руслан Бертарь и Роман Карпенко</p>
                    </div>
                    <div className="flex gap-2  items-center content-center">
                        <Clock className="w-4 h-4" />
                        <p>1-2 марта</p>
                    </div>
                </div>

                <Button variant={"outline"} className="uppercase">Подробнее</Button>
            </div>
        </div >
    )
}

export default Hero