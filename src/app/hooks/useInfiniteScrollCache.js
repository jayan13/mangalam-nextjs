'use client'
import { useState, useEffect, useRef, useCallback } from 'react';

const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes in milliseconds

function getFirstId(arr) {
  try {
    if (!Array.isArray(arr) || arr.length === 0) return null;
    let first = arr[0];
    if (Array.isArray(first)) first = first[0];
    return first && typeof first === 'object' && first.id ? first.id : null;
  } catch (e) {
    return null;
  }
}

function isCacheValid(cachedData) {
  if (!cachedData || !cachedData.timestamp) return false;
  const now = Date.now();
  const age = now - cachedData.timestamp;
  return age < CACHE_DURATION;
}

export function useInfiniteScrollCache(cacheKey, initialData = [], initialPage = 1) {
  const [data, setData] = useState(() => {
    // 1. Synchronously inject the cache into the very first React mount!
    if (typeof window === 'undefined' || !cacheKey) return initialData;
    try {
      const saved = sessionStorage.getItem(`infinite-scroll-${cacheKey}`);
      if (!saved) return initialData;
      const parsed = JSON.parse(saved);
      
      // Check if cache is expired (older than 10 minutes)
      if (!isCacheValid(parsed)) {
        sessionStorage.removeItem(`infinite-scroll-${cacheKey}`);
        return initialData;
      }
      
      const backNavTsRaw = sessionStorage.getItem('nav-back-timestamp');
      const backNavTs = backNavTsRaw ? Number.parseInt(backNavTsRaw, 10) : 0;
      const isBackNavigation = Date.now() - backNavTs < 3000;

      const currentFirstId = getFirstId(initialData);
      const cachedFirstId = getFirstId(parsed?.data || []);

      const cachedLength = Array.isArray(parsed?.data) ? parsed.data.length : 0;
      const currentLength = Array.isArray(initialData) ? initialData.length : 0;
      
      // Use cache only if valid and content matches
      if (isBackNavigation && currentFirstId === cachedFirstId && cachedLength >= currentLength) {
        return parsed.data;
      }
    } catch (e) {
      console.error('Failed to parse cached data:', e);
    }
    return initialData;
  });

  const [page, setPage] = useState(() => {
    if (typeof window === 'undefined' || !cacheKey) return initialPage;
    try {
      const saved = sessionStorage.getItem(`infinite-scroll-${cacheKey}`);
      if (!saved) return initialPage;
      const parsed = JSON.parse(saved);
      
      // Check if cache is expired
      if (!isCacheValid(parsed)) return initialPage;
      
      const backNavTsRaw = sessionStorage.getItem('nav-back-timestamp');
      const backNavTs = backNavTsRaw ? Number.parseInt(backNavTsRaw, 10) : 0;
      const isBackNavigation = Date.now() - backNavTs < 3000;
      
      if (isBackNavigation && parsed?.page) {
        return parsed.page;
      }
    } catch (e) {}
    return initialPage;
  });

  const [restored, setRestored] = useState(false);
  const lastScrollY = useRef(0);
  const lastSaveTime = useRef(Date.now());

  useEffect(() => {
    const handleScroll = () => {
      // Only record genuine scrolled positions, ignore sudden resets to 0
      if (window.scrollY > 10) {
        lastScrollY.current = window.scrollY;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Safely perform the visual DOM scroll jumping in a standard useEffect
  useEffect(() => {
    if (typeof window !== 'undefined' && cacheKey) {
      const saved = sessionStorage.getItem(`infinite-scroll-${cacheKey}`);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          
          // Check cache expiration before restoring scroll
          if (!isCacheValid(parsed)) {
            sessionStorage.removeItem(`infinite-scroll-${cacheKey}`);
            setRestored(true);
            return;
          }
          
          const backNavTsRaw = sessionStorage.getItem('nav-back-timestamp');
          const backNavTs = backNavTsRaw ? Number.parseInt(backNavTsRaw, 10) : 0;
          const isBackNavigation = Date.now() - backNavTs < 3000;
          
          const currentFirstId = getFirstId(initialData);
          const cachedFirstId = getFirstId(parsed?.data || []);

          if (!isBackNavigation || (currentFirstId && cachedFirstId && currentFirstId !== cachedFirstId)) {
            sessionStorage.removeItem(`infinite-scroll-${cacheKey}`);
          } else if (parsed.scrollY > 0 && sessionStorage.getItem('nav-forward-click') !== 'true') {
            requestAnimationFrame(() => {
              window.scrollTo({ top: parsed.scrollY, behavior: 'instant' });
            });
          }
        } catch (e) {
          console.error('Failed to parse cached infinite scroll data', e);
        }
      }
    }
    setRestored(true);
  }, [cacheKey, initialData]); 

  // Save to cache with timestamp and debouncing
  useEffect(() => {
    if (!restored || typeof window === 'undefined' || !cacheKey || !Array.isArray(data)) {
      return;
    }

    // Debounce save to avoid excessive writes
    const saveTimeout = setTimeout(() => {
      const now = Date.now();
      
      // Only save if enough time has passed since last save (throttle)
      if (now - lastSaveTime.current < 1000 && data.length > 0) {
        return;
      }
      
      lastSaveTime.current = now;
      
      try {
        const activeY = window.scrollY > 10 ? window.scrollY : lastScrollY.current;
        
        sessionStorage.setItem(
          `infinite-scroll-${cacheKey}`, 
          JSON.stringify({ 
            data, 
            page,
            scrollY: activeY,
            timestamp: now // Add timestamp for expiration checking
          })
        );
      } catch (e) {
        console.error('Failed to save cache:', e);
        sessionStorage.removeItem(`infinite-scroll-${cacheKey}`);
      }
    }, 500); // Debounce 500ms
    
    return () => clearTimeout(saveTimeout);
  }, [data, page, restored, cacheKey]);

  // Optional: Clear cache function for manual invalidation
  const clearCache = useCallback(() => {
    if (typeof window !== 'undefined' && cacheKey) {
      sessionStorage.removeItem(`infinite-scroll-${cacheKey}`);
    }
  }, [cacheKey]);

  return { data, setData, page, setPage, clearCache };
}