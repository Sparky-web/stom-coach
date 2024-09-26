'use client'
import { useForm } from "@tanstack/react-form"
import { zodValidator } from "@tanstack/zod-form-adapter"
import { AlertCircle, CheckCircle } from "lucide-react"
import { z } from "zod"
import Card from "~/app/_components/card"
import { getFormField } from "~/app/_components/field"
import Spinner from "~/app/_components/spinner"
import { Button } from "~/components/ui/button"
import { CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card"
import { api } from "~/trpc/react"

export default function Page() {
  const { mutateAsync, isLoading, isError, isSuccess } = api.auth.sendResetPasswordLink.useMutation()

  const form = useForm({
    defaultValues: {
      email: '',
    },
    validatorAdapter: zodValidator,
    onSubmit: async ({ value }) => {
      try {
        await mutateAsync({
          email: value.email
        })

        form.reset()
      } catch (e) {
        // toast.error("Ошибка отправки ссылки: " + e.message as string)
        console.log(e)
      }
    }
  })


  return (<div className="container py-[48px] flex justify-center">
    <Card className="max-w-[600px] ">
      <CardHeader>
        <CardTitle>Восстановление пароля</CardTitle>
        <CardDescription className="py-2">Введите email и мы вышлем вам ссылку для восстановления пароля если у вас есть аккаунт</CardDescription>
      </CardHeader>
      <form action={"#"} onSubmit={(e) => {
        e.preventDefault()
        form.handleSubmit()
      }}>
        <CardContent>
          <div className="grid gap-4">
            {isError && <span className="text-sm text-red-700 font-medium flex content-center gap-2">
              <AlertCircle className="w-4 h-4" />
              Произошла ошибка при отправке ссылки
            </span>}

            {isSuccess && <span className="text-sm text-green-700 font-medium flex content-center gap-2">
              <CheckCircle className="w-4 h-4" />
              Ссылка отправлена
            </span>}

            <form.Field name="email"
              validators={{
                onBlur: z.string().email({ message: "Неверный email" }),
              }}
            >
              {getFormField({ label: 'Email' })}
            </form.Field>
          </div>

        </CardContent>
        <CardFooter>
          <Button size="lg" className="w-full max-w-full font-medium py-3" type="submit" disabled={isLoading}>
            {isLoading && <Spinner />}
            Отправить
          </Button>
        </CardFooter>
      </form>
    </Card>
  </div>)
}
