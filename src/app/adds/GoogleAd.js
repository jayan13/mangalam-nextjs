import { useEffect, useRef } from "react";

const GoogleAd = ({ids,slot}) => {
  const adId=ids+'-right';
  
  const adRef = useRef(null);
      useEffect(() => {
        if (window && window.adsbygoogle) {
          try {
            (window.adsbygoogle = window.adsbygoogle || []).push({});
          } catch (err) {
            //console.error("AdSense error:", err);
          }
        }
      }, [adRef]); // Ensure it runs when the component mounts
    return (
      <div className="advertisement">
      <div className="advertisement-text">Advertisement</div>
      <div ref={adRef} className="ad my-4 flex justify-center ad-container" style={{ width: "100%", maxWidth: "300px", margin: "0 auto", textAlign: "center" }}>
        <ins
          key={adId}        
          id={adId}
          className="adsbygoogle h-full"
          style={{ display: "block", minWidth: "300px", minHeight: "250px" }}
          data-ad-client="ca-pub-8314111999877332"
          data-ad-slot={slot}
          data-ad-format="auto"
          data-full-width-responsive="true"
        ></ins>
      </div>
    </div>
    );

};

export default GoogleAd;

