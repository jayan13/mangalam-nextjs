//import  "bootstrap/dist/css/bootstrap.min.css"
//import { Inter } from "next/font/google";
import Script from 'next/script';
import "./globals.css";
//import "../../node_modules/swiper/swiper-bundle.min.css"
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import Header from "./components/header";
import Footer from "./components/footer";
import TopAdv from "./components/topadv";
//import gaddcli from "./components/GoogleAddclient";

// <AddBootstrap/>


export const metadata = {
  title: "Mangalam-Latest Kerala News",
  description: "Mangalam-Latest Kerala News, Malayalam News,  Politics, Malayalam Cinema, Sports",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body >
      <div className="screen">
      <Header />
      <TopAdv />
        {children}
      <Footer />
      </div>  
      </body>
    </html>
  );
}

