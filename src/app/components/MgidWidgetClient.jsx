"use client";

import { useEffect, useRef } from "react";
import Script from "next/script";

const MGID_SCRIPT_ID = "mgid-site-script";
const MGID_SCRIPT_SRC = "https://jsc.mgid.com/site/830015.js";

export default function MgidWidgetClient() {
  const loadedRef = useRef(false);
  const publisherId = process.env.NEXT_PUBLIC_MGID_PUBLISHER_ID || "830015";

  useEffect(() => {
    if (loadedRef.current) return;

    loadedRef.current = true;
    window._mgq = window._mgq || [];
    window._mgq.push(["_mgc.load"]);
  }, []);

  return (
    <div className="mgid-widget no-printme" suppressHydrationWarning>
      <Script id={MGID_SCRIPT_ID} src={MGID_SCRIPT_SRC} strategy="afterInteractive" async />
      <div
        data-type="_mgwidget"
        data-widget-id="1358040"
        data-src-id={publisherId}
        suppressHydrationWarning
      />
    </div>
  );
}