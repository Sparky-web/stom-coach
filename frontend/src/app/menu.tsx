import { ArrowLeft, ArrowRight } from "lucide-react"
import Link from "next/link"

const links = [
    'Личный кабинет',
    'Мероприятия',
    'Контакты',
    'Фотоальбомы',
]

export default function Menu() {
    return (
        <div className="container grid md:grid-cols-2 xl:grid-cols-4 gap-4">
            {links.map(e => (
                <Link href="#" className="rounded-xl h-[120px] grid gap-4 p-6 bg-primary text-white hover:bg-primary/90 transition">
                    <p className="font-semibold text-xl m-0 p-0">{e}</p>
                    <ArrowRight className="w-8 h-8" />
                </Link>
            ))}
        </div>
    )
}