"use client";

import { useEffect } from "react";

export default function MgidInlineWidget() {
  useEffect(() => {
    // Tell MGID to scan/load widgets after this component is mounted
    window._mgq = window._mgq || [];
    window._mgq.push(["_mgc.load"]);
  }, []);

  return (
    <><div
        data-type="_mgwidget"
        data-widget-id="1358041"
      />
    </>
  );
}