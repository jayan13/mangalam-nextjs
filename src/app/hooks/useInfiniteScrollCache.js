'use client'
import { useState, useEffect, useRef, useCallback } from 'react';

const CACHE_DURATION = 6 * 60 * 1000; // 6 minutes in milliseconds


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
      let parsed = null;
      if (saved) {
        try {
          parsed = JSON.parse(saved);
        } catch (e) {
          console.error('Failed to parse cached infinite scroll data', e);
        }
      }

      if (parsed) {
        // Check cache expiration before restoring
        if (!isCacheValid(parsed)) {
          sessionStorage.removeItem(`infinite-scroll-${cacheKey}`);
          setRestored(true);
          return;
        }

        const isBackNavigation = sessionStorage.getItem('nav:back:flag') === '1';

        const cachedLength = Array.isArray(parsed?.data) ? parsed.data.length : 0;
        const currentLength = Array.isArray(initialData) ? initialData.length : 0;

        // Restore cached data if we have it, keeping the user on their cached session until it hits the 6-min expiry
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
      } else {
        // No cache found, mark checked
        restoredKeyRef.current = cacheKey;
        // Also signal list ready if we are starting fresh
        setTimeout(() => { window.dispatchEvent(new Event('list-ready')); }, 50);
      }
    }
    setRestored(true);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cacheKey]);

  // Safely sync server prop updates if cache didn't already override them
  useEffect(() => {
    if (!restored || typeof window === 'undefined' || !initialData || !Array.isArray(initialData)) return;

    // React to fresh server payload updates (like Next.js background revalidations)
    // If the new initialData differs from the matching segment of our current data, update it!
    const currentDataSegment = Array.isArray(data) ? data.slice(0, initialData.length) : [];
    const isDataStale = JSON.stringify(currentDataSegment) !== JSON.stringify(initialData);

    if (isDataStale) {
      // The server has definitively provided new core data (e.g. background invalidation hit after 6 min).
      // Since the db records mathematically shifted, preserving any deeply scrolled pages would just result 
      // in duplicated articles anyway. We MUST immediately drop the cache and respect the server's fresh Page 1!
      setData(initialData);
      setPage(initialPage);
      sessionStorage.removeItem(`infinite-scroll-${cacheKey}`);
    } else if (initialData.length > 0 && Array.isArray(data) && data.length < initialData.length) {
      // General length expansion
      setData((prev) => (prev.length < initialData.length ? initialData : prev));
    }
  }, [initialData, restored, data, initialPage, cacheKey]);

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

        // Preserve original timestamp so it strictly expires after 6 mins
        let originalTs = now;
        try {
          const existing = sessionStorage.getItem(`infinite-scroll-${cacheKey}`);
          if (existing) {
            const parsed = JSON.parse(existing);
            if (parsed.timestamp) originalTs = parsed.timestamp;
          }
        } catch (e) {}

        sessionStorage.setItem(
          `infinite-scroll-${cacheKey}`,
          JSON.stringify({
            data,
            page,
            scrollY: activeY,
            timestamp: originalTs
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