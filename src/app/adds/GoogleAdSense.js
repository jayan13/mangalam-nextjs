"use client";
import Script from "next/script";

const GoogleAdSense = () => {
  return (
    <Script
      id="adsense-script"
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_GOOGLE_ADS_CLIENT_ID}`}
      strategy="afterInteractive"
      crossOrigin="anonymous"
      onLoad={() => {
        try {
          if (window.adsbygoogle) {
            window.adsbygoogle.push({});
          }
        } catch (e) {
          console.error("AdSense failed to load", e);
        }
      }}
    />
  );
};

export default GoogleAdSense;