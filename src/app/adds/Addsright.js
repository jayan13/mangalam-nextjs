import { useEffect, useRef } from "react";
import { usePathname } from 'next/navigation';
import AddDoubleClick from './AddDoubleClick';
import GoogleAd from "./GoogleAd";
import RightTop from "./RightTop";

const GoogleAdPcItem = ({ adId }) => {

  const adRef = useRef(null);
  const pathname = usePathname();

  if (pathname == '' || pathname == '/') //homepage
  {
    if (adId == 0) {
      return (
          <div className="desktop-only">
            <RightTop type="desktop" />
          </div>
        );
    }
    else if (adId == 1) {
      return (
        <GoogleAd ids={adId} slot="5038048789" />
      );
    } else
      if (adId == 2) {
        return (
          <AddDoubleClick divid='DWTag-DFPNew_RS70_Mangalam_Banner_300x250_1_HP_180418' slotid='/229445249,78477659/DWTag-DFPNew_RS70_Mangalam_Banner_300x250_1_HP_180418' w='300' h='250' />
        );
      }
      else if (adId == 3) {
        return (
          <GoogleAd ids={adId} slot="3860677183" />
        );
      }
      else if (adId == 4) {
        return (
          <AddDoubleClick divid='DWTag-DFPNew_RS70_Mangalam_Banner_300x250_2_HP_180418' slotid='/229445249,78477659/DWTag-DFPNew_RS70_Mangalam_Banner_300x250_2_HP_180418' w='300' h='250' />
        );
      }
      else {
        return (<></>);
      }

  } else {

    if (adId == 0) {
      return (
        <GoogleAd ids={adId} slot="5038048789" />
      );
    } else
      if (adId == 1) {
        return (
          <AddDoubleClick divid='DWTag-DFPNew_RS70_Mangalam_Banner_300x250_1_HP_180418' slotid='/229445249,78477659/DWTag-DFPNew_RS70_Mangalam_Banner_300x250_1_HP_180418' w='300' h='250' />
        );
      }
      else if (adId == 2) {
        return (
          <GoogleAd ids={adId} slot="3860677183" />
        );
      }
      else if (adId == 3) {
        return (
          <AddDoubleClick divid='DWTag-DFPNew_RS70_Mangalam_Banner_300x250_2_HP_180418' slotid='/229445249,78477659/DWTag-DFPNew_RS70_Mangalam_Banner_300x250_2_HP_180418' w='300' h='250' />
        );
      }
      else {
        return (<></>);
      }


  }
};

export default GoogleAdPcItem;

