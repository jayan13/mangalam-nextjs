'use client';

import { useEffect, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

export default function NavigationLoader() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);

  // Turn off loading when the target page successfully renders
  useEffect(() => {
    setIsLoading(false);
  }, [pathname, searchParams]);

  useEffect(() => {
    const handleClick = (e) => {
      // Find the closest anchor tag going up the DOM tree
      const target = e.target.closest('a');
      if (!target) return;
      
      const href = target.getAttribute('href');
      // If it's an anchor link, a new tab, or just missing href, ignore it.
      if (!href || href.startsWith('#') || target.getAttribute('target') === '_blank') return;
      
      try {
        const targetUrl = new URL(target.href);
        const currentUrl = new URL(window.location.href);
        
        // Ignore external links
        if (targetUrl.hostname !== currentUrl.hostname) return;
        
        // Ignore if they click a link to the exact same page they are already on
        if (targetUrl.pathname === currentUrl.pathname && targetUrl.search === currentUrl.search) return;
        
        // Ignore if user is holding Ctrl/Cmd to open in new tab
        if (e.ctrlKey || e.metaKey || e.shiftKey) return;
        
        // Start the progress bar
        setIsLoading(true);

        // Fallback: forcefully turn off the progress bar after 6 seconds if navigation gets stuck or cancelled natively by Next.js
        setTimeout(() => setIsLoading(false), 6000);
      } catch (err) {
        // In case URL parsing fails, ignore.
      }
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [pathname, searchParams]);

  if (!isLoading) return null;

  return (
    <div className="global-nav-loader">
      <div className="nav-loader-bar"></div>
    </div>
  );
}
