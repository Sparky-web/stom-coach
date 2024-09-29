"use client";
import { useMask } from "@react-input/mask";
import { Button } from "~/components/ui/button";
import { useRouter } from "next/router";
import React, { useState } from "react";
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
import { util, z } from "zod";
import { cn } from "~/lib/utils";
import PersonalInfoCheckbox from "~/app/_components/personal-info-checkbox";
import { ArrowLeft } from "lucide-react";

export default function SignUpCard({ onAuthenticated }: { onAuthenticated: () => void }) {
  const inputRef = useMask({ mask: '+7 (___) ___-__-__', replacement: { _: /\d/ } });

  const [code, setCode] = useState<string>('')
  const [isCodeSent, setIsCodeSent] = useState(false)
  const [values, setValues] = useState<null | any>(null)
  const [isAgreed, setIsAgreed] = useState(false)

  const { mutateAsync, isLoading } = api.auth.signUp.useMutation()
  const { mutateAsync: sendCode } = api.auth.sendCode.useMutation()

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
        await sendCode({
          email: value.email
        })
        setValues(value)
      } catch (e) {
        toast.error("Ошибка отправки кода: " + e.message)
      }
    }
  })

  const utils = api.useUtils()

  const handleSignUp = async () => {
    try {
      await mutateAsync({
        phone: values.phone.replace(/\D/g, ''),
        email: values.email,
        password: values.password,
        code: +code
      })
      await signIn('credentials', {
        email: values.email,
        password: values.password,
        redirect: false
      })

      await utils.auth.invalidate()
      await new Promise(r => setTimeout(r, 1000))

      toast.success("Вход выполнен")
      onAuthenticated()
    } catch (e) {
      toast.error("Ошибка регистрации: " + e.message)
    }
  }

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
          {!values && <div className="grid gap-4">
            <form.Field preserveValue={true} name="phone"
              validators={{
                onBlur: z.string().refine((val) => val.replace(/\D/g, '').length === 11, "Неверный номер телефона"),
              }}
            >
              {(field) => (
                <LabelGroup label="Номер телефона">
                  <Input className={
                    cn("py-3 h-full rounded-lg  "
                      , field.state.meta.errors?.length > 0 ? "border-red-500" : ""
                    )
                  }
                    placeholder="Номер телефона"
                    value={field.state.value}
                    ref={inputRef}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    type="tel"
                  />
                  {field.state.meta.errors?.length > 0 && <span className="text-sm text-red-700">
                    {field.state.meta.errors.join(', ')}
                  </span>}
                </LabelGroup>
              )}
            </form.Field>

            <form.Field preserveValue={true} name="email"
              validators={{
                onBlur: z.string().email({ message: "Неверный email" }),
              }}
            >
              {(field) => (
                <LabelGroup label="Email">
                  <Input
                    // className="py-3 h-full rounded-lg  "
                    className={
                      cn("py-3 h-full rounded-lg  "
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

            <form.Field preserveValue={true} name="password"
              validators={{
                onBlur: z.string().min(8, { message: 'Пароль должен содержать не менее 8 символов' }).max(255, { message: 'Пароль должен содержать не более 255 символов' }),
              }}
            >
              {(field) => (
                <LabelGroup label="Пароль">
                  <Input className="py-3 h-full rounded-lg  "
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

            <form.Subscribe selector={(state) => [state.values.password]}>
              {([password]) => {
                return (
                  <form.Field name="confirmPassword"
                    validators={{
                      onBlur: z.string().refine((val) => val === password, "Пароли не совпадают"),
                    }}
                  >
                    {(field) => (
                      <LabelGroup label="Подтверждение пароля">
                        <Input
                          // className="py-3 h-full rounded-lg  "
                          className={
                            cn("py-3 h-full rounded-lg  "
                              , field.state.meta.errors?.length > 0 ? "border-red-500" : ""
                            )
                          }
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
                )
              }}
            </form.Subscribe>

            <div className="max-w-[450px]">
              <PersonalInfoCheckbox value={isAgreed} onChange={setIsAgreed} />
            </div>
          </div>}

          {values && <div className="grid gap-4">
            <Button variant={'tenary'} size="sm" onClick={() => setValues(null)} className="w-fit">
              <ArrowLeft className="w-4 h-4" />
              назад
            </Button>
            <span className="font-semibold mt-2">Код подтверждения отправлен на {values.email}</span>

            <LabelGroup label="Код из письма">
              <InputOTP maxLength={4} className="bg-white text-lg" value={code} onChange={(newValue) => setCode(newValue)}>
                <InputOTPGroup>
                  <InputOTPSlot index={0} className="bg-white " />
                  <InputOTPSlot index={1} className="bg-white " />
                  <InputOTPSlot index={2} className="bg-white " />
                  <InputOTPSlot index={3} className="bg-white " />
                </InputOTPGroup>
              </InputOTP>
            </LabelGroup>
          </div>}
        </CardContent>
        <CardFooter className="w-full p-2 mt-2 grid gap-4">
          {!values && <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
            {([canSubmit, isSubmitting]) => {
              return (
                <Button disabled={!canSubmit || !isAgreed} type="submit" className="w-full max-w-full font-medium py-3 h-full text-base" size={'lg'}>
                  {isSubmitting && <Spinner />} Регистрация
                </Button>
              )
            }}
          </form.Subscribe>}

          {values && <Button onClick={handleSignUp} className="w-full max-w-full font-medium py-3 h-full text-base" size={'lg'}>
            {isLoading && <Spinner />} Регистрация
          </Button>}

          <span className="text-sm text-center ">
            Уже есть аккаунт? <Link href="/auth/signin" className="text-blue-600 underline font-medium">Войти</Link>
          </span>
        </CardFooter>
      </form>
    </Card>
  )
}
