'use client'
import { useState, useEffect } from 'react';

function getFirstId(arr) {
  if (!Array.isArray(arr) || arr.length === 0) return null;
  const first = arr[0];
  if (Array.isArray(first)) {
    return first[0]?.id || null;
  }
  return first?.id || null;
}

function isReload() {
  if (typeof window === 'undefined') return false;
  const nav = performance.getEntriesByType('navigation')[0];
  return nav?.type === 'reload';
}

export function useInfiniteScrollCache(cacheKey, initialData = [], initialPage = 1) {
  const [data, setData] = useState(() => {
    if (typeof window !== 'undefined' && cacheKey) {
      if (isReload()) {
        sessionStorage.removeItem(`infinite-scroll-${cacheKey}`);
        return initialData;
      }
      const saved = sessionStorage.getItem(`infinite-scroll-${cacheKey}`);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          const currentLength = Array.isArray(initialData) ? initialData.length : 0;
          const cachedLength = Array.isArray(parsed?.data) ? parsed.data.length : 0;
          const currentFirstId = getFirstId(initialData);
          const cachedFirstId = getFirstId(parsed?.data || []);

          if (currentFirstId && cachedFirstId && currentFirstId !== cachedFirstId) {
            sessionStorage.removeItem(`infinite-scroll-${cacheKey}`);
          } else if (cachedLength >= currentLength && cachedLength > 0) {
            return parsed.data;
          }
        } catch (e) {
          console.error('Failed to parse cached infinite scroll data', e);
        }
      }
    }
    return initialData;
  });

  const [page, setPage] = useState(() => {
    if (typeof window !== 'undefined' && cacheKey) {
      if (isReload()) return initialPage;
      const saved = sessionStorage.getItem(`infinite-scroll-${cacheKey}`);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          const currentLength = Array.isArray(initialData) ? initialData.length : 0;
          const cachedLength = Array.isArray(parsed?.data) ? parsed.data.length : 0;
          const currentFirstId = getFirstId(initialData);
          const cachedFirstId = getFirstId(parsed?.data || []);

          if (currentFirstId && cachedFirstId && currentFirstId !== cachedFirstId) {
            // Already handled
          } else if (cachedLength >= currentLength && cachedLength > 0) {
            return parsed.page || initialPage;
          }
        } catch (e) {
          console.error('Failed to parse cached infinite scroll page', e);
        }
      }
    }
    return initialPage;
  });

  useEffect(() => {
    if (typeof window !== 'undefined' && cacheKey && Array.isArray(data)) {
      try {
        sessionStorage.setItem(
          `infinite-scroll-${cacheKey}`,
          JSON.stringify({ data, page })
        );
      } catch (e) {
        console.error('Failed to stringify infinite scroll data, possibly array too large.', e);
        sessionStorage.removeItem(`infinite-scroll-${cacheKey}`);
      }
    }
  }, [data, page, cacheKey]);

  return { data, setData, page, setPage };
}