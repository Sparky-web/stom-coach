"use client";

import { Event } from "~/types/entities";
import CityBadge from "./city-badge";
import EventCard from "../_components/event-card";

export default function ClientEvents(props: { events: Event[], city: string }) {


  return (
    <div className="grid md:grid-cols-[300px,1fr] gap-8 mt-6">
      <div className="grid gap-6 content-start">
        <h1 className="text-2xl font-bold">Все мероприятия</h1>
        <div>
          <h3 className="text-sm text-muted-foreground">Город</h3>
          <div className="flex gap-2 mt-2 flex-wrap">
            <CityBadge variant={"selected"}>{props.city}</CityBadge>
            <CityBadge variant={"default"}>Санкт-Петербург</CityBadge>
            <CityBadge variant={"default"}>Казань</CityBadge>
            <CityBadge variant={"default"}>Новосибирск</CityBadge>
            <CityBadge variant={"default"}>Екатеринбург</CityBadge>
            <CityBadge variant={"default"}>Краснодар</CityBadge>
          </div>
        </div>
        <div>
          <h3 className="text-sm text-muted-foreground">Специальность</h3>
          <div className="flex gap-2 mt-2 flex-wrap">
            <CityBadge variant={"selected"}>Терапия</CityBadge>
            <CityBadge variant={"default"}>Реставрация</CityBadge>
            <CityBadge variant={"default"}>Хирургия</CityBadge>
            <CityBadge variant={"default"}>Ортодонтия</CityBadge>
            <CityBadge variant={"default"}>Имплантация</CityBadge>
            <CityBadge variant={"default"}>Эстетика</CityBadge>
          </div>
        </div>
        <div>
          <h3 className="text-sm text-muted-foreground">Тип</h3>
          <div className="flex gap-2 mt-2 flex-wrap">
            <CityBadge variant={"default"}>Лекция</CityBadge>
            <CityBadge variant={"default"}>Практический курс</CityBadge>
          </div>
        </div>
      </div>
      <div className="grid lg:grid-cols-[1fr,1fr,1fr] gap-4">
        {props.events.map((e, index) => (
          <EventCard event={e} key={index} />
        ))}
      </div>
    </div>
  )
}