'use client'
import { useEffect } from 'react';
import Script from 'next/script';

export default function GoogleAdd() {
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
        data-ad-slot="7342193190"
        data-ad-format="autorelaxed"
        data-full-width-responsive="true"
      />
    
    </div>
  );
}