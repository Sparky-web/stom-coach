"use client";

import { City, Event } from "~/types/entities";
import CityBadge from "./city-badge";
import EventCard from "../_components/event-card";
import { api } from "~/trpc/react";
import { useState } from "react";

export default function ClientEvents(props: {
  events: Event[], cityId: number, cities: City[], specs: {
    id: number;
    attributes: {
      name: string;
    };
  }[]
}) {
  const [selectedSpec, setSelectedSpec] = useState(null)
  const [selectedCity, setSelectedCity] = useState<number | null>(props.cityId)
  const [type, setType] = useState<'all' | 'active' | 'past'>('active')

  const { data: events } = api.strapi.getEvents.useQuery({
    filters: {
      city: selectedCity,
      date: {
        $gte: type === 'active' ? new Date().toISOString() : undefined,
        $lte: type === 'past' ? new Date().toISOString() : undefined
      }
    },
    options: {
      sort: type === 'active' ? 'date:asc' : 'date:desc'
    }
  }, {
    queryHash: 'events.' + selectedCity + '.' + type
  })

  return (
    <div className="grid md:grid-cols-[300px,1fr] gap-8 mt-6">
      <div className="grid gap-6 content-start">
        <h1 className="text-2xl font-bold">Все мероприятия</h1>
        <div>
          <h3 className="text-sm text-muted-foreground">Тип</h3>
          <div className="flex gap-2 mt-2 flex-wrap">
            <CityBadge variant={type === 'active' ? 'selected' : 'default'} onClick={() => setType('active')}>Актуальные</CityBadge>
            <CityBadge variant={type === 'all' ? 'selected' : 'default'} onClick={() => setType('all')}>Все</CityBadge>
            <CityBadge variant={type === 'past' ? 'selected' : 'default'} onClick={() => setType('past')}>Прошедшие</CityBadge>
          </div>
        </div>
        <div>
          <h3 className="text-sm text-muted-foreground">Город</h3>
          <div className="flex gap-2 mt-2 flex-wrap">
            <CityBadge variant={selectedCity === null ? "selected" : 'default'} onClick={() => setSelectedCity(null)}>Все города</CityBadge>
            {props.cities.map(e => <CityBadge variant={selectedCity === e.id ? "selected" : 'default'} key={e.id} onClick={() => setSelectedCity(e.id)}
            >{e.attributes.name}</CityBadge>)}
            {/* <CityBadge variant={"selected"}>{props.city}</CityBadge>
            <CityBadge variant={"default"}>Санкт-Петербург</CityBadge>
            <CityBadge variant={"default"}>Казань</CityBadge>
            <CityBadge variant={"default"}>Новосибирск</CityBadge>
            <CityBadge variant={"default"}>Екатеринбург</CityBadge>
            <CityBadge variant={"default"}>Краснодар</CityBadge> */}
          </div>
        </div>
        <div>
          <h3 className="text-sm text-muted-foreground">Специальность</h3>
          <div className="flex gap-2 mt-2 flex-wrap">
            <CityBadge variant="selected">Все специальности</CityBadge>
            <CityBadge variant={"default"} disabled>Терапия</CityBadge>
            <CityBadge variant={"default"} disabled>Реставрация</CityBadge>
            <CityBadge variant={"default"} disabled>Хирургия</CityBadge>
            <CityBadge variant={"default"} disabled>Ортодонтия</CityBadge>
            <CityBadge variant={"default"} disabled>Имплантация</CityBadge>
            <CityBadge variant={"default"} disabled>Эстетика</CityBadge>
          </div>
        </div>



        {/* <div>
          <h3 className="text-sm text-muted-foreground">Тип</h3>
          <div className="flex gap-2 mt-2 flex-wrap">
            <CityBadge variant={"default"}>Лекция</CityBadge>
            <CityBadge variant={"default"}>Практический курс</CityBadge>
          </div>
        </div> */}
      </div>
      <div className="grid lg:grid-cols-[1fr,1fr,1fr] gap-4">
        {events?.map((e, index) => (
          <EventCard event={e} key={index} className="!bg-muted" />
        ))}
      </div>
    </div>
  )
}