"use client";
import { useEffect } from "react";

const GoogleAdSense = () => {
  useEffect(() => {
    if (document.getElementById("adsense-script")) return; // ✅ Prevent multiple script injections

    const script = document.createElement("script");
    script.id = "adsense-script";
    script.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js";
    script.async = true;
    script.crossOrigin = "anonymous";
    document.body.appendChild(script);

    script.onload = () => {
      try {
        if (window.adsbygoogle) {
          window.adsbygoogle.push({});
        }
      } catch (e) {
        console.error("AdSense failed to load", e);
      }
    };
  }, []);

  return null;
};

export default GoogleAdSense;