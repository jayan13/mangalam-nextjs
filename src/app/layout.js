import { Noto_Sans_Malayalam } from "next/font/google";
import "./globals.css";

const noto_sans_malayalam = Noto_Sans_Malayalam({
  subsets: ["malayalam", "latin"],
  weight: ["400", "500", "700"],
  variable: "--font-noto-sans-malayalam",
  display: "swap",
});

import Header from "./components/header";
import Footer from "./components/footer";

import Addheader from "./adds/Addheader";
import GoogleAdSense from "./adds/GoogleAdSense";
import GaddTop from "./adds/GaddTop";
import AddDoubleClick from "./adds/AddDoubleClick";
export const metadata = {
  title: "Mangalam-Latest Kerala News",
  description: "Mangalam-Latest Kerala News, Malayalam News,  Politics, Malayalam Cinema, Sports",
};

export default function RootLayout({ children }) {

  return (
    <html lang="en" className={noto_sans_malayalam.variable}>
      <head>
        <meta name="facebook-domain-verification" content="s1hoxh2eofwg6u6fy1z4k2evg27028" />
        {process.env.NODE_ENV === 'production' && <Addheader />}
      </head>
      <body >
        {process.env.NODE_ENV === 'production' && (
          <>
            <GoogleAdSense />
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

