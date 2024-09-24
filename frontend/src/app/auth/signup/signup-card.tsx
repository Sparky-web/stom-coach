"use client";
import { useMask } from "@react-input/mask";
import { Button } from "~/components/ui/button";
import { useRouter } from "next/router";
import React from "react";
import { useCookies } from "react-cookie";
import { toast } from "sonner";
import { CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "~/components/ui/input-otp";
import { api } from "~/trpc/react";
import Card from "../../_components/card";
import Spinner from "../../_components/spinner";
import Link from "next/link";
import LabelGroup from "~/app/_components/label-group";
import { useForm } from "@tanstack/react-form";
import { signIn } from "next-auth/react";
import { zodValidator } from "@tanstack/zod-form-adapter";
import { z } from "zod";

export default function SignUpCard({ onAuthenticated }: { onAuthenticated: () => void }) {
  const inputRef = useMask({ mask: '+7 (___) ___-__-__', replacement: { _: /\d/ } });

  const { mutateAsync } = api.auth.signUp.useMutation()

  const form = useForm({
    defaultValues: {
      phone: '+7 ',
      email: '',
      password: '',
      confirmPassword: '',
    },
    validatorAdapter: zodValidator,
    onSubmit: async ({ value }) => {
      try {
        await mutateAsync({
          phone: value.phone.replace(/\D/g, ''),
          email: value.email,
          password: value.password,
        })
        toast.success("Вход выполнен")
        await signIn()
        onAuthenticated()
      } catch (e) {
        toast.error("Ошибка входа: " + e.message)
      }
    }
  })


  return (
    <Card className="bg-slate-50 border-none rounded-2xl ">
      <CardHeader className="grid gap-2 p-2">
        <CardTitle>Регистрация</CardTitle>
        <CardDescription>Персональные предложения, бонусная система, ваши курсы</CardDescription>
      </CardHeader>
      <form action={"#"} onSubmit={(e) => {
        e.preventDefault()
        form.handleSubmit()
      }}>
        <CardContent className="p-2">
          <div className="grid gap-4">
            <form.Field name="phone"
            validators={{
              onChange: z.string().refine((val) => val.replace(/\D/g, '').length === 11, "Неверный номер телефона"),
            }}
            >
              {(field) => (
                <LabelGroup label="Номер телефона">
                  <Input className="py-3 h-full rounded-lg text-base"
                    placeholder="Номер телефона"
                    ref={inputRef}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    type="tel"
                  />
                </LabelGroup>
              )}
            </form.Field>

            <form.Field name="email">
              {(field) => (
                <LabelGroup label="Email">
                  <Input className="py-3 h-full rounded-lg text-base"
                    placeholder="example@yandex.ru"
                    ref={inputRef}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    type="email"
                  />
                </LabelGroup>
              )}
            </form.Field>

            <form.Field name="password">
              {(field) => (
                <LabelGroup label="Пароль">
                  <Input className="py-3 h-full rounded-lg text-base"
                    ref={inputRef}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    type="password"
                  />
                </LabelGroup>
              )}
            </form.Field>
            <form.Field name="confirmPassword">
              {(field) => (
                <LabelGroup label="Подтверждение пароля">
                  <Input className="py-3 h-full rounded-lg text-base"
                    ref={inputRef}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    type="password"
                  />
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
                  {isSubmitting && <Spinner />} Регистрация
                </Button>
              )
            }}
          </form.Subscribe>

          <span className="text-sm text-center ">
            Уже есть аккаунт? <Link href="/auth/signup" className="text-blue-600 underline font-medium">Войти</Link>   
          </span>
        </CardFooter>
      </form>
    </Card>
  )
}