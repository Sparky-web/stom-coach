import { ArrowLeft, ArrowRight } from "lucide-react"
import Link from "next/link"

const links = [
  {href: "/lk/settings", name: 'Личный кабинет'},
  {href: "/events", name: 'Все мероприятия'},
  {href: "/#contacts", name: 'Контакты'},
  {href: "/photoalbums", name: 'Фотоальбомы', disabled: false},
]

export default function Menu() {
    return (
        <div className="container grid md:grid-cols-2 xl:grid-cols-4 gap-4">
            {links.map(e => (
                <Link href={e.disabled ? "#" : e.href} 
                className={"rounded-xl h-[120px] grid gap-4 p-6 bg-primary text-white hover:bg-primary/90 transition"
                  + " " + (e.disabled ? "pointer-events-none opacity-70" : "cursor-pointer")
                }>
                    <p className="font-semibold text-xl m-0 p-0">{e.name}</p>
                    <ArrowRight className="w-8 h-8" />
                </Link>
            ))}
        </div>
    )
}