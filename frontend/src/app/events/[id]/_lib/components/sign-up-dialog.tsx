"use client";
import { use, useEffect, useState } from "react";

import { ClientForm, convertUserToClientFormValues, convertUserToClientFormValuesOutput } from "~/app/_components/client-form";
import { getFormField, getErrors, ClientFormValuesOutput, ClientFormValuesInput } from "~/app/_components/field";
import { useAuth } from "~/app/auth-context";
import { Button } from "~/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { api } from "~/trpc/react";
import { Event } from "~/types/entities";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { Check, CircleAlert, Edit2, GraduationCap, Loader2Icon, LogIn, ScrollText, UserIcon, Wallet, X } from "lucide-react";
import Card from "~/app/_components/card";
import LabelGroup from "~/app/_components/label-group";
import { formatDate } from "~/lib/utils";
import LoginCard from "~/app/auth/signin/login-card";
import PersonalInfoCheckbox from "~/app/_components/personal-info-checkbox";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import cn from "~/functions/cn";
import NavbarBonusPointsIcon from "~/app/_components/navbar/bonuses";
import Spinner from "~/app/_components/spinner";
import { Checkbox } from "~/components/ui/checkbox";

export default function SignUp({ event, selectedOption }: { event: Event, selectedOption: Event['attributes']['options'][number] | null }) {
  const { user } = useAuth()

  const { data: _data } = api.strapi.getSpecsAndPositions.useQuery()

  const { mutateAsync } = api.payments.getPaymentLink.useMutation()

  const specs = _data?.specs || []
  const positions = _data?.positions || []

  const [checked, setChecked] = useState(false)

  const [useBonuses, setUseBonuses] = useState(false)
  const [usePromocode, setUsePromocode] = useState(false)

  const [defaultValues, setDefaultValues] = useState<ClientFormValuesInput | null>(user ? convertUserToClientFormValues(user) : null)

  const [data, setData] = useState<ClientFormValuesOutput | null>(user ? convertUserToClientFormValuesOutput(user) : null)

  const [promocode, setPromocode] = useState('')

  const { data: promocodeData, refetch, isFetching, error } = api.promocodes.getPromoCode.useQuery(promocode, {
    enabled: false,
    retry(failureCount, error) {
      return false
    },
  })

  const router = useRouter()

  const sumWithoutBonuses = selectedOption ? selectedOption.price : event.attributes.price
  const sumWithBonuces = user?.attributes.bonuses ? sumWithoutBonuses - user.attributes.bonuses : null

  const sumWithPromocode = promocodeData ? sumWithoutBonuses - promocodeData.amount : null

  useEffect(() => {
    if(useBonuses && usePromocode) {
      setUseBonuses(false)
    } 
  }, [usePromocode])

  useEffect(() => {
    if(usePromocode && useBonuses) {
      setUsePromocode(false)
    } 
  }, [useBonuses])

  const onSubmit = async () => {
    if (!data) return

    try {
      const res = await mutateAsync({
        eventId: event.id,
        optionId: selectedOption?.id,
        ...data,
        speciality: data.speciality ? data.speciality : null,
        useBonuses,
        promocode: promocodeData ? promocodeData.promocode : null,
        usePromocode
      })

      toast.success("Заказ создан, перевод на страницу оплаты")

      router.push(res.formUrl)

    } catch (e) {
      toast.error("Ошибка записи: " + e.message as string)
      console.log(e)
    }
  }

  useEffect(() => {
    if (user) {
      setData(convertUserToClientFormValuesOutput(user))
      setDefaultValues(convertUserToClientFormValues(user))
    }
  }, [user])

  const isDisabled = (selectedOption ? selectedOption.ticketsLeft < 1 : event.attributes.ticketsLeft < 1)
    || new Date(event.attributes.date) < new Date()

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="default" className="uppercase" disabled={isDisabled}>Записаться</Button>
      </DialogTrigger>
      <DialogContent className="w-full max-w-6xl max-h-[calc(100dvh)] overflow-y-auto rounded-2xl">
        <DialogHeader>
          <DialogTitle>Запись на мероприятие</DialogTitle>
        </DialogHeader>

        <div className="grid gap-6 md:grid-cols-[3fr,2fr] mt-3">
          <div className="grid gap-4">

            {!user && <Card className="flex justify-between gap-2 flex-wrap">
              <div className="grid gap-2">
                <span className="font-semibold font-lg">Зарегистрированны в StomClub?</span>
                <span className="text-sm text-muted-foreground">
                  Войдите в аккаунт и данные заполнятся автоматически.
                </span>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="tenary" className="uppercase w-[180px]">
                    <LogIn className="h-4  w-4" />
                    Войти
                  </Button>
                </DialogTrigger>
                <DialogContent className="w-full max-w-2xl max-h-[calc(100dvh)] overflow-y-auto rounded-2xl">
                  <DialogHeader>
                    <DialogTitle>Войти</DialogTitle>
                  </DialogHeader>
                  <LoginCard onAuthenticated={() => { }} />
                </DialogContent>
              </Dialog>
            </Card>}

            {data && specs && positions && <>
              <Card className="grid gap-4 content-start">
                <div className="flex  gap-4 justify-between">
                  <h3 className="">Ваши данные для записи</h3>
                  {data && <Button size="sm" variant="tenary" onClick={() => {
                    setData(null)
                  }}>
                    <Edit2 className="h-4 w-4" />
                    изменить
                  </Button>}
                </div>
                <div className="flex gap-4">

                  <UserIcon className="h-8 w-8" />
                  <div className="grid md:grid-cols-[1fr,1fr] gap-4">
                    <LabelGroup label="Имя">
                      {data.first_name}
                    </LabelGroup>
                    <LabelGroup label="Фамилия">
                      {data.last_name}
                    </LabelGroup>
                    <LabelGroup label="Отчество">
                      {data.second_name}
                    </LabelGroup>
                    <LabelGroup label="Телефон">
                      {data.phone}
                    </LabelGroup>
                    <LabelGroup label="Email">
                      {data.email}
                    </LabelGroup>
                    <LabelGroup label="Место работы">
                      {data.workplace}
                    </LabelGroup>
                    <LabelGroup label="Должность">
                      {positions.find(e => e.id === data.position)?.attributes.name || "-"}
                    </LabelGroup>
                    <LabelGroup label="Специальность">
                      {specs.find(e => e.id === data.speciality)?.attributes.name || "-"}
                    </LabelGroup>
                    {data.custom_speciality && <LabelGroup label="Название специальности">
                      {data.custom_speciality}
                    </LabelGroup>}
                    {data.custom_position && <LabelGroup label="Название должности">
                      {data.custom_position}
                    </LabelGroup>}
                  </div>
                </div>
              </Card>
            </>}

            {!data && <>
              <Alert className="text-lg max-h-fit h-fit">
                <GraduationCap />
                <AlertDescription>
                  Заполните все поля корректно, после завершения курса данные заполняются в сертификат.
                </AlertDescription>
              </Alert>

              <ClientForm onSubmit={(values) => {
                setData(values)
              }} values={defaultValues} isLoading={false} type="event" />
            </>}
          </div>
          <div className="grid gap-4">
            <span className="text-sm font-semibold">Оплата</span>
            <h3 className="text-lg font-semibold">
              {event.attributes.name}
            </h3>
            <div className="grid grid-cols-1 gap-2">
              <LabelGroup label="Дата проведения">
                {formatDate(event.attributes.date)}
              </LabelGroup>
              {/* <LabelGroup label="Спикеры">
                {event.attributes.speakers?.data.map(e => e.attributes.name).join(", ")}
              </LabelGroup> */}
              <LabelGroup label="Место проведения">
                {event.attributes.location || event.attributes.city.data?.attributes.name}
              </LabelGroup>
            </div>

            {selectedOption && <LabelGroup label="Выбранная опция">
              <div className="flex justify-between gap-2 items-center">
                <span className="">{selectedOption.name}</span>
                <span className="text-xl font-semibold">{new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', maximumFractionDigits: 0 }).format(selectedOption.price)}</span>
              </div>
            </LabelGroup>}

            {!selectedOption && <LabelGroup label="Стоимость">
              <span className="text-2xl font-semibold">{new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', maximumFractionDigits: 0 }).format(event.attributes.price)}</span>
            </LabelGroup>}

            {!useBonuses && <div className="grid gap-3">
              <div className="flex items-center space-x-2">
                <Checkbox id="promocode" checked={usePromocode} onCheckedChange={(e) => {
                  setUsePromocode(e)
                }} />
                <label
                  htmlFor="promocode"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Использовать промокод
                </label>
              </div>

              {!promocodeData && usePromocode && <LabelGroup label="Промокод">
                <div className="grid gap-1">
                  <div className="flex gap-2">
                    <Input className={cn("py-3 h-full rounded-lg", error && "border-red-500 !ring-0")}
                      value={promocode}
                      onChange={(e) => setPromocode(e.target.value)}
                      type="text"
                    />

                    <Button variant={'default'}
                      onClick={() => {
                        refetch()
                      }}
                      className="h-full min-w-5 py-0 px-3"
                      disabled={!promocode || isFetching}
                    >
                      {isFetching && <Loader2Icon className="h-5 w-5 animate-spin" />}
                      {!isFetching && <Check className="h-5 w-5 text-white" />}
                    </Button>
                  </div>
                  {error && <span className="text-sm text-red-700">
                    {error.message}
                  </span>}
                </div>

              </LabelGroup>}

              {promocodeData && usePromocode && <div className="grid p-3 border border-black rounded-xl gap-3">
                {/* <div className=" grid grid-cols-[2fr,3fr,2fr] gap-3  content-center items-center  "> */}
                <span className="font-medium">Промокоды</span>
                <div className="flex gap-2 items-center ">
                  <Check className="h-5 w-5 text-green-600" />
                  <span className="text-sm text-green-600 font-semibold">
                    Применен промокод: {promocodeData.promocode} на скидку {promocodeData.amount} руб.
                  </span>

                  <Button variant={'ghost'} className=" min-w-5 py-0 px-3"
                    onClick={() => {
                      setPromocode('')
                      setData(null)
                    }}
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
                {promocodeData && <div className="flex justify-between gap-3  content-center items-center ">
                  <span className="font-medium">Итого</span>
                  <span className="text-xl font-semibold">
                    <span className="text-sm line-through text-muted-foreground">{sumWithoutBonuses}&nbsp;₽ </span>
                    &nbsp;{new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', maximumFractionDigits: 0 }).format(sumWithPromocode)}
                  </span>
                </div>}
                {/* </div> */}
              </div>}
            </div>}

            {user?.attributes.bonuses > 0 && !usePromocode &&
              <div className="grid p-3 border border-black rounded-xl gap-3">
                <div className=" grid grid-cols-[2fr,3fr,2fr] gap-3  content-center items-center  ">
                  <span className="font-medium">Бонусы</span>
                  {/* <span className={cn("text-2xl font-bold text-primary text-center", useBonuses ? "text-primary/60" : "")}>
                    {user.attributes.bonuses} ₽
                  </span> */}
                  <div className={
                    cn('justify-self-center', useBonuses ? 'opacity-60' : '')
                  }>
                    <NavbarBonusPointsIcon points={user.attributes.bonuses} />
                  </div>

                  <Button variant={'tenary'} size="sm" onClick={() => setUseBonuses(!useBonuses)}>
                    {useBonuses ? "отменить" : "списать"}
                  </Button>
                </div>
                {useBonuses && <div className="border-t border-black" />}
                {useBonuses && <div className="flex justify-between gap-3  content-center items-center ">
                  <span className="font-medium">Итого</span>
                  <span className="text-xl font-semibold">
                    <span className="text-sm line-through text-muted-foreground">{sumWithoutBonuses}&nbsp;₽ </span>
                    &nbsp;{new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', maximumFractionDigits: 0 }).format(sumWithBonuces)}
                  </span>
                </div>}
              </div>
            }

            <PersonalInfoCheckbox value={checked} onChange={setChecked} />

            <div className="bg-amber-50 rounded-lg p-3 text-amber-700 text-sm flex gap-2 items-center">
              <CircleAlert className="h-4 w-4" /> ссылка на оплату действительна 20 минут
            </div>
            <Button variant={'default'}
              onClick={onSubmit}
              disabled={!data || !checked}
              size="lg" className="mt-auto bg-[linear-gradient(135deg,#A5C83B,#2AC5A7,#189BDA)] hover:opacity-90 transition">
              <Wallet className="h-6 w-6" />
              Оплатить
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}