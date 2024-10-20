'use client'
// components/GoogleAd.js

import { useEffect } from 'react';

const GoogleAd = ({ adSlot, adStyle }) => {
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      console.error("AdSense error", e);
    }
  }, []);

  return (
    <ins
      className="adsbygoogle"
      style={{ display: 'block', ...adStyle }}
      data-ad-client={process.env.GOOGLE_ADSENSE_CLIENT_ID}
      data-ad-slot={adSlot}
      data-ad-format="auto"
    />
  );
};

export default GoogleAd;
