"use client";
import { useEffect, useRef } from "react";
import { useRouter,usePathname } from 'next/navigation';


const GoogleAd = () => {
  const adLoaded = useRef(false); // ✅ Track if the ad has already been loaded
  const router = useRouter();

  useEffect(() => {
    const loadAd = () => {
      if (typeof window !== "undefined" && window.adsbygoogle) {
        window.adsbygoogle = window.adsbygoogle || [];
        window.adsbygoogle.push({});
        adLoaded.current = true;
      }
    };
  
    if (router.query && !adLoaded.current) {
      setTimeout(loadAd, 0);
    }
  }, [router.query]);

  const pathname = usePathname();
  if(pathname == '' || pathname == '/') //home page
  {
    return (
      <div className="advertisement">
        <div className="advertisement-text">Advertisement</div>
        <div className="ad ad-container" style={{ width: "100%",  margin: "0 auto", textAlign: "center" }}>
          <ins
            className="adsbygoogle"
            style={{ display: "block", minWidth: "1200px"}}
            data-ad-client="ca-pub-8314111999877332"
            data-ad-slot="8131115980"
            data-ad-format="auto"
            data-full-width-responsive="true"
          ></ins>
        </div>
      </div> 
    );
    
  }else{
    return (
      <div className="advertisement">
        <div className="advertisement-text">Advertisement</div>
        <div className="ad ad-container" style={{ width: "100%", margin: "0 auto", textAlign: "center" }}>
          <ins
            className="adsbygoogle"
            style={{ display: "block", minWidth: "1200px"}}
            data-ad-client="ca-pub-8314111999877332"
            data-ad-slot="8131115980"
            data-ad-format="auto"
            data-full-width-responsive="true"
          ></ins>
        </div>
      </div> 
    );
  }
  
};

export default GoogleAd;

