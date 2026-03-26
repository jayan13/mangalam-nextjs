'use client'
import { useState, useEffect, useLayoutEffect } from 'react';

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

export function useInfiniteScrollCache(cacheKey, initialData = [], initialPage = 1) {
  const [data, setData] = useState(initialData);
  const [page, setPage] = useState(initialPage);
  const [restored, setRestored] = useState(false);

  useIsomorphicLayoutEffect(() => {
    if (typeof window !== 'undefined' && cacheKey) {
      const saved = sessionStorage.getItem(`infinite-scroll-${cacheKey}`);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          const currentLength = Array.isArray(initialData) ? initialData.length : 0;
          const cachedLength = Array.isArray(parsed.data) ? parsed.data.length : 0;

          // Restore if cache has more data than what server provided.
          // This avoids replacing fresh SSR data with empty cache when landing directly on a page.
          if (cachedLength >= currentLength && cachedLength > 0) {
            setData(parsed.data);
            setPage(parsed.page || initialPage);
          }
        } catch (e) {
          console.error('Failed to parse cached infinite scroll data', e);
        }
      }
    }
    setRestored(true);
  }, [cacheKey]); 
  // Omitted initialData from deps on purpose to avoid re-triggering cache restore if unneeded.

  useIsomorphicLayoutEffect(() => {
    if (restored && typeof window !== 'undefined' && cacheKey) {
      sessionStorage.setItem(
        `infinite-scroll-${cacheKey}`, 
        JSON.stringify({ data, page })
      );
    }
  }, [data, page, restored, cacheKey]);

  return { data, setData, page, setPage };
}
