"use client";

import Link from "next/link";
import { Button } from "~/components/ui/button";

export default function ErrorPage() {
  return (
    <div>
      <div className="relative">
        {/* <div className="absolute  top-[-88px] h-[calc(100%+88px)] w-full bg-slate-700" /> */}
        <div className="container relative py-20 flex flex-col justify-center justify-items-center gap-4 text-center">
          <span className="text-muted-foreground py-1 px-3 rounded-3xl bg-black/10 w-fit mx-auto text-sm">ошибка 404</span>
          <h1 className="text-3xl font-bold text-black text-center">Такое мероприятие не найдено</h1>
          <Link href="/events">
            <Button variant={'outline'} className="uppercase mx-auto mt-3">Все мероприятия</Button>
          </Link>
        </div>
      </div>
    </div >
  );
}