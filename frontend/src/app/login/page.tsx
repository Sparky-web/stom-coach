"use client";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { useMask } from '@react-input/mask';
import React from "react";
import { api } from "~/trpc/react";
import { toast } from "sonner";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "~/components/ui/input-otp";
import { FormControl, FormItem, FormLabel } from "~/components/ui/form";
import Spinner from "../_components/spinner";
import { useCookies } from "react-cookie";
import { useRouter } from "next/navigation";

export default function Login() {
  const [cookies, setCookie] = useCookies(['token']);
  const inputRef = useMask({ mask: '+7 (___) ___-__-__', replacement: { _: /\d/ } });

  const [phone, setPhone] = React.useState('+7 ');
  const [code, setCode] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const [displayCode, setDisplayCode] = React.useState(false);

  const utils = api.useUtils();

  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setLoading(true);

    e.preventDefault();
    try {
      if (!displayCode) {
        await utils.auth.getSmsCode.fetch(phone.replace(/\D/g, ''));
        setDisplayCode(true);
        toast.success("Код отправлен на номер телефона: " + phone)
      } else {
        const data = await utils.auth.validateCode.fetch({ phone: phone.replace(/\D/g, ''), code: +code });
        localStorage.setItem('token', data.token)

        setCookie('token', data.token, { path: '/' })

        await utils.auth.me.fetch()
        router.push('/lk')

        toast.success("Вход выполнен")
      }
    } catch (error) {
      console.log(error);

      // @ts-ignore
      toast.error("Ошибка входа: " + error?.message)
    }

    setLoading(false);
  };

  const canSubmit = phone.replace(/\D/g, '').length === 11 && (displayCode ? code.length === 4 : true)

  return (<div className="container py-[48px] flex justify-center">
    <Card className="bg-slate-50 border-none rounded-2xl p-3">
      <CardHeader className="text-center grid gap-2">
        <CardTitle>Войти или создать профиль</CardTitle>
        <CardDescription>Персональные предложения, бонусная система, ваши курсы</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit} action={"#"}>
        <CardContent>
          <div className="grid gap-4">
            <Input className="py-3 h-full rounded-lg text-base"
              placeholder="Номер телефона"
              disabled={displayCode}
              ref={inputRef}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              type="tel"
            />
            {displayCode && <div className="grid gap-1 w-full">
              <span className="text-sm font-semibold">Код из СМС</span>
              <InputOTP maxLength={4} className="bg-white text-lg" value={code} onChange={(newValue) => setCode(newValue)}>
                <InputOTPGroup>
                  <InputOTPSlot index={0} className="bg-white " />
                  <InputOTPSlot index={1} className="bg-white " />
                  <InputOTPSlot index={2} className="bg-white " />
                  <InputOTPSlot index={3} className="bg-white " />
                </InputOTPGroup>
              </InputOTP>
            </div>}
          </div>

        </CardContent>
        <CardFooter className="w-full">
          <Button disabled={loading || !canSubmit} type="submit" className="w-full max-w-full font-medium py-3 h-full text-base" size={'lg'}>
            {loading && <Spinner />} {displayCode ? 'Войти' : 'Получить код'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  </div>)
}