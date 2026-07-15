"use client";

import { useEffect, useRef, useState } from "react";

export default function EmbedContent({ html }) {
  const ref = useRef(null);
  const [mounted, setMounted] = useState(false);
  const cleanHtml = html.replace(  /<script[^>]*src="https:\/\/platform\.(twitter|x)\.com\/widgets\.js"[^>]*><\/script>/gi,  "").replace( /<script[^>]*src=["'](?:https?:)?\/\/(?:www\.)?instagram\.com\/embed\.js[^>]*><\/script>/gi, "" );

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    if (ref.current) {
      ref.current.innerHTML = cleanHtml;
    }

    window.twttr?.widgets?.load(ref.current);
    window.instgrm?.Embeds?.process();
  }, [mounted, cleanHtml]);

  if (!mounted) return null;

  return <div ref={ref} />;
}