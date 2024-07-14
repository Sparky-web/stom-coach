"use client";

import { useContext } from "react";
import { DataContext } from "../context";
import { redirect } from "next/navigation";
import { useAuth } from "../auth-context";

export const dynamic = "force-dynamic";

export default function Lk() {
  const {user} = useAuth()
  if (!user) return redirect('/login')
  return redirect('/lk/settings')
}