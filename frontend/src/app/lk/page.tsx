"use client";

import { useContext } from "react";
import { DataContext } from "../context";
import { redirect } from "next/navigation";
import { useAuth } from "../auth-context";

export default function Lk() {
  // const {user} = useAuth()S

  // const { data: session } = useSession();
  // if (!user) return redirect('/login')
  return redirect('/lk/settings')

  return <div className="h-full">

  </div>
}