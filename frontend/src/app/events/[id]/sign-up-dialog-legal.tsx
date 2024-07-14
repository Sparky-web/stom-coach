"use client";

import { CircleAlert, Wallet } from "lucide-react";
import { useState } from "react";
import { useForm } from "@tanstack/react-form";
import LabelGroup from "~/app/_components/label-group";
import PersonalInfoCheckbox from "~/app/_components/personal-info-checkbox";
import { Button } from "~/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "~/components/ui/dialog";
import { formatDate } from "~/lib/utils";
import { Event } from "~/types/entities";
import { Input } from "~/components/ui/input";
import Card from "~/app/_components/card";
import { api } from "~/trpc/react";
import { zodValidator } from "@tanstack/zod-form-adapter";
import { z } from "zod";
import { getFormField } from "~/app/_components/field";
import { toast } from "sonner";



export default function SignUpDialogLegal({ event, selectedOption }: { event: Event, selectedOption: Event['attributes']['options'][number] | null }) {
  const isDisabled = (selectedOption ? selectedOption.ticketsLeft < 1 : event.attributes.ticketsLeft < 1)
    || new Date(event.attributes.date) < new Date()

  const [open, setOpen] = useState(false)

  const { mutateAsync } = api.payments.legalSignUp.useMutation()

  const [isChecked, setIsChecked] = useState(false)
  const form = useForm({
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      company: '',
    },
    validatorAdapter: zodValidator,
    onSubmit: async (values) => {
      try {

        await mutateAsync({
          event: event.attributes.name,
          option: selectedOption?.name,
          ...values.value,
        })

        toast.success("Заявка отправлена, скоро мы свяжемся с вами")
        setOpen(false)
      } catch (e) {
        console.error(e)
        toast.error("Ошибка обработки заявки, попробуйте позже: " + e.message as string)
      }

    }
  })

  return <Dialog open={open} onOpenChange={setOpen}>
    <DialogTrigger asChild>
      <Button variant="outline" className="uppercase" disabled={isDisabled}>
        для юр. лиц
      </Button>
    </DialogTrigger>
    <DialogContent className="w-full max-w-4xl max-h-[calc(100dvh)] overflow-y-auto rounded-2xl">
      <DialogHeader>
        <DialogTitle>Запись на мероприятие для юр. лиц</DialogTitle>
      </DialogHeader>

      <div className="grid md:grid-cols-2 gap-4">

        <div className="grid gap-4">
          <form.Field name="name"
            validators={{
              onBlur: z.string().min(2).max(50),
            }}
          >
            {getFormField({ label: 'контактное лицо' })}
          </form.Field>

          <form.Field name="email"
            validators={{
              onBlur: z.string().email(),
            }}
          >
            {getFormField({ label: 'email', type: 'email', placeholder: 'example@yandex.ru' })}
          </form.Field>

          <form.Field name="phone"
            validators={{
              onBlur: z.string().min(2).max(255),
            }}
          >
            {getFormField({ label: 'телефон', placeholder: '79121234567' })}
          </form.Field>

          <form.Field name="company"
            validators={{
              onBlur: z.string().min(2).max(255),
            }}
          >
            {getFormField({ label: 'компания' })}
          </form.Field>

          <Card className="grid gap-4 content-start p-0 bg-slate-100">
            <span className=" font-semibold">В ближайшее время мы свяжемся с вами по одному из указаных вами контактов.</span>
          </Card>
        </div>

        <div className="grid gap-4">
          <span className="text-sm font-semibold">мероприятие</span>
          <h3 className="text-lg font-semibold">
            {event.attributes.name}
          </h3>
          <div className="grid grid-cols-1 gap-2">
            <LabelGroup label="Дата проведения">
              {formatDate(event.attributes.date)}
            </LabelGroup>
            <LabelGroup label="Место проведения">
              {event.attributes.location || event.attributes.city.data?.attributes.name}
            </LabelGroup>
          </div>

          {selectedOption && <LabelGroup label="Выбранная опция">
            <div className="flex justify-between gap-2 items-center">
              <span className="">{selectedOption.name}</span>
            </div>
          </LabelGroup>}

          <PersonalInfoCheckbox value={isChecked} onChange={setIsChecked} />

          <form.Subscribe
            selector={(state) => [state.canSubmit]}
          >
            {([canSubmit]) => {
              return (
                <Button variant={'default'}
                  onClick={() => {form.handleSubmit()}}
                  disabled={!isChecked || !canSubmit}
                  size="lg" className="mt-auto hover:opacity-90 transition"
                >
                  Оставить заявку
                </Button>
              )
            }}
          </form.Subscribe>
        </div>
      </div>

    </DialogContent>
  </Dialog >
}