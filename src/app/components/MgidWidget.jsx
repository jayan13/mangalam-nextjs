"use client";

import dynamic from "next/dynamic";

const MgidWidgetClient = dynamic(() => import("./MgidWidgetClient"), { ssr: false });

export default function MgidWidget() {
  return <MgidWidgetClient />;
}