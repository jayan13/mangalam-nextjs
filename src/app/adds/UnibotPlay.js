"use client"
import { useEffect } from "react";

const UnibotsAd = () => {
  useEffect(() => {
    window.unibots = window.unibots || { cmd: [] };
    window.unibots.cmd.push(() => {
      if (typeof unibotsPlayer === "function") {
        unibotsPlayer("mangalam.com_1679478637377");
      }
    });
  }, []);

  return <div id="div-ub-mangalam.com_1679478637377"></div>;
};

export default UnibotsAd;
