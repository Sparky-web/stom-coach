import "~/styles/globals.css";

import { Inter } from "next/font/google";

import { TRPCReactProvider } from "~/trpc/react";
import Navbar from "~/app/_components/navbar/index";
import { api } from "~/trpc/server";
import DataProvider from "./context";
import { Open_Sans } from "next/font/google";
import { getConfig } from "~/lib/getConfig";

import { headers } from "next/headers";
import Footer from "./_components/footer";
import getCity from "~/functions/getCity";
import { Toaster } from "~/components/ui/sonner";
import AuthProvider from "./auth-context";
import Contacts from "./_components/contacts";


// const inter = Inter({
//   subsets: ["latin"],
// });


const OpenSans = Open_Sans({
  subsets: ["latin"],
});

export const metadata = {
  title: "STOMCOACH - Учебный центр для стоматологов",
  description: `г. Екатеринбург, улица Мамина-Сибиряка, 52
Режим работы: Пн-Пт с 10:00 до 18:00
+7 (922) 207-50-50 - Виктория
education@stom-coach.ru`,
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export const dynamic = "force-dynamic"

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getConfig();

  let user = null
  try {
    user = await api.auth.me.query()
  } catch (e) {
    
  }

  return (
    <html lang="ru">
      <head>
        {/* <link href="https://cdnjs.cloudflare.com/ajax/libs/flowbite/2.3.0/flowbite.min.css" rel="stylesheet" /> */}
        {/* <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com"
          // @ts-ignore
          crossOrigin
        />
        <link href="https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300..800;1,300..800&display=swap" rel="stylesheet" /> */}

        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet"></link>
      </head>
      <body className="min-h-[100dvh] flex flex-col">
        <TRPCReactProvider>
          <AuthProvider user={user}>
            <DataProvider
              data={{ settings }}
            >
              <Navbar />
              {children}
              <Contacts settings={settings} />
              <div className="mt-auto">
                <Footer />
              </div>
              <Toaster />
            </DataProvider>
          </AuthProvider>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
