import Image from "next/image"
import { APIResponse } from "~/types/types"
import { Badge } from "~/components/ui/badge"

const Hero = (props: { data: APIResponse<"api::nastrojki.nastrojki">['data']['attributes'] }) => {
    const logoUrl = props.data.logo?.data.attributes.url

    return (
        <div className="container min-h-[400px] grid lg:grid-cols-[1fr,1fr] mt-8">
            <div className="p-8 bg-primary/10 rounded-l-xl flex justify-between items-start gap-4">
                <h1 className="font-medium text-2xl">Учебный центр для стоматологов и зубных техников</h1>
                {logoUrl && <Image
                    className="min-w-[96px]"
                    alt="StomCoach логотип"
                    src={logoUrl}
                    width={64}
                    height={64}
                />}
            </div>
            <div className="p-8 bg-neutral-800 rounded-r-xl">
                <Badge className="">Hello</Badge>
            </div>
        </div>
    )
}

export default Hero