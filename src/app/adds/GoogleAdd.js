'use client'
import { useEffect, useRef } from "react";

const GoogleAdd = (prmp) => {
  const Id=prmp.aid;
  const adSlot=prmp.adSlot;
  const adRef = useRef(null);
  const adsLoaded = useRef(false);
  useEffect(() => {
    const loadAd = () => {
      if (typeof window !== "undefined" && window.adsbygoogle) {
        try {
          (window.adsbygoogle = window.adsbygoogle || []).push({});
          adsLoaded.current = true;
        } catch (err) {
          console.error("AdSense error:", err);
        }
        
      }
    };
  
    if (!adsLoaded.current) {
      setTimeout(loadAd, 0);
    }
  }, [adRef]); // Ensure it runs when the component mounts

  return (
    <div className="advertisement">
    <div className="advertisement-text">Advertisement</div>
    <div ref={adRef} className="ad my-4 flex justify-center ad-container" style={{ width: "100%", maxWidth: "300px", margin: "0 auto", textAlign: "center" }}>
      <ins
        key={Id}        
        id={Id}
        ref={adsLoaded}
        className="adsbygoogle"
        style={{ display: "block", minWidth: "924px"}}
        data-ad-client="ca-pub-8314111999877332"
        data-ad-slot={adSlot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      ></ins>
    </div>
  </div>
  );
};

export default GoogleAdd;
