import { Sparkle } from "lucide-react"
import Card from "./_components/card"
import Image from "next/image"
import aboutUsImg from "./about-us.jpg"

export default function AboutUs() {

  return <div className="bg-muted">
    <div className="container grid gap-6 py-12">
      <h2 className="text-3xl font-semibold">О нас</h2>
      <div className="  grid gap-6 md:grid-cols-[1fr,1fr] ">
        <div className="grid gap-6">
          <Card className="bg-white grid gap-6 py-8 content-between">
            {/* <ul className="text grid gap-3">
              <li className="flex content-center gap-2">
                <Sparkle className="text-[#FFD250]" />
                Обучение для стоматологов всех специальностей</li>
              <li className="flex content-center gap-2">
                <Sparkle className="text-[#FFD250]" />
                Самые актуальные тематики
              </li>

              <li className="flex content-center gap-2">
                <Sparkle className="text-[#FFD250]" />
                Высокая наполненность практическими решениями
              </li>
            </ul> */}
            <div className="grid gap-6 md:grid-cols-[1fr,1fr] content-start items-start">
              <div className="grid gap-2">
                <span className="text-4xl font-extrabold flex items-center gap-2">
                  <Sparkle className="text-[#FFD250] h-8 w-8" />
                  40+
                </span>
                <span className="">Известных спикеров сотрудничают с нами</span>
              </div>

              <div className="grid gap-2">
                <span className="text-4xl font-extrabold flex items-center gap-2">
                  <Sparkle className="text-[#FFD250] h-8 w-8" />
                  100+
                </span>
                <span className="">Мероприятий мы уже провели</span>
              </div>

              <div className="grid gap-2">
                <span className="text-4xl font-extrabold flex items-center gap-2">
                  <Sparkle className="text-[#FFD250] h-8 w-8" />
                  2000+
                </span>
                <span className="">Участников курсов</span>
              </div>
            </div>
            <h3 className=" mt-auto text-xl">
              STOMCOACH - ваш наставник в профессиональном росте!
            </h3>
          </Card>
        </div>
        <div className="h-[400px]">
          <Image src={aboutUsImg} alt="about us" className="rounded-xl h-[400px] object-cover" />
        </div>

        {/* <p className="text-sm">
  Учебный центр для стоматологов и зубных техников
</p> */}

      </div>
    </div>
  </div>
}