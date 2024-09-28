import { StarIcon } from "lucide-react"
import Link from "next/link"
import NavbarBonusPointsIcon from "~/app/_components/navbar/bonuses"
import { Button } from "~/components/ui/button"

export default function SignUpBonus() {
  return (
    <div className="w-full">
      <div className="flex bg-gradient-to-br from-yellow-500 via-orange-500 to-red-500 rounded-lg shadow-lg p-6 text-white gap-3 justify-between content-center items-center flex-wrap">
        <div className="grid gap-2">
          <p className="font-extrabold text-xl flex items-center"><StarIcon className="w-5 h-5 mr-2" /> Клуб</p>
          <p className="text-sm">Бонус за регистрацию. 1 бонус = 1 руб.</p>
          <div className="inline-flex items-center mt-2 w-fit justify-center h-8 px-3 rounded-full bg-white text-orange-600 shadow-sm">
            <StarIcon className="w-4 h-4 mr-1" />
            <span className="text-sm font-semibold">500 </span>
          </div>
        </div>
        <div className="grid gap-2 jusitfy-end">
          <Link href={"/auth/signup"} >
            <Button className="w-fit bg-white text-orange-500 hover:bg-orange-50 transition-colors">
              Зарегистрироваться
            </Button>

          </Link>
        </div>
      </div>
    </div>
  )
}