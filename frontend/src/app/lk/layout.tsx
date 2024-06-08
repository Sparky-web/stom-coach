"use client";

import { useContext } from "react";
import { DataContext } from "../context";
import { redirect } from "next/navigation";
import { useAuth } from "../auth-context";
import Menu from "./menu";

export default function LkLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()

  if (!user) return redirect('/login')

  return <div className="h-full">
     <div className="container grid gap-8 mb-8">
      <h1 className="text-3xl font-semibold mt-16">
        Личный кабинет
      </h1>
      <div className=" max-w-full border rounded-xl ">
        <div className="grid grid-cols-[300px,1fr] gap-8">
          <Menu />
          <div className="p-4 pl-0">
            {children}
          </div>
        </div>
      </div>
    </div>
  </div>
}