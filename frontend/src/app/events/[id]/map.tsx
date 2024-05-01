"use client";

import { YMaps, Map, Placemark, ZoomControl } from '@pbe/react-yandex-maps';

import React from 'react';

export default function MapComponent({ coordinates }: { coordinates: [number, number] }) {
  return (
    <YMaps>
      {coordinates && <Map
        // className='rounded-xl'
        height={"100%"}
        width={'100%'}
        defaultState={{
          center: coordinates,
          zoom: 12,
        }}
      >
        {/* @ts-ignore */}
        <ZoomControl options={{ float: "right" }} />
        <Placemark geometry={coordinates} options={{
          iconLayout: "default#image",
          iconImageSize: [42, 42],
          iconImageHref: "https://img.icons8.com/ios-glyphs/60/marker--v1.png"
        }} />
      </Map>}
    </YMaps>
  )
}