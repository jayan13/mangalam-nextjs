import { useEffect, useRef } from "react";
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from "next/image";
import AddDoubleClick from './AddDoubleClick';
import GoogleAd from "./GoogleAd";

const GoogleAdPcItem = ({adId}) => {
  
  const adRef = useRef(null);
  const pathname = usePathname();
  
  if(pathname == '' || pathname == '/') //homepage
    {
      if(adId==0)
        {
        return (
        <div className="advertisement no-margin">
          <div className="advertisement-text">Advertisement</div>
          <div className="ad"> 
          <Link href="https://ksfe.com/" target="_blank"><Image src={'/uploads/ads/kfc300x250.jpg'} alt={'KSFE'} width={300} height={250} loading="lazy" /></Link>
          </div>
          </div>);
        }
        else if(adId==1)
          {
            return (
              <GoogleAd ids={adId} slot="5038048789" />
            );
          }else
          if(adId==2)
            {
              return (
                <AddDoubleClick divid='DWTag-DFPNew_RS70_Mangalam_Banner_300x250_1_HP_180418' slotid='/229445249,78477659/DWTag-DFPNew_RS70_Mangalam_Banner_300x250_1_HP_180418' w='300' h='250'/>
              );
            }
          else if(adId==3)
            {
              return (
                <GoogleAd ids={adId} slot="3860677183"/>
              );
            }
            else if(adId==4)
              {
                return (
                  <AddDoubleClick divid='DWTag-DFPNew_RS70_Mangalam_Banner_300x250_2_HP_180418' slotid='/229445249,78477659/DWTag-DFPNew_RS70_Mangalam_Banner_300x250_2_HP_180418' w='300' h='250'/>
                );
              }
            else{
                return(<></>);
              }
    
    }else{

      if(adId==0)
      {
        return (
          <GoogleAd ids={adId} slot="5038048789" />
        );
      }else
      if(adId==1)
        {
          return (
            <AddDoubleClick divid='DWTag-DFPNew_RS70_Mangalam_Banner_300x250_1_HP_180418' slotid='/229445249,78477659/DWTag-DFPNew_RS70_Mangalam_Banner_300x250_1_HP_180418' w='300' h='250'/>
          );
        }
      else if(adId==2)
        {
          return (
            <GoogleAd ids={adId} slot="3860677183"/>
          );
        }
        else if(adId==3)
          {
            return (
              <AddDoubleClick divid='DWTag-DFPNew_RS70_Mangalam_Banner_300x250_2_HP_180418' slotid='/229445249,78477659/DWTag-DFPNew_RS70_Mangalam_Banner_300x250_2_HP_180418' w='300' h='250'/>
            );
          }
        else{
            return(<></>);
          }

      
    }
};

export default GoogleAdPcItem;

