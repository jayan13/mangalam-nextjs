'use client'
import { useState, useEffect, useRef, useCallback } from 'react';

const CACHE_DURATION = 6 * 60 * 1000; // 6 minutes in milliseconds

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
  // Initialize cleanly with initialData to prevent hydration errors from SSR mismatch.
  const [data, setData] = useState(initialData);
  const [page, setPage] = useState(initialPage);

  const [restored, setRestored] = useState(false);
  const lastScrollY = useRef(0);
  const lastSaveTime = useRef(Date.now());

  const scrollTimeoutRef = useRef(null);
  const restoredKeyRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      // Only record genuine scrolled positions, ignore sudden resets to 0
      if (window.scrollY > 10) {
        lastScrollY.current = window.scrollY;

        if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
        scrollTimeoutRef.current = setTimeout(() => {
          if (typeof window !== 'undefined' && cacheKey) {
            try {
              const saved = sessionStorage.getItem(`infinite-scroll-${cacheKey}`);
              if (saved) {
                const parsed = JSON.parse(saved);
                parsed.scrollY = lastScrollY.current;
                parsed.timestamp = Date.now(); // Refresh expiry on interaction
                sessionStorage.setItem(`infinite-scroll-${cacheKey}`, JSON.stringify(parsed));
              }
            } catch (e) { }
          }
        }, 300);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    };
  }, [cacheKey]);

  // Safely restore data and perform the visual DOM scroll jumping in a standard useEffect
  useEffect(() => {
    // Only execute if we have a valid cache key and we haven't already restored this exact key
    if (!cacheKey || restoredKeyRef.current === cacheKey) return;

    if (typeof window !== 'undefined') {
      const saved = sessionStorage.getItem(`infinite-scroll-${cacheKey}`);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);

          // Check cache expiration before restoring
          if (!isCacheValid(parsed)) {
            sessionStorage.removeItem(`infinite-scroll-${cacheKey}`);
            setRestored(true);
            return;
          }

          // Restore data and page safely on the client after hydration
          const cachedLength = Array.isArray(parsed?.data) ? parsed.data.length : 0;
          const currentLength = Array.isArray(initialData) ? initialData.length : 0;

          if (cachedLength > 0 && cachedLength >= currentLength) {
            // Mark as restored BEFORE setting state to strictly prevent re-render loops
            restoredKeyRef.current = cacheKey;

            setData(parsed.data);
            if (parsed.page) {
              setPage(parsed.page);
            }
          } else {
            // Even if we don't restore data, mark this key as checked to prevent loop
            restoredKeyRef.current = cacheKey;
          }

          const backNavTsRaw = sessionStorage.getItem('nav-back-timestamp');
          const backNavTs = backNavTsRaw ? Number.parseInt(backNavTsRaw, 10) : 0;
          const isBackNavigation = Date.now() - backNavTs < 3000;

          // Scroll restoration should only happen on back navigation
          if (isBackNavigation) {
            if (parsed.scrollY > 0 && sessionStorage.getItem('nav-forward-click') !== 'true') {
              // Wait for React to apply the data we just set before scrolling
              setTimeout(() => {
                requestAnimationFrame(() => {
                  window.scrollTo({ top: parsed.scrollY, behavior: 'instant' });
                });
              }, 15);
            }
            // Signal list is ready for ScrollRestoration.js
            setTimeout(() => {
              try {
                sessionStorage.setItem('list-ready', JSON.stringify({ ts: Date.now() }));
                window.dispatchEvent(new Event('list-ready'));
              } catch (e) { }
            }, 50);
          } else {
            // For forward navigations, we just use the cached data but don't jump scroll Y.
            setTimeout(() => {
              try {
                window.dispatchEvent(new Event('list-ready'));
              } catch (e) { }
            }, 50);
          }
        } catch (e) {
          console.error('Failed to parse cached infinite scroll data', e);
          restoredKeyRef.current = cacheKey; // Mark checked on fail
        }
      } else {
        // No cache found, mark checked
        restoredKeyRef.current = cacheKey;
      }
    }
    setRestored(true);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cacheKey]);

  // Safely sync server prop updates if cache didn't already override them
  useEffect(() => {
    if (restored || typeof window === 'undefined' || !initialData || !Array.isArray(initialData)) return;

    // Only update if server provided new data that is larger than current data, 
    // and we aren't currently holding a massive cached list
    if (initialData.length > 0 && Array.isArray(data) && data.length < initialData.length) {
      setData((prev) => (prev.length < initialData.length ? initialData : prev));
    }
  }, [initialData, restored, data.length]);

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