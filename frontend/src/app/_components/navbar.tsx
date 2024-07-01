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
        "max-md:bg-slate-100 bg-white dark:bg-gray-900 w-full border-b border-gray-200 dark:border-gray-600 relative z-10 max-md:fixed",
        isEventPage && "bg-transparent md:text-white"
      )}>
        <div className="container gap-4 flex md:grid md:grid-cols-[250px_1fr_250px] items-center justify-between mx-auto py-6">
          <Link href="/" className="flex items-center space-x-3 rtl:space-x-reverse">
            <span className="self-center text-2xl font-semibold whitespace-nowrap uppercase ">{data.title}</span>
          </Link>
          <div className="flex md:order-2 gap-4 justify-end">
            {user && <Link href={"/lk/settings"} >
              <Button variant={"ghost"} className="hover:bg-transparent hover:text-black/65">
                <User className="w-6 h-6" />
                {user.attributes.first_name}
              </Button>
            </Link>}


            {!user && <div className="flex flex-wrap gap-2 max-md:hidden">
              <Link href={"/login"} >
                <Button variant={"tenary"}>Вход</Button>
              </Link>
              <Link href={"/login"}>
                <Button>Регистрация</Button>
              </Link>
            </div>}

            <Button onClick={() => setOpen(!open)} data-collapse-toggle="navbar-sticky" variant={"ghost"} size={'icon'} className="md:hidden hover:bg-transparent" aria-controls="navbar-sticky" aria-expanded="false">
              <span className="sr-only">Открыть меню</span>
              {!open ? <Menu className="w-6 h-6 hover:text-black/65" /> : <X className="w-6 h-6 hover:text-black/65" />}
            </Button>
          </div>
          <div className={
            cn(
              "justify-center transition-all max-md:left-[-100%] max-md:w-[calc(100%)] md:flex md:w-auto md:order-1 max-md:fixed max-md:top-[89px] max-md:bg-slate-100 ",
              open && "max-md:left-[0] max-md:h-[calc(100vh-89px)]"
            )
          }>
            <ul className={cn("z-10 max-md:rounded-b max-md:container flex flex-col flex-wrap justify-center justify-items-center max-md:gap-2 p-4 md:p-0 mt-4 md:space-x-4  rtl:space-x-reverse md:flex-row md:mt-0 md:border-0  dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700 ", "max-md:bg-slate-100")}>
              <li>
                <NavButton className={isEventPage ? "hover:bg-[#6998F4]/25 hover:text-[#CADCFF]" : ""}>Главная</NavButton>
              </li>
              <li >
                <NavButton className={isEventPage ? "hover:bg-[#6998F4]/25 hover:text-[#CADCFF]" : ""}>О нас</NavButton>
              </li>
              <li>
                <NavButton className={isEventPage ? "hover:bg-[#6998F4]/25 hover:text-[#CADCFF]" : ""}>Контакты</NavButton>
              </li>
              {!user && <li className="flex flex-wrap gap-2 md:hidden justify-center mt-3">
                <Link href={"/login"} >
                  <Button variant={"tenary"}>Вход</Button>
                </Link>
                <Link href={"/login"}>
                  <Button>Регистрация</Button>
                </Link>
              </li>}
            </ul>
          </div>
        </div>
      </nav>
      <div className="hidden max-md:block h-[88px]"></div>
    </>
  )
}

export default Navbar