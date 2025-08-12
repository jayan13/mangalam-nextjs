"use client";
import { useEffect } from "react";

const AddDoubleClick = ({divid,slotid,w,h}) => {
  
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.googletag = window.googletag || { cmd: [] };

      window.googletag.cmd.push(() => {
        const adDiv = document.getElementById(divid);

        if (!adDiv) return; //  Prevents errors if the div is missing

        //  Prevent duplicate slot creation
        if (!window.googletag.pubads().getSlots().some(slot => slot.getSlotElementId() === divid)) {
          const slot = window.googletag
            .defineSlot(slotid, [w, h], divid)
            ?.addService(window.googletag.pubads());

          if (slot) {
            window.googletag.enableServices();
            window.googletag.display(divid);
          }
        }
      });
    }
  }, []);
  return (
    <div id={divid} >
    </div>
  );
};

export default AddDoubleClick;

