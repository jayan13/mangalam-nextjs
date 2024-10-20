'use client'
import { useEffect } from 'react';
import Script from 'next/script';

export default function GaddTop() {
  useEffect(() => {
    // Initialize AdSense ads
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      console.error('AdSense failed to load', e);
    }
  }, []);

  return (
    <div className="ad">
      {/* Google AdSense Ad Unit */}
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-8314111999877332"
        data-ad-slot="8131115980"
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
      <Script id="adsense-init" strategy="afterInteractive">
        {`(adsbygoogle = window.adsbygoogle || []).push({});`}
      </Script>
    </div>
  );
}
