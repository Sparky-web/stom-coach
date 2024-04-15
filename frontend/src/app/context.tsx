"use client";

import { ReactNode, createContext } from "react";
import { Settings } from "~/server/api/routers/strapi";

type Data = {
  settings: Settings;
};

export const DataContext = createContext<Data>({
  settings: {} as Settings,
});

export default function DataProvider(props: { data: Data, children: ReactNode }) {
  return <DataContext.Provider value={props.data}>
    {props.children}
  </DataContext.Provider>;
}
