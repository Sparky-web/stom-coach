import Card from "~/app/_components/card";
import { BonusPage } from "../types";
import { CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Progress } from "~/components/ui/progress";
import cn from "~/functions/cn";
import { Blocks, Check, CheckSquare, CheckSquare2, Lock } from "lucide-react";
import { useAuth } from "~/app/auth-context";

export default function BonusesComponent({ levels, userBonuses }: BonusPage) {
  if (!levels.length) return null

  let currentLevelIndex = 0

  for(let i = 0; i < levels.length; i++) {
    if(userBonuses.eventsVisited >= levels[i].requiredEventsVisits) {
      currentLevelIndex = i
    }
  }

  const currentLevel = levels[currentLevelIndex];
  const nextLevel = levels[currentLevelIndex + 1];

  const eventsToNextLevel = nextLevel
    ? nextLevel.requiredEventsVisits - userBonuses.eventsVisited
    : 0;

  const progress = nextLevel
    ? (userBonuses.eventsVisited / nextLevel.requiredEventsVisits) * 100
    : 100;

  return (
    <div className="grid gap-4 mt-2">
      <h2 className="text-2xl font-semibold">Программа лояльности</h2>
      <div className="text-center mt-4">
        <h2 className="text-2xl font-semibold mb-2">
          Ваши бонусы: &nbsp;
          <span className="text-primary">{userBonuses.bonuses}</span>
        </h2>

        <span className="text-sm text-muted-foreground">
          1 бонус = 1 руб.
        </span>
      </div>

      <div className="mt-4 grid gap-2 border border-black/30 p-4 rounded-xl">
        <div className="flex justify-between items-center">
          <span className="font-medium">Посещенные мероприятия </span>
          <span>
            <span className="font-semibold text-xl">
              {userBonuses.eventsVisited}
            </span>
            &nbsp;/&nbsp;
            <span className="text-muted-foreground text-sm">
              {nextLevel ? nextLevel.requiredEventsVisits : currentLevel.requiredEventsVisits}</span>
          </span>
        </div>
        <Progress value={progress} className="w-full" />
        {nextLevel && (
          <p className="text-center text-sm text-muted-foreground">
            Посетите еще {eventsToNextLevel} курсов для повышения уровня
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {levels.map((level, index) => (
          // <Card key={level.name} className={index === 0 ? "border-primary" : ""}>
          //   <CardHeader>
          //     <CardTitle className="flex justify-between items-center">
          //       <span>{level.name}</span>
          //     </CardTitle>
          //   </CardHeader>
          //   <CardContent className="grid gap-2 content-between ">
          //     <div className="">
          //       <p className="font-semibold mb-2">Кэшбэк: {level.cashbackPercent}%</p>
          //       <p className="mb-4">Требуется посещений: {level.requiredEventsVisits}</p>
          //       <ul className="list-disc list-inside text-sm mb-4">
          //         {level.additionalBonuses.map((bonus, i) => (
          //           <li key={i}>{bonus}</li>
          //         ))}
          //       </ul>
          //     </div>
          //     <Badge variant={index === 0 ? "default" : "outline"} className="mt-auto">{index === 0 ? "Текущий" : "Следующий"}</Badge>
          //   </CardContent>
          // </Card>
          <div className={cn("p-5 rounded-xl grid gap-4 content-start",
            currentLevelIndex >= index ? level.color : "bg-slate-50 text-muted-foreground",
          )}>
            {/* {currentLevelIndex} {index} */}
            <div className="flex gap-3 content-center items-center">
              <div className="p-1.5 rounded-xl bg-white">
                {currentLevelIndex >= index ? <Check className="h-5 w-5" /> : <Lock className="h-5 w-5" />}
              </div>
              <h3 className="text-xl font-semibold">
                {level.name}
              </h3>
            </div>
            <div className="grid gap-3 content-start">
              <span className="p-2 font-semibold border-black border rounded-lg w-fit text-sm">Кэшбэк: {level.cashbackPercent}%</span>

              <ul className="list-disc list-inside text-sm mb-4">
                {level.additionalBonuses.map((bonus, i) => (
                  <li key={i}>{bonus}</li>
                ))}
              </ul>
            </div>
            <div className="text-sm mt-auto">
              {currentLevelIndex >= index && <span className="">Активирован</span>}
              {currentLevelIndex < index && <span className="text-muted-foreground">Активируется после {nextLevel?.requiredEventsVisits} посещений</span>}
            </div>
          </div>
        ))}
      </div>

      <p className="text-center text-sm text-muted-foreground">
        Для записи на бесплатные для вашего уровня мероприятия
        напишите в WhatsApp по номеру +7 (999) 999 99-99
        или на почту example@mail.ru
      </p>
    </div>
  )
}