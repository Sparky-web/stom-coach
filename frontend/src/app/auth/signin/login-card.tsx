"use client";
import { useMask } from "@react-input/mask";
import { Button } from "~/components/ui/button";
import React, { useState } from "react";
import { toast } from "sonner";
import { CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import Card from "../../_components/card";
import Spinner from "../../_components/spinner";
import Link from "next/link";
import LabelGroup from "~/app/_components/label-group";
import { useForm } from "@tanstack/react-form";
import { signIn } from "next-auth/react";
import { zodValidator } from "@tanstack/zod-form-adapter";
import { z } from "zod";
import { cn } from "~/lib/utils";
import { AlertCircle } from "lucide-react";
import { api } from "~/trpc/react";


export default function SignUpCard({ onAuthenticated }: { onAuthenticated: () => void }) {
  const [error, setError] = useState<string | null>(null)

  const utils = api.useUtils()

  const form = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
    validatorAdapter: zodValidator,
    onSubmit: async ({ value }) => {
      setError(null)
      try {
        const res = await signIn('credentials', {
          email: value.email,
          password: value.password, redirect: false
        })
        if (!res?.ok) {
          throw new Error('неверный email или пароль')
        }

        utils.auth.invalidate()

        toast.success("Вход выполнен")
        onAuthenticated()
      } catch (e) {
        toast.error("Ошибка входа: " + e.message)
        setError(e?.message || "Неизвестная ошибка")
      }
    }
  })


  return (
    <Card className="bg-slate-50 border-none rounded-2xl ">
      <CardHeader className="grid gap-2 p-2">
        <CardTitle>Вход</CardTitle>
        <CardDescription>Персональные предложения, бонусная система, ваши курсы</CardDescription>
      </CardHeader>
      <form action={"#"} onSubmit={(e) => {
        e.preventDefault()
        form.handleSubmit()
      }}>
        <CardContent className="p-2">
          {error &&
            <div className="mb-4 flex gap-2 content-center items-center font-medium text-red-700">
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          }
          <div className="grid gap-4">
            <form.Field name="email"
              validators={{
                onBlur: z.string().email({message: "Неверный email"}),
              }}
            >
              {(field) => (
                <LabelGroup label="Email">
                  <Input className={
                    cn("py-3 h-full rounded-lg text-base"
                      , field.state.meta.errors?.length > 0 ? "border-red-500" : ""
                    )
                  }
                    placeholder="example@yandex.ru"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    type="email"
                  />
                  {field.state.meta.errors?.length > 0 && <span className="text-sm text-red-700">
                    {field.state.meta.errors.join(', ')}
                  </span>}
                </LabelGroup>
              )}
            </form.Field>

            <form.Field name="password"
              validators={{
                onBlur: z.string().min(8, { message: 'Пароль должен содержать не менее 8 символов' }).max(255, { message: 'Пароль должен содержать не более 255 символов' }),
              }}
            >
              {(field) => (
                <LabelGroup label="Пароль">
                  <Input className="py-3 h-full rounded-lg text-base"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    type="password"
                  />
                  {field.state.meta.errors?.length > 0 && <span className="text-sm text-red-700">
                    {field.state.meta.errors.join(', ')}
                  </span>}
                </LabelGroup>

              )}
            </form.Field>
          </div>
        </CardContent>
        <CardFooter className="w-full p-2 mt-2 grid gap-4">
          <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
            {([canSubmit, isSubmitting]) => {
              return (
                <Button disabled={!canSubmit} type="submit" className="w-full max-w-full font-medium py-3 h-full text-base" size={'lg'}>
                  {isSubmitting && <Spinner />} Войти
                </Button>
              )
            }}
          </form.Subscribe>

          <span className="text-sm text-center ">
            Забыли пароль? <Link href="/auth/reset-password" className="text-blue-600 underline font-medium">Восстановить</Link>
          </span>

          <span className="text-sm text-center ">
            Нет аккаунта? <Link href="/auth/signup" className="text-blue-600 underline font-medium">Регистрация</Link>
          </span>
        </CardFooter>
      </form>
    </Card>
  )
}
