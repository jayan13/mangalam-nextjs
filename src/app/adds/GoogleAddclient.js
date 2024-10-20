
import Script from 'next/script';
//import Head from 'next/head';

export default function googlehd() {
   
    return (

      <>
          <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"
          strategy="afterInteractive"
          onError={(e) => {
            console.error("Google AdSense script failed to load", e);
          }}
        />
        <Script id="adsense-init" strategy="afterInteractive">
          {`
            (adsbygoogle = window.adsbygoogle || []).push({
              google_ad_client: "ca-pub-8314111999877332",
              enable_page_level_ads: true
            });
          `}
        </Script>
        </>
    );
  }