"use client";
import { GraduationCap, Heart, UserIcon } from "lucide-react";
import Link from "next/link";
import { useAuth } from "../auth-context";
import { Button } from "~/components/ui/button";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "~/lib/utils";


const menu = [
  { link: "/lk/settings", name: "Личные данные", icon: UserIcon },
  { link: "/lk/courses", name: "Мои курсы", icon: GraduationCap },
  { link: "/lk/bonuses", name: "Программа лояльности", icon: Heart },
]

export default function Menu() {
  const { user } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  return (
    <div className="grid gap-2 p-4 border-r content-start">
      {menu.map((item) => (
          <Button className={cn(
            'w-full text-base font-medium flex gap-2 max-w-full justify-start h-12 rounded-lg hover:text-black hover:bg-muted',
            pathname.includes(item.link) ? "bg-muted text-primary hover:text-primary hover:bg-muted" : "" 
          )} variant={"ghost"} onClick={e => router.push(item.link)} key={item.link}>
            {item.icon ? <item.icon className="h-5 w-5" /> : null}
            {item.name}
          </Button>
      ))}
    </div>
  )
}