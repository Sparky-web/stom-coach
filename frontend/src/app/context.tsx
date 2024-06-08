"use client";

import { ReactNode, createContext, useEffect, useState } from "react";
import { CookiesProvider, useCookies } from "react-cookie";
import { api } from "~/trpc/react";
import { Settings } from "~/types/entities";


type Data = {
  settings: Settings;
};

export const DataContext = createContext<Data>({
  settings: {} as Settings,
});

export default function DataProvider(props: { data: Data, children: ReactNode }) {
  // useEffect(() => {
  //   getCity().then(setData)
  // }, [])

  return <DataContext.Provider value={{
    ...props.data,
  }}>
    <CookiesProvider>
      {props.children}
    </CookiesProvider>
  </DataContext.Provider>;
}
