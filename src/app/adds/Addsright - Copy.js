import { useEffect, useRef } from "react";
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from "next/image";
const GoogleAdPcItem = (Id) => {
  const adId=Id.adId+'-right';
  const adRef = useRef(null);
  const pathname = usePathname();
  if((pathname == '' || pathname == '/') && Id.adId==0)
    {
      return (
      <div className="advertisement no-margin">
        <div className="advertisement-text">Advertisement</div>
        <div className="ad"> 
        <Link href="https://ksfe.com/" target="_blank"><Image src={'/uploads/ads/kfc300x250.jpg'} alt={'KSFE'} width={300} height={250} loading="lazy" /></Link>
        </div>
        </div>);
    }else{
      useEffect(() => {
        if (window && window.adsbygoogle) {
          try {
            (window.adsbygoogle = window.adsbygoogle || []).push({});
          } catch (err) {
            console.error("AdSense error:", err);
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
          data-ad-slot="5038048789"
          data-ad-format="auto"
          data-full-width-responsive="true"
        ></ins>
      </div>
    </div>
    );
}
};

export default GoogleAdPcItem;

