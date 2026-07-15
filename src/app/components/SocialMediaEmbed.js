'use client';

import { useEffect, useRef } from 'react';
import Script from 'next/script';

export default function SocialMediaEmbed({ content }) {
  const containerRef = useRef(null);

  useEffect(() => {
    const processEmbeds = () => {
      // Process Instagram embeds
      // @ts-ignore
      if (window.instgrm) {
        // @ts-ignore
        window.instgrm.Embeds.process();
      }

      // Process Twitter/X embeds
      // @ts-ignore
      if (window.twttr && window.twttr.widgets) {
        // @ts-ignore
        window.twttr.widgets.load();
      }
    };

    // Load Instagram script
    const loadInstagramScript = () => {
      if (!document.querySelector('script[src="//www.instagram.com/embed.js"]')) {
        const script = document.createElement('script');
        script.src = '//www.instagram.com/embed.js';
        script.async = true;
        script.onload = processEmbeds;
        document.body.appendChild(script);
      } else {
        processEmbeds();
      }
    };

    // Load Twitter/X script
    const loadTwitterScript = () => {
      if (!document.querySelector('script[src="//platform.twitter.com/widgets.js"]')) {
        const script = document.createElement('script');
        script.src = '//platform.twitter.com/widgets.js';
        script.async = true;
        script.onload = processEmbeds;
        document.body.appendChild(script);
      } else {
        processEmbeds();
      }
    };

    // Initial load
    const timer = setTimeout(() => {
      loadInstagramScript();
      loadTwitterScript();
    }, 500);

    // Observer for dynamic content
    const observer = new MutationObserver(() => {
      processEmbeds();
    });

    if (containerRef.current) {
      observer.observe(containerRef.current, {
        childList: true,
        subtree: true,
      });
    }

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, [content]);

  return (
    <div ref={containerRef} className="social-embed-container" dangerouslySetInnerHTML={{ __html: content }} />
      
  );
}