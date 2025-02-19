"use client";
import React, { useState, useEffect } from 'react';
import { FieldApi, useForm } from '@tanstack/react-form';
import { z } from 'zod';
import { zodI18nMap } from 'zod-i18n-map';
import { api } from '~/trpc/react';
import { zodValidator } from '@tanstack/zod-form-adapter';
import { toast } from 'sonner';
import { Button } from '~/components/ui/button';
import Spinner from './spinner';
import { ClientFormValuesInput, ClientFormValuesOutput, getErrors, getFormField } from './field';
import { User } from '~/server/api/routers/auth';
import SelectSpecAndPosition from './select-spec-and-position';

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
    city: user.attributes.city || ''
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
    city: user.attributes.city || ''
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
      city: ''
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
    if (values) {
      form.validateAllFields('blur')
    }
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

        <div className="grid gap-1">
          {<form.Field name="city" validators={{
            onBlur: z.string().min(2).max(255),
          }}>
            {getFormField({ label: 'Город' })}
          </form.Field>}
        </div>

        {<form.Field name="workplace"
          validators={{
            onBlur: z.string().min(2).max(50),
          }}
        >
          {getFormField({ label: 'Место работы' })}
        </form.Field>}

        <SelectSpecAndPosition form={form} />

      </div>

      <form.Subscribe>
        {(form) => {
          const errors = getErrors({ values: form.values })

          return (
            <Button size={type !== "lk" ? "lg" : 'default'} className={type !== "lk" ? "w-full" : "w-fit"} disabled={!form.canSubmit || errors && errors.length > 0 || isLoading || type === "lk" && form.isPristine} type="submit">
              {isLoading && <Spinner />}
              {type === "lk" ? "Сохранить" : "Далее"}
            </Button>
          )
        }}
      </form.Subscribe>
    </form>
  )
}

