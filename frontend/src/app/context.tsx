"use client";

import { ReactNode, createContext, useEffect, useState } from "react";
import { Settings } from "~/types/entities";


type Data = {
  settings: Settings;
};

export const DataContext = createContext<Data>({
  settings: {} as Settings,
});

export default function DataProvider(props: { data: Data, children: ReactNode }) {
  // const [data, setData] = useState(null)

  // useEffect(() => {
  //   getCity().then(setData)
  // }, [])

  return <DataContext.Provider value={{
    ...props.data
  }}>
    {props.children}
  </DataContext.Provider>;
}
