import { api } from "~/trpc/server"
import ResetCard from "./_lib/reset-card"
import { Cross, X } from "lucide-react"
import Link from "next/link"
import { Button } from "~/components/ui/button"

export default async function Page({ searchParams  }: { searchParams : URLSearchParams }) {
  const token = searchParams?.token

  let email: string

  try {
    if(!token) throw new Error('не указан токен')

    const data = await api.auth.checkToken.query({ token })
    email = data.email
  } catch (e) {
    console.error(e)
    return <div className="container grid gap-6 justify-center py-[64px] justify-items-center">
      <div className="flex content-center gap-3">
        <X className="h-8 w-8" />
        <h1 className="text-2xl font-semibold">
          Ссылка на сброс пароля недействительна
        </h1>
      </div>
      <p className="text-sm text-muted-foreground">
        Скорее всего пароль уже был изменен, либо срок действия ссылки истек.
      </p>
      <Link href="/">
        <Button variant={'tenary'} className="w-fit">
          вернуться на главную
        </Button>
      </Link>
    </div>
  }

  return (<div className="container flex justify-center py-[48px]">
    <ResetCard email={email} token={token} />
  </div>)
}