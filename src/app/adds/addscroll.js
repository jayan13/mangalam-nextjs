"use client";
import { useEffect } from "react";

const AdBanner = () => {
 
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.googletag = window.googletag || { cmd: [] };

      window.googletag.cmd.push(() => {
        const adDiv = document.getElementById("DWTag-DFPOld_RS00_Mangalam_Multi_1x1_03082020");

        if (!adDiv) return; // ✅ Prevents errors if the div is missing

        // ✅ Prevent duplicate slot creation
        if (!window.googletag.pubads().getSlots().some(slot => slot.getSlotElementId() === "DWTag-DFPOld_RS00_Mangalam_Multi_1x1_03082020")) {
          const slot = window.googletag
            .defineSlot("/36888185/DWTag-DFPOld_RS00_Mangalam_Multi_1x1_03082020", [300, 250], "DWTag-DFPOld_RS00_Mangalam_Multi_1x1_03082020")
            ?.addService(window.googletag.pubads());

          if (slot) {
            window.googletag.enableServices();
            window.googletag.display("DWTag-DFPOld_RS00_Mangalam_Multi_1x1_03082020");
          }
        }
      });
    }
  }, []);
  return (
    <div id="DWTag-DFPOld_RS00_Mangalam_Multi_1x1_03082020" >
    </div>
  );
};

export default AdBanner;

