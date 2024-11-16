"use client"
import { useAuth } from "~/app/auth-context"
import { Input, InputProps } from "~/components/ui/input"
import { FieldApi, FormApi, useForm } from "@tanstack/react-form"
import { zodValidator } from '@tanstack/zod-form-adapter'
import { z } from 'zod'
import { zodI18nMap } from "zod-i18n-map";
import translation from "zod-i18n-map/locales/ru/zod.json";
import i18next from "i18next";
import { Badge } from "~/components/ui/badge"
import { api } from "~/trpc/react"
import { useEffect } from "react"
import { toast } from "sonner"
import { Button } from "~/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select"
import Spinner from "~/app/_components/spinner"
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert"
import { InfoIcon } from "lucide-react"
import { useRouter } from "next/navigation"
import { ClientForm, convertUserToClientFormValues } from "~/app/_components/client-form"
import { ClientFormValuesInput, ClientFormValuesOutput } from "~/app/_components/field"



export default function Settings() {
  const utils = api.useUtils()

  const { user } = useAuth()
  if (!user) return null

  const { mutateAsync, isLoading } = api.strapi.updateUser.useMutation()

  const router = useRouter()

  const defaultValues = convertUserToClientFormValues(user)

  const submit = async (values: ClientFormValuesOutput) => {
    try {
      await mutateAsync({
        ...values,
        position: values.position || null,
        speciality: values.speciality || null,
      })
      toast.success("Данные успешно обновлены")
      
      utils.invalidate()
      router.refresh()
    } catch (e: any) {
      toast.error("Ошибка сохранения: " + e.message as string)
      console.log(e)
    }
  }

  return (
    <div className="grid gap-8 mt-2">
      <div className="flex justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold">Личные данные</h2>
          <p className="text-sm text-muted-foreground mt-2">Просьба указывать актуальные данные, после посещения курса они заполняются в сертификат.</p>
        </div>
        {/* <div className="py-1 px-3 text-lg border border-black h-fit rounded-md">ID: {user.id}</div> */}
      </div>
      {!user.isCompleted && <Alert>
        <InfoIcon className="h-4 w-4" />
        <AlertTitle>Ваша учетная запись не заполнена</AlertTitle>
        <AlertDescription>Вам необходимо заполнить все поля, чтобы получить доступ ко всем функциям личного кабинета.</AlertDescription>
      </Alert>}
      
      <ClientForm onSubmit={submit} values={defaultValues} isLoading={isLoading} type="lk" />
    </div>
  )
}

