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

export default function LoginCard({ onAuthenticated }: { onAuthenticated: () => void }) {
  const [cookies, setCookie] = useCookies(['token']);
  const inputRef = useMask({ mask: '+7 (___) ___-__-__', replacement: { _: /\d/ } });

  const [phone, setPhone] = React.useState('+7 ');
  const [code, setCode] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const [displayCode, setDisplayCode] = React.useState(false);

  const utils = api.useUtils();

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
        onAuthenticated()

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

  return (
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
              <span className="text-sm  max-w-[400px] mt-3 highlight-links"> Вводя код, вы соглашаетесь с <Link href="https://docs.google.com/document/d/1JHTxriSUbvL4hVF1QajdIjizfwl1slOs/" target="_blank">Договором публичной оферты
              </Link> и <Link href="/privacy" target="_blank">политикой в отношении обработки персональных данных</Link>
              </span>
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
  )
}