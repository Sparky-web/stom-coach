"use client";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { useMask } from '@react-input/mask';
import React from "react";

export default function Login() {
    const inputRef = useMask({ mask: '+7 (___) ___-__-__', replacement: { _: /\d/ } });
    const [phone, setPhone] = React.useState('+7 ');

    return (<div className="container py-[48px] flex justify-center">
        <Card className="bg-slate-50 border-none rounded-2xl p-3">
            <CardHeader className="text-center grid gap-2">
                <CardTitle>Войти или создать профиль</CardTitle>
                <CardDescription>Персональные предложения, бонусная система, ваши курсы</CardDescription>
            </CardHeader>
            <CardContent>
                <Input className="py-3 h-full rounded-lg text-base"
                    placeholder="Номер телефона"
                    ref={inputRef}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    type="tel"
                />
            </CardContent>
            <CardFooter className="w-full">
                <Button className="w-full max-w-full font-medium py-3 h-full text-base" size={'lg'}>Получить код</Button>
            </CardFooter>
        </Card>

    </div>)
}