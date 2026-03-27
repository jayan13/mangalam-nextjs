import React, { Suspense } from 'react';
import { Noto_Sans_Malayalam, Roboto_Condensed } from "next/font/google";
import "./globals.css";

const noto_sans_malayalam = Noto_Sans_Malayalam({
  subsets: ["malayalam", "latin"],
  weight: ["400", "500", "700"],
  variable: "--font-noto-sans-malayalam",
  display: "swap",
});

const roboto_condensed = Roboto_Condensed({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-roboto-condensed",
  display: "swap",
});

import Header from "./components/header";
import Footer from "./components/footer";
import NavigationLoader from "./components/NavigationLoader";

import Addheader from "./adds/Addheader";
import GaddTop from "./adds/GaddTop";
import AddDoubleClick from "./adds/AddDoubleClick";

export const metadata = {
  title: "Mangalam-Latest Kerala News",
  description: "Mangalam-Latest Kerala News in Malayalam",
  keywords: "Mangalam-Latest Kerala News, Malayalam News,  Politics, Malayalam Cinema, Sports",
};

export const revalidate = 600;

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${noto_sans_malayalam.variable} ${roboto_condensed.variable}`}>
      <head>
        <meta name="facebook-domain-verification" content="s1hoxh2eofwg6u6fy1z4k2evg27028" />
        {process.env.NODE_ENV === 'production' && (
          <>
            <Addheader />
            {process.env.NEXT_PUBLIC_GOOGLE_ADS_CLIENT_ID && (
              <script
                async
                src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_GOOGLE_ADS_CLIENT_ID}`}
                crossOrigin="anonymous"
              />
            )}
          </>
        )}
      </head>
      <body suppressHydrationWarning>
        <Suspense fallback={null}>
          <NavigationLoader />
        </Suspense>
        {process.env.NODE_ENV === 'production' && (
          <>
            <AddDoubleClick divid='DWTag-DFPOld_RS00_Mangalam_Multi_1x1_03082020' slotid='/36888185/DWTag-DFPOld_RS00_Mangalam_Multi_1x1_03082020' w='300' h='250' />
          </>
        )}
        <div className="screen">
          <Header />
          <GaddTop />
          {children}
          <Footer />
        </div>
      </body>
    </html>
  );
}
