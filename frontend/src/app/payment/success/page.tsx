import Link from "next/link";
import { Button } from "~/components/ui/button";


export default function Page() {
  return <div className="container py-16">
    <div className="flex flex-col items-center justify-center gap-4 justify-items-center">
      <h1 className="text-2xl font-bold">
        Оплата успешно проведена
      </h1>
      <p className="text-muted-foreground">
        Ваш заказ прошел оплату, ожидайте поддтверждения в электронном письме.
      </p>
      <Link href="/">
        <Button variant={'tenary'} className="w-fit">
          Вернуться на главную
        </Button>
      </Link>
    </div>
  </div>
}