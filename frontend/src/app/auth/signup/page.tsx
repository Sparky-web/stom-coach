"use client";

import React from "react";

import { useRouter } from "next/navigation";
import SignUpCard from "./signup-card";



export default function Login() {
  const router = useRouter()
  return (<div className="container py-[48px] flex justify-center">
    <SignUpCard onAuthenticated={() => router.push('/lk')} />
  </div>)
}