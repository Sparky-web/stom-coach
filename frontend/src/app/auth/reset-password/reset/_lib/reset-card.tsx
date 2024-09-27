'use client'
import { useForm } from "@tanstack/react-form"
import { zodValidator } from "@tanstack/zod-form-adapter"
import { AlertCircle, CheckCircle } from "lucide-react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { z } from "zod"
import Card from "~/app/_components/card"
import { getFormField } from "~/app/_components/field"
import Spinner from "~/app/_components/spinner"
import { Button } from "~/components/ui/button"
import { CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card"
import { api } from "~/trpc/react"

export default function ResetCard({ email, token }: { email: string, token: string }) {
  const { mutateAsync, isLoading, error, isSuccess } = api.auth.resetPassword.useMutation()
  const router = useRouter()

  const utils = api.useUtils() 

  const form = useForm({
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
    validatorAdapter: zodValidator,
    onSubmit: async ({ value }) => {
      try {
        await mutateAsync({
          token: token,
          password: value.password,
        })

        form.reset()

        toast.success("Пароль успешно изменен")

        const data = await signIn('credentials', {
          email: email,
          password: value.password,
          redirect: false
        })

        await utils.auth.invalidate()

        if (data) {
          toast.success("Вход выполнен")
          router.push('/lk/settings')
        }
        else {
          toast.error("Ошибка входа: " + data?.message)
        }

      } catch (e) {
        // toast.error("Ошибка отправки ссылки: " + e.message as string)
        console.log(e)
      }
    }
  })


  return (
    <Card className="w-[600px] max-w-[100%]">
      <CardHeader>
        <CardTitle>Восстановление пароля</CardTitle>
        <CardDescription className="py-2">Для аккаунта {email}</CardDescription>
      </CardHeader>
      <form action={"#"} onSubmit={(e) => {
        e.preventDefault()
        form.handleSubmit()
      }}>
        <CardContent>
          <div className="grid gap-4">
            {error && <span className="text-sm text-red-700 font-medium flex content-center gap-2">
              <AlertCircle className="w-4 h-4" />
              Произошла ошибка восстановления пароля: {error.message}
            </span>}

            {isSuccess && <span className="text-sm text-green-700 font-medium flex content-center gap-2">
              <CheckCircle className="w-4 h-4" />
              Пароль успешно изменен
            </span>}

            <form.Field name="password"
              validators={{
                onBlur: z.string().min(8, { message: 'Пароль должен содержать не менее 8 символов' }).max(255, { message: 'Пароль должен содержать не более 255 символов' }),
              }}
            >
              {getFormField({ label: 'Пароль', type: 'password' })}
            </form.Field>

            <form.Subscribe selector={(state) => [state.values.password]}>
              {([password]) => {
                return (
                  <form.Field name="confirmPassword"
                    validators={{
                      onBlur: z.string().refine((val) => val === password, "Пароли не совпадают"),
                    }}
                  >
                    {getFormField({ label: 'Подтверждение пароля', type: 'password' })}
                  </form.Field>
                )
              }}
            </form.Subscribe>
          </div>

        </CardContent>
        <CardFooter>
          <Button size="lg" className="w-full max-w-full font-medium py-3" type="submit" disabled={isLoading}>
            {isLoading && <Spinner />}
            Восстановить
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
