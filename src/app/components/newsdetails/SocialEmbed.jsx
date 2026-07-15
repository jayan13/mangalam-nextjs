"use client";

import { useEffect, useRef, useState } from "react";
import Script from "next/script";

export default function SocialEmbed({ html }) {
  const containerRef = useRef(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !containerRef.current || !html) return;

    // Remove embed scripts from CMS content
    const cleanHtml = html
      .replace(
        /<script[^>]*src=["'](?:https?:)?\/\/platform\.(?:twitter|x)\.com\/widgets\.js[^>]*><\/script>/gi,
        ""
      )
      .replace(
        /<script[^>]*src=["'](?:https?:)?\/\/(?:www\.)?instagram\.com\/embed\.js[^>]*><\/script>/gi,
        ""
      );

    containerRef.current.innerHTML = cleanHtml;

    // Small delay allows DOM insertion before widgets process it
    requestAnimationFrame(() => {
      // X / Twitter
      if (window.twttr?.widgets) {
        window.twttr.widgets.load(containerRef.current);
      }

      // Instagram
      if (window.instgrm?.Embeds) {
        window.instgrm.Embeds.process();
      }
    });

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
      }
    };
  }, [html, mounted]);

  return (
    <>
      {/* X Widget */}
      <Script
        src="https://platform.x.com/widgets.js"
        strategy="lazyOnload"
      />

      {/* Instagram Widget */}
      <Script
        src="https://www.instagram.com/embed.js"
        strategy="lazyOnload"
      />

      {/* Empty during SSR. HTML inserted only on client. */}
      <div ref={containerRef} className="social-embed" />
    </>
  );
}