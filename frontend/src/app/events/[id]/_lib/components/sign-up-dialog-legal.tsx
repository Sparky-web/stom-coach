"use client";

import { Table, TableBody, TableCell, TableHead, TableRow } from "~/components/ui/table";
import { CircleAlert, InfoIcon, Wallet } from "lucide-react";
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
import CompanyData from "~/types/company-data";
import { BankSuggestions, DaDataBank, DaDataParty, DaDataSuggestion, PartySuggestions } from 'react-dadata';
import 'react-dadata/dist/react-dadata.css';

import { toast } from "sonner";
import { getRequisitesString } from "../utils/get-requisites-string";
import getRequisitesFullString from "../utils/get-requisites-full-string";

export default function SignUpDialogLegal({ event, selectedOption }: { event: Event, selectedOption: Event['attributes']['options'][number] | null }) {
  const isDisabled = (selectedOption ? selectedOption.ticketsLeft < 1 : event.attributes.ticketsLeft < 1)
    || new Date(event.attributes.date) < new Date()

  const [open, setOpen] = useState(false)
  const [value, setValue] = useState();


  const { mutateAsync } = api.payments.legalSignUp.useMutation()

  const [isChecked, setIsChecked] = useState(false)
  const form = useForm({
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      company: undefined as DaDataSuggestion<DaDataParty> | undefined,
      bankDetails: undefined as DaDataSuggestion<DaDataBank> | undefined,
      bankAccount: "",
    },
    validatorAdapter: zodValidator,
    onSubmit: async (values) => {

      const value = values.value
      try {
        if(!value.bankDetails || !value.bankAccount || !value.company) {
          throw new Error('необходимо заполнить карточку компании')
        }

        await mutateAsync({
          event: event.attributes.name,
          option: selectedOption?.name,
          name: value.name,
          phone: value.phone,
          email: value.email,
          company: value.company?.value,
          companyFull: getRequisitesFullString({
            company: value.company,
            bankAccount: value.bankAccount,
            bankDetails: value.bankDetails
          })
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
    <DialogContent className="w-full max-w-5xl max-h-[calc(100dvh)] min-h-[85dvh] overflow-y-auto rounded-2xl content-start items-start">
      <DialogHeader>
        <DialogTitle>Запись на мероприятие для юр. лиц</DialogTitle>
      </DialogHeader>

      <div className="grid md:grid-cols-2 gap-4 content-start items-start">

        <div className="grid gap-2">
          <form.Field name="name"
            validators={{
              onBlur: z.string().min(2).max(50),
            }}
          >
            {getFormField({ label: 'полное ФИО' })}
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
              onChange: z.record(z.any())
            }}
          >
            {(field) => {
              const { value: company } = field.state;
              return (
                <div className="grid gap-4">
                  <div className="grid gap-1.5">
                    <span className="text-sm font-semibold">компания</span>
                    <PartySuggestions token="4a7011eaf1d840bcfe7435719aa23158748a866b"
                      value={field.state.value}
                      onChange={(newValue) => field.handleChange(newValue)}
                      // hintText={"компания"}
                      count={5}
                    />
                    {field.state.meta.errors?.length > 0 && <span className="text-sm text-red-700">
                      {field.state.meta.errors.join(', ')}
                    </span>}
                  </div>
                </div>
              )
            }}
          </form.Field>

          <form.Field name="bankDetails"
            validators={{
              onChange: z.record(z.any())
            }}
          >
            {(field) => {
              return (
                <div className="grid gap-1.5">
                  <span className="text-sm font-semibold">банк</span>
                  <BankSuggestions token="4a7011eaf1d840bcfe7435719aa23158748a866b"
                    value={field.state.value}
                    onChange={(newValue) => field.handleChange(newValue)}
                    // hintText={"компания"}
                    count={5}
                  />
                  {field.state.meta.errors?.length > 0 && <span className="text-sm text-red-700">
                    {field.state.meta.errors.join(', ')}
                  </span>}
                </div>
              )
            }}
          </form.Field>

          <form.Field name="bankAccount"
            validators={{
              onChange: z.string().min(2).max(255),
            }}
          >
            {getFormField({ label: 'расчетный счет', placeholder: '012345678901234567890' })}
          </form.Field>
        </div>

        <div className="grid gap-3">


          <span className="text-sm font-semibold">мероприятие</span>
          <h3 className="text-lg font-semibold">
            {event.attributes.name}
          </h3>
          <div className="grid grid-cols-1 gap-2">
            <LabelGroup label="Дата проведения" >
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

          <form.Subscribe selector={(state) => [state.values.company, state.values.bankAccount, state.values.bankDetails]}>
            {([company, bankAccount, bankDetails]) => {
              return (
                <>
                  {company && bankDetails && bankAccount && <div className="grid gap-1.5">

                    <div className="bg-primary/10 p-3 rounded-lg ">
                      <div className="font-medium text-sm content-center items-center flex">
                        <InfoIcon className="mr-2 w-4 h-4" />
                        на данные реквизиты будет выставлен счет
                      </div>
                      <div className="text-sm  whitespace-pre-wrap mt-3">
                        {getRequisitesString({
                          company,
                          bankAccount: bankAccount,
                          bankDetails: bankDetails,
                        })}
                      </div>
                    </div>
                  </div>}
                </>
              )
            }}
          </form.Subscribe>

          

          <PersonalInfoCheckbox value={isChecked} onChange={setIsChecked} />

          <form.Subscribe
            selector={(state) => [state.canSubmit]}
          >
            {([canSubmit]) => {
              return (
                <Button variant={'default'}
                  onClick={() => { form.handleSubmit() }}
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