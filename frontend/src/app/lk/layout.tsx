"use client";


import { useContext } from "react";
import { DataContext } from "../context";
import { redirect } from "next/navigation";
import { useAuth } from "../auth-context";
import Menu from "./menu";
import { Button } from "~/components/ui/button";
import { LogOutIcon } from "lucide-react";

export default function LkLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth()  

  if (!user) return redirect('/auth/signin')

  return <div className="h-full">
    <div className="container grid gap-8 mb-8">
      <div className="flex justify-between flex-wrap items-center gap-4 content-center mt-16">
        <h1 className="text-3xl font-semibold ">
          Личный кабинет
        </h1>
        <Button size={"lg"} variant={"tenary"} onClick={() => {
          logout()
        }}>
          <LogOutIcon className="h-5 w-5" />
          Выйти
        </Button>
      </div>
      <div className="max-w-full md:border rounded-xl"> 
        <div className="grid md:grid-cols-[300px,1fr] md:gap-8">
          <Menu />
          <div className="max-md:pt-6 md:p-4 max-md:border-t md:pl-0">
            {children}
          </div>
        </div>
      </div>
    </div>
  </div>
}