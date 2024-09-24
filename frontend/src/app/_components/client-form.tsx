"use client";
import React, { useState, useEffect } from 'react';
import { FieldApi, useForm } from '@tanstack/react-form';
import { z } from 'zod';
import { zodI18nMap } from 'zod-i18n-map';
import { api } from '~/trpc/react';
import { zodValidator } from '@tanstack/zod-form-adapter';
import { toast } from 'sonner';
import { Input, InputProps } from '~/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select';
import { Button } from '~/components/ui/button';
import Spinner from './spinner';
import { ClientFormValuesInput, ClientFormValuesOutput, getErrors, getFormField } from './field';
import { User } from '~/server/api/routers/auth/auth';

export const convertUserToClientFormValues = (user: User): ClientFormValuesInput => {
  return {
    first_name: user.attributes.first_name || '',
    last_name: user.attributes.last_name || '',
    second_name: user.attributes.second_name || '',
    phone: user.attributes.phone || '',
    email: user.attributes.email || '',
    workplace: user.attributes.workplace || '',
    position: user.attributes.position?.data?.id.toString() || '',
    speciality: user.attributes.speciality?.data?.id.toString() || '',
    custom_speciality: user.attributes.custom_speciality || null,
    custom_position: user.attributes.custom_position || null,
  }
}

export const convertUserToClientFormValuesOutput = (user: User): ClientFormValuesOutput => {
  return {
    first_name: user.attributes.first_name || '',
    last_name: user.attributes.last_name || '',
    second_name: user.attributes.second_name || '',
    phone: user.attributes.phone || '',
    email: user.attributes.email || '',
    workplace: user.attributes.workplace || '',
    position: user.attributes.position?.data?.id || '',
    speciality: user.attributes.speciality?.data?.id || '',
    custom_speciality: user.attributes.custom_speciality || null,
    custom_position: user.attributes.custom_position || null,
  }
}

export const ClientForm = ({ onSubmit, values, isLoading, type = "lk" }: {
  values: ClientFormValuesInput,
  onSubmit: (values: ClientFormValuesOutput) => void,
  isLoading: boolean,
  type: "lk" | "event"
}) => {

  const { data, error } = api.strapi.getSpecsAndPositions.useQuery(undefined)

  const form = useForm<ClientFormValuesInput>({
    defaultValues: values || {
      first_name: '',
      last_name: '',
      second_name: '',
      email: '',
      phone: '',
      workplace: '',
      position: '',
      speciality: '',
      custom_position: '',
      custom_speciality: '',
    },
    validatorAdapter: zodValidator,
  })

  useEffect(() => {
    if (error) {
      toast.error("Ошибка загрузки специальностей и должностей")
      console.log(error)
    }
  }, [error])

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    onSubmit({
      ...form.state.values,
      speciality: form.state.values.speciality ? +form.state.values.speciality : undefined,
      position: +form.state.values.position,
    })
  }

  useEffect(() => {
    form.state.isPristine = true

  }, [values])

  return (
    <form className="grid gap-8 mt-2" onSubmit={submit}>
      {/* <div className="flex justify-between gap-4"> */}
      <div className="grid grid-cols-[1fr,1fr,1fr] gap-4 content-start max-md:grid-cols-[1fr]">
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
            {getFormField({ label: 'Телефон', disabled: type === "lk" })}
          </form.Field>}
          {type === "lk" && <span className="text-sm text-muted-foreground italic">для смены связжитесь с поддержкой</span>}
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
                    if (data.positions.find(e => e.id === +val)?.attributes.enableSpeciality === false) {
                      field.form.setFieldValue('speciality', '')
                      field.form.setFieldValue('custom_speciality', '')
                    }

                    if (!(data.positions.find(e => e.id === +field.state.value)?.attributes.name === 'Другое')) {
                      field.form.setFieldValue('custom_position', '')
                    }
                    field.handleChange(val)
                  }}>
                    <SelectTrigger >
                      <SelectValue placeholder="Выберите должность" />
                    </SelectTrigger>
                    <SelectContent>
                      {data.positions.map((e) => (
                        <SelectItem key={e.id} value={e.id.toString()}>
                          {e.attributes.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {
                  data.positions.find(e => e.id === +field.state.value)?.attributes.name === 'Другое' && <form.Field name="custom_position">
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
                          <Select value={field.state.value} onValueChange={e => {

                            if (data.specs.find(e => e.id === +field.state.value)?.attributes.name !== 'Другое') {
                              field.form.setFieldValue('custom_speciality', '')
                            }

                            field.handleChange(e)
                          }}
                            disabled={
                              data.positions.find(e => e.id === +field.form.getFieldValue('position'))?.attributes.enableSpeciality === false
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Выберите специальность" />
                            </SelectTrigger>
                            <SelectContent>
                              {data.specs.map((e) => (
                                <SelectItem key={e.id} value={e.id.toString()}>
                                  {e.attributes.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        {
                          data.specs.find(e => e.id === +field.state.value)?.attributes.name === 'Другое' && <form.Field name="custom_speciality">
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

      </div>

      <form.Subscribe>
        {(form) => {
          const errors = getErrors({ values: form.values })

          return (
            <Button size={type !== "lk"  ? "lg" : 'default'} className={type !== "lk" ? "w-full" : "w-fit"} disabled={errors && errors.length > 0 || isLoading || type === "lk" && form.isPristine} type="submit">
              {isLoading && <Spinner />}
              {type === "lk" ? "Сохранить" : "Далее"}
            </Button>
          )
        }}
      </form.Subscribe>
    </form>
  )
}

