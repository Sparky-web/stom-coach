"use client";
import { ShoppingCart, User, Menu, X, ShoppingBasket } from "lucide-react"
import { useContext, useRef } from "react";
import Link from "next/link";
import { DataContext } from "../context";
import { Button } from "~/components/ui/button";
import { NavButton } from "~/components/ui/nav-button";
import { cn } from "~/lib/utils";
import { usePathname } from "next/navigation";

const Navbar = () => {
  const { settings: data } = useContext(DataContext)

  const pathname = usePathname()
  // const isEventPage = pathname?.match(/events\/.+/) && !pathname.includes("not-found")
  const isEventPage = false

  return (
    <nav className={cn(
      "max-md:bg-slate-100 bg-white dark:bg-gray-900 w-full z-20border-b border-gray-200 dark:border-gray-600 relative z-10",
      isEventPage && "bg-transparent md:text-white"
    )}>
      <div className="container flex flex-wrap items-center justify-between mx-auto py-6">
        <Link href="/" className="flex items-center space-x-3 rtl:space-x-reverse">
          <span className="self-center text-2xl font-semibold whitespace-nowrap uppercase ">{data.title}</span>
        </Link>
        <div className="flex md:order-2 gap-4 rtl:space-x-reverse justify-end">
          <Link href={"/login"}>
            <Button variant={"ghost"} size={'icon'} className="hover:bg-transparent hover:text-black/65">
              <User className="w-6 h-6" />
            </Button>
          </Link>
          <Button variant={"ghost"} size={'icon'} className="hover:bg-transparent hover:text-black/65" >
            <ShoppingCart className="w-6 h-6" />
          </Button>

          <Button data-collapse-toggle="navbar-sticky" variant={"ghost"} size={'icon'} className="md:hidden hover:bg-transparent hover:text-white/85" aria-controls="navbar-sticky" aria-expanded="false">
            <span className="sr-only">Открыть меню</span>
            <Menu className="w-6 h-6" />
          </Button>
        </div>
        <div className="items-center justify-between hidden max-md:w-[calc(100%)] md:flex md:w-auto md:order-1 max-md:absolute max-md:top-[72px] max-md:left-[0]" id="navbar-sticky">
          <ul className={cn("z-10 max-md:rounded-b max-md:container flex flex-col max-md:gap-2 p-4 md:p-0 mt-4 md:space-x-4  rtl:space-x-reverse md:flex-row md:mt-0 md:border-0  dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700 ", "max-md:bs-slate-100  max-md:bg-white")}>
            <li>
              <NavButton className={isEventPage ? "hover:bg-[#6998F4]/25 hover:text-[#CADCFF]" : ""}>Главная</NavButton>
            </li>
            <li >
              <NavButton className={isEventPage ? "hover:bg-[#6998F4]/25 hover:text-[#CADCFF]" : ""}>О нас</NavButton>
            </li>
            <li>
              <NavButton className={isEventPage ? "hover:bg-[#6998F4]/25 hover:text-[#CADCFF]" : ""}>Контакты</NavButton>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  )
}

export default Navbar