'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

function buildKeyFromLocation() {
  const pathname = window.location.pathname || '';
  const search = window.location.search || '';
  return `${pathname}${search}`;
}

function getScrollY() {
  return window.scrollY || window.pageYOffset || 0;
}

export default function ScrollRestoration() {
  const pathname = usePathname();
  const saveTimerRef = useRef(null);
  const isBackNavigationRef = useRef(false);
  const initialLoadRef = useRef(true);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Set scroll restoration to manual
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    // Handle popstate (back/forward navigation)
    const onPopState = () => {
      isBackNavigationRef.current = true;
      sessionStorage.setItem('nav:back:flag', '1');
      
      // Clear any pending list-ready flag
      sessionStorage.removeItem('list-ready');
    };

    // Handle pageshow for bfcache
    const onPageShow = (e) => {
      if (e.persisted) {
        isBackNavigationRef.current = true;
        sessionStorage.setItem('nav:back:flag', '1');
      }
    };

    window.addEventListener('popstate', onPopState);
    window.addEventListener('pageshow', onPageShow);

    return () => {
      window.removeEventListener('popstate', onPopState);
      window.removeEventListener('pageshow', onPageShow);
    };
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const saveScroll = () => {
      try {
        // Only save scroll for listing pages
        const isListing = /^\/($|district\b|category\b)/.test(pathname);
        if (!isListing) return;

        const currentKey = buildKeyFromLocation();
        const currentY = getScrollY();
        
        if (currentY > 0) {
          sessionStorage.setItem(`scroll:${currentKey}`, String(currentY));
        }
      } catch (error) {
        console.error('Failed to save scroll position:', error);
      }
    };

    const onScroll = () => {
      if (saveTimerRef.current) {
        clearTimeout(saveTimerRef.current);
      }
      saveTimerRef.current = setTimeout(saveScroll, 150);
    };

    const onListReady = () => {
      // Only restore on back navigation
      if (!isBackNavigationRef.current) return;
      
      const currentKey = buildKeyFromLocation();
      const savedScroll = sessionStorage.getItem(`scroll:${currentKey}`);
      
      if (savedScroll) {
        const targetY = parseInt(savedScroll, 10);
        if (targetY > 0) {
          // Attempt to restore scroll position
          const attemptRestore = (attempts = 0) => {
            const maxAttempts = 10;
            const maxScrollY = document.documentElement.scrollHeight - window.innerHeight;
            
            if (targetY <= maxScrollY || attempts >= maxAttempts - 1) {
              window.scrollTo({ top: Math.min(targetY, maxScrollY), behavior: 'instant' });
              isBackNavigationRef.current = false;
              sessionStorage.removeItem('nav:back:flag');
            } else {
              // Wait for more content to load
              setTimeout(() => attemptRestore(attempts + 1), 200);
            }
          };
          
          setTimeout(() => attemptRestore(), 100);
        }
      }
    };

    const onScrollRestored = (event) => {
      // Scroll restoration completed by infinite scroll hook
      if (event.detail?.scrollY > 0) {
        isBackNavigationRef.current = false;
        sessionStorage.removeItem('nav:back:flag');
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('list-ready', onListReady);
    window.addEventListener('scroll-restored', onScrollRestored);

    // Reset back navigation flag after initial load
    if (initialLoadRef.current) {
      initialLoadRef.current = false;
      const isBack = sessionStorage.getItem('nav:back:flag') === '1';
      if (!isBack) {
        sessionStorage.removeItem('nav:back:flag');
      }
    }

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('list-ready', onListReady);
      window.removeEventListener('scroll-restored', onScrollRestored);
      if (saveTimerRef.current) {
        clearTimeout(saveTimerRef.current);
      }
    };
  }, [pathname]);

  return null;
}