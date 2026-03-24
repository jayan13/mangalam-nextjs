import { useEffect, useRef } from "react";

const GoogleAd = ({ ids, slot }) => {
  const adId = ids + '-right';

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
        <ins className="adsbygoogle"
          key={adId}
          id={adId}
          style={{ display: "block", textAlign: "center" }}
          data-ad-layout="in-article"
          data-ad-format="fluid"
          data-ad-client="ca-pub-8314111999877332"
          data-ad-slot={slot}></ins>
      </div>
    </div>
  );

};

export default GoogleAd;

