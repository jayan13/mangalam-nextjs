
import Script from 'next/script';
import "./globals.css";

import Header from "./components/header";
import Footer from "./components/footer";
import TopAdv from "./adds/topadv";
import Addheader from "./adds/Addheader";

export const metadata = {
  title: "Mangalam-Latest Kerala News",
  description: "Mangalam-Latest Kerala News, Malayalam News,  Politics, Malayalam Cinema, Sports",
};

export default function RootLayout({ children }) {
  /* 
  <Script async  src={`https://www.googletagmanager.com/gtag/js?${process.env.GOOGLE_ANALYTICS}`} />
      <Script
          dangerouslySetInnerHTML={{
            __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${process.env.GOOGLE_ANALYTICS}', {
              page_path: window.location.pathname,
            });
          `,
          }}
        />
  */
  return (
    <html lang="en">
      <head>
      {/*<Addheader />*/}
      </head>
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

