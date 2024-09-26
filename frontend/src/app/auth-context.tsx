"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { api } from "~/trpc/react";
import { useCookies } from "react-cookie";
import { User } from "~/server/api/routers/auth";
import { usePathname, useRouter } from "next/navigation";

export const AuthContext = createContext<{ user: User | null , logout: () => {}}>({ user: null, logout: () => { } })

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const [cookies, setCookie] = useCookies(['token']);
  const pathname = usePathname()

  const utils = api.useUtils()
  const { data: user, isError, error, isLoading } = api.auth.me.useQuery(undefined, {
    // queryKey: [cookies.token || 'me'],
    // enabled: !!cookies.token
  })

  const router = useRouter()

  const logout = () => {
    // utils.invalidate()
    setCookie('token', null, {
      path: '/'
    })
    window.location.reload()
  }

  useEffect(() => {
    if (error?.data?.code === 'UNAUTHORIZED') {
      console.log('unauthorized')
      setCookie('token', null, {
        path: '/'
      })

      if (pathname.includes('/lk')) {
        router.push('/login')
      }
    }
  }, [error])

  useEffect(() => {
    if(!cookies.token && pathname.includes('/lk')) {
      router.push('/login')
    }
  },[cookies.token])

  return <AuthContext.Provider value={{ user, logout }}>
    {isLoading && pathname.includes('/lk') ? <div className="h-screen w-screen flex justify-center items-center">
      <svg className="animate-spin -ml-1 mr-3 h-[64px] w-[64px] text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
    </div> : children}
  </AuthContext.Provider>
}


export function useAuth() {
  return useContext(AuthContext)
}