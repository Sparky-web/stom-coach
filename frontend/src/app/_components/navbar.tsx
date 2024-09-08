"use client";
import { ShoppingCart, User, Menu, X, ShoppingBasket } from "lucide-react"
import { useContext, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { DataContext } from "../context";
import { Button } from "~/components/ui/button";
import { NavButton } from "~/components/ui/nav-button";
import { cn } from "~/lib/utils";
import { usePathname } from "next/navigation";
import { useAuth } from "../auth-context";

const Navbar = () => {
  const { settings: data } = useContext(DataContext)
  const { user } = useAuth()

  const pathname = usePathname()
  // const isEventPage = pathname?.match(/events\/.+/) && !pathname.includes("not-found")
  const isEventPage = false

  const [open, setOpen] = useState(false)

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  return (
    <>
      <nav className={cn(
        " w-full bg-neutral-800  relative z-[100] max-md:fixed text-slate-100",
        // isEventPage && "bg-transparent md:text-white"
      )}>
        <div className="container gap-4 flex flex-wrap md:grid md:grid-cols-[250px_1fr_250px] items-center justify-between mx-auto py-6">
          <Link href="/" className="flex items-center space-x-3 rtl:space-x-reverse">
            <span className="self-center text-2xl font-semibold whitespace-nowrap uppercase ">{data.title}</span>
          </Link>
          <div className="flex md:order-2 justify-end ">
            {user && <Link href={"/lk/settings"} >
              <Button variant={"ghost"} className="hover:bg-transparent hover:text-gray-300">
                <User className="w-6 h-6" />
                {/* {user.attributes.first_name} */}
              </Button>
            </Link>}


            {!user && <div className="flex flex-wrap gap-2 max-md:hidden">
              <Link href={"/login"} >
                <Button variant={"tenary"} className="text-gray-200">Вход</Button>
              </Link>
              <Link href={"/login"}>
                <Button>Регистрация</Button>
              </Link>
            </div>}

            <Button onClick={() => setOpen(!open)} data-collapse-toggle="navbar-sticky" variant={"ghost"} size={'icon'} className="md:hidden hover:bg-transparent hover:text-gray-300" aria-controls="navbar-sticky" aria-expanded="false">
              <span className="sr-only">Открыть меню</span>
              {!open ? <Menu className="w-6 h-6 " /> : <X className="w-6 h-6 " />}
            </Button>
          </div>
          <div className={
            cn(
              "justify-center transition-all max-md:left-[-100%] max-md:h-[calc(100dvh-77px)] max-md:w-[calc(100%)] md:flex md:w-auto md:order-1 max-md:fixed max-md:top-[77px] max-md:bg-neutral-800 ",
              open && "max-md:left-[0] "
            )
          }>
            <ul className={cn("z-10 max-md:rounded-b max-md:container flex flex-col flex-wrap justify-center justify-items-center max-md:gap-2 p-4 md:p-0 mt-4 md:space-x-4  rtl:space-x-reverse md:flex-row md:mt-0 md:border-0  dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700 ")}>
              <li>
                <Link href="/">
                  <NavButton>Главная</NavButton> 
                </Link>
              </li>
              <li >
                <Link href="/events">
                  <NavButton>Все мероприятия</NavButton>
                </Link>
              </li>
              <li>
                <Link href="/#contacts">
                  <NavButton>Контакты</NavButton>
                </Link>
              </li>
              <li>
                <Link href="/photoalbums">
                  <NavButton>Фотоальбомы</NavButton>
                </Link>
              </li>
              {!user && <li className="flex flex-wrap gap-2 md:hidden justify-center mt-3">
                <Link href={"/login"} >
                  <Button variant={"tenary"} className="text-gray-200" >Вход</Button>
                </Link>
                <Link href={"/login"}>
                  <Button className="font-normal">Регистрация</Button>
                </Link>
              </li>}
            </ul>
          </div>
        </div>
      </nav>
      <div className="hidden max-md:block h-[77px]"></div>
    </>
  )
}

export default Navbar