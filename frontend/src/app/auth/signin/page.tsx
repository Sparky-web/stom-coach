"use client";

import React from "react";

import { useRouter } from "next/navigation";
import LoginCard from "./login-card";



export default function Login() {
  const router = useRouter()
  return (<div className="container py-[48px] flex justify-center">
    <LoginCard onAuthenticated={() => router.push('/lk')} />
  </div>)
}