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

i18next.init({
  lng: "ru",
  resources: {
    ru: { zod: translation },
  },
});
z.setErrorMap(zodI18nMap);


type FormValues = {
  first_name: string;
  last_name: string;
  phone: string;
  email: string;
  workplace: string;
}

const getErrors = ({values}) => {
  try {
    const schema = z.object({
      first_name: z.string().min(2).max(50),
      last_name: z.string().min(2).max(50),
      phone: z.string().min(10).max(20),
      email: z.string().email(),
      workplace: z.number(),
      position: z.number(),
    })

    schema.parse(values)

    return []
  } catch (e) {
    if (e instanceof z.ZodError) {
      const errorMessages = e.errors.map(err => err.message);
      return errorMessages
    }
  }
}

export default function Settings() {
  const { user } = useAuth()
  if (!user) return null

  const { data, error } = api.strapi.getSpecsAndPositions.useQuery(undefined)

  // const specialities =

  console.log(user)

  const form = useForm({
    defaultValues: {
      first_name: user.attributes.first_name || '',
      last_name: user.attributes.last_name || '',
      phone: user.attributes.phone || '',
      email: user.attributes.email || '',
      speciality: user.attributes.speciality?.id || '',
      position: user.attributes.position?.id || '',
      customSpeciality: user.attributes.customSpeciality || '',
      customPosition: user.attributes.customPosition || '',
      workplace: user.attributes.workplace || '',
    },
    validatorAdapter: zodValidator,
    validators: {
      onChange: getErrors,
    }
  })

  const utils = api.useUtils()

  useEffect(() => {
    if (error) {
      toast.error("Ошибка загрузки специалийских и должностей")
      console.log(error)
    }
  }, [error])

  const isUserCompleted = user.attributes.first_name && user.attributes.last_name && user.attributes.phone
    && user.attributes.email && user.attributes.workplace

  const submit = async (form: FormApi<any>) => {
    try {
      // const values = form.state


      
    } catch (e) {
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
      {/* {!user } */}
      <div className="grid grid-cols-[1fr,1fr,1fr] gap-4 content-start">
        {<form.Field name="first_name"
          validators={{
            onBlur: z.string().min(2).max(50),
          }}
        >
          {getFormField({ label: 'Имя' })}
        </form.Field>}
        {<form.Field name="last_name"
          validators={{
            onBlur: z.string().min(2).max(50),
          }}
        >
          {getFormField({ label: 'Фамилия' })}
        </form.Field>}
        {<form.Field name="second_name"
          validators={{
            onBlur: z.string().min(2).max(50).optional(),
          }}
        >
          {getFormField({ label: 'Отчество' })}
        </form.Field>}

        {<form.Field name="email"
          validators={{
            onBlur: z.string().email(),
          }}
        >
          {getFormField({ label: 'Email', type: 'email', placeholder: 'example@yandex.ru' })}
        </form.Field>}

        <div className="grid gap-1">
          {<form.Field name="phone">
            {getFormField({ label: 'Телефон', disabled: true })}
          </form.Field>}
          <span className="text-sm text-muted-foreground italic">для смены связжитесь с поддержкой</span>
        </div>

        {<form.Field name="workplace"
          validators={{
            onBlur: z.string().min(2).max(50),
          }}
        >
          {getFormField({ label: 'Место работы' })}
        </form.Field>}

        {
          data?.positions && <form.Field name="position">
            {(field) => (
              <div className="grid gap-2 content-start">
                <div className="grid gap-1">
                  <label className="text-sm font-semibold">Должность</label>
                  <Select value={field.state.value} onValueChange={val => {
                    if (data.positions.find(e => e.id === val)?.attributes.enableSpeciality === false) {
                      field.form.setFieldValue('speciality', '')
                      field.form.setFieldValue('customSpeciality', '')
                    }
                    field.handleChange(val)
                  }}>
                    <SelectTrigger >
                      <SelectValue placeholder="Выберите должность" />
                    </SelectTrigger>
                    <SelectContent>
                      {data.positions.map((e) => (
                        <SelectItem key={e.id} value={e.id}>
                          {e.attributes.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {
                  data.positions.find(e => e.id === field.state.value)?.attributes.name === 'Другое' && <form.Field name="customPosition">
                    {(field) => (
                      <div className="grid gap-1">
                        <label className="text-sm font-semibold">Название должности</label>
                        <Input value={field.state.value} onBlur={field.handleBlur} onChange={(e) => field.handleChange(e.target.value)} />
                      </div>
                    )}
                  </form.Field>
                }
              </div>
            )}
          </form.Field>
        }

        {
          data?.specs && <form.Field name="speciality">
            {(field) => {
              return (
                <form.Subscribe
                  selector={(state) => [state.values.position]}
                >
                  {(_form) => {
                    return (
                      <div className="grid gap-2 content-start">
                        <div className="grid gap-1 content-start">
                          <label className="text-sm font-semibold">Специальность</label>
                          <Select value={field.state.value} onValueChange={e => field.handleChange(e)}
                            disabled={
                              data.positions.find(e => e.id === field.form.getFieldValue('position'))?.attributes.enableSpeciality === false
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Выберите специальность" />
                            </SelectTrigger>
                            <SelectContent>
                              {data.specs.map((e) => (
                                <SelectItem key={e.id} value={e.id}>
                                  {e.attributes.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        {
                          data.specs.find(e => e.id === field.state.value)?.attributes.name === 'Другое' && <form.Field name="customSpeciality">
                            {(field) => (
                              <div className="grid gap-1">
                                <label className="text-sm font-semibold">Название специальности</label>
                                <Input value={field.state.value} onBlur={field.handleBlur} onChange={(e) => field.handleChange(e.target.value)} />
                              </div>
                            )}
                          </form.Field>
                        }
                      </div>
                    )
                  }}
                </form.Subscribe>
              )
            }}
          </form.Field>
        }



        {/* {<form.Field name="phone"
          validators={{
            onChange: z.string().min(10).max(20),
          }} */}

      </div>

      <form.Subscribe selector={(state) => [state.isTouched, state.canSubmit, state.errorMap]}>
        {([touched, canSubmit, errorMap]) => {
          console.log(errorMap, canSubmit)

          return (
            <Button disabled={!touched || !canSubmit} className="uppercase">
              Сохранить
            </Button>
          )
        }}
      </form.Subscribe>
    </div >
  )
}

function getFormField({ label, ...rest }: { label: string } & InputProps) {
  return function (field: FieldApi<any, any, any, any, any>) {
    return (
      <div className="grid items-start content-start gap-1 max-h-fit">
        <label className="text-sm font-semibold">{label}</label>
        <Input id={field.name}
          name={field.name}
          value={field.state.value}
          onBlur={field.handleBlur}
          onChange={(e) => field.handleChange(e.target.value)}
          {...rest}
        />
        {field.state.meta.errors && <span className="text-sm text-red-700">
          {field.state.meta.errors.join(', ')}
        </span>}
      </div>
    )
  }
}