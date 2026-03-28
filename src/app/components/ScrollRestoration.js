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

function restoreWithLimitedAttempts(targetY, tokenRef, restoringRef, onDone) {
  if (!targetY || targetY <= 0) return;
  const token = tokenRef?.current;
  if (restoringRef) restoringRef.current = true;
  let attempts = 0;
  const maxAttempts = 3;
  const step = () => {
    if (tokenRef && tokenRef.current !== token) {
      if (restoringRef) restoringRef.current = false;
      if (onDone) onDone();
      return;
    }
    const maxY = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
    if (targetY <= maxY || attempts === maxAttempts - 1) {
      window.scrollTo(0, Math.min(targetY, maxY));
      if (restoringRef) restoringRef.current = false;
      if (onDone) onDone();
      return;
    }
    attempts += 1;
    window.setTimeout(step, 300);
  };
  window.requestAnimationFrame(step);
}

export default function ScrollRestoration() {
  const pathname = usePathname();
  const pendingRestoreRef = useRef(null);
  const saveTimerRef = useRef(null);
  const restoredKeyRef = useRef(null);
  const restoreTokenRef = useRef(0);
  const restoringRef = useRef(false);
  const restoreLockRef = useRef(0);
  const restoreUnlockModeRef = useRef('time');

  const lockForBack = () => {
    restoreLockRef.current = Date.now() + 6000;
    restoreUnlockModeRef.current = 'home-ready';
  };

  const unlockRestoreLock = () => {
    restoreLockRef.current = 0;
    restoreUnlockModeRef.current = 'time';
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem('debug:scroll', '1');
    } catch {
      // ignore storage failures
    }
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    try {
      const nav = performance.getEntriesByType('navigation')[0];
      if (nav?.type === 'reload') {
        const key = buildKeyFromLocation();
        sessionStorage.removeItem(`scroll:${key}`);
      }
    } catch {
      // ignore failures
    }

    const onPopState = () => {
      const key = buildKeyFromLocation();
      lockForBack();
      try {
        sessionStorage.setItem('nav:back:flag', '1');
      } catch {
        // ignore storage failures
      }
      try {
        sessionStorage.setItem('nav:back:path', window.location.pathname || '');
        sessionStorage.setItem('nav:back:ts', String(Date.now()));
      } catch {
        // ignore storage failures
      }
      const storageKey = `scroll:${key}`;
      const raw = sessionStorage.getItem(storageKey);
      const parsed = raw ? Number.parseInt(raw, 10) : 0;
      const targetY = Number.isNaN(parsed) ? 0 : parsed;
      if (targetY > 0) {
        pendingRestoreRef.current = { key, targetY };
      } else {
        pendingRestoreRef.current = null;
      }
    };

    const onPageShow = (e) => {
      const nav = performance.getEntriesByType('navigation')[0];
      const isBack = e?.persisted || nav?.type === 'back_forward';
      if (!isBack) return;
      const key = buildKeyFromLocation();
      lockForBack();
      try {
        sessionStorage.setItem('nav:back:flag', '1');
      } catch {
        // ignore storage failures
      }
      try {
        const storageKey = `scroll:${key}`;
        const raw = sessionStorage.getItem(storageKey);
        const parsed = raw ? Number.parseInt(raw, 10) : 0;
        const targetY = Number.isNaN(parsed) ? 0 : parsed;
        if (targetY > 0) {
          pendingRestoreRef.current = { key, targetY };
        } else {
          pendingRestoreRef.current = null;
        }
      } catch {
        // ignore
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

    const canSave = (keyToSave) => {
      if (restoreLockRef.current && Date.now() < restoreLockRef.current) return false;
      const pending = pendingRestoreRef.current;
      if (pending && pending.key === keyToSave) {
        return false;
      }
      return true;
    };

    const saveScroll = () => {
      try {
        const currentKey = buildKeyFromLocation();
        if (!canSave(currentKey)) return;
        const currentY = getScrollY();
        if (currentY <= 0) {
          const existing = sessionStorage.getItem(`scroll:${currentKey}`);
          const existingNum = existing ? Number.parseInt(existing, 10) : 0;
          if (existingNum > 0) return;
        }
        sessionStorage.setItem(`scroll:${currentKey}`, String(currentY));
      } catch {
        // ignore storage failures
      }
    };

    const onScroll = () => {
      if (restoreLockRef.current && Date.now() >= restoreLockRef.current && !restoringRef.current) {
        unlockRestoreLock();
      }
      restoreTokenRef.current += 1;
      if (restoringRef.current) {
        restoringRef.current = false;
      }
      if (saveTimerRef.current) {
        window.clearTimeout(saveTimerRef.current);
      }
      saveTimerRef.current = window.setTimeout(saveScroll, 120);
    };

    const onPageHide = () => {
      saveScroll();
    };

    const onLinkClick = (e) => {
      const target = e.target.closest('a');
      if (!target) return;
      const href = target.getAttribute('href');
      if (!href || href.startsWith('#') || target.getAttribute('target') === '_blank') return;
      try {
        const targetUrl = new URL(target.href);
        const currentUrl = new URL(window.location.href);
        if (targetUrl.hostname !== currentUrl.hostname) return;
      } catch {
        return;
      }
      saveScroll();
    };

    const onHomeListReady = () => {
      if (restoreUnlockModeRef.current === 'home-ready') {
        unlockRestoreLock();
      }
      let debug = true;
      try {
        debug = localStorage.getItem('debug:scroll') === '1';
      } catch {
        debug = false;
      }
      if (debug) {
        console.log('[home:list-ready] received');
      }
      const currentKey = buildKeyFromLocation();
      if (restoredKeyRef.current === currentKey) return;

      let targetY = 0;
      const pending = pendingRestoreRef.current;
      if (pending && pending.key === currentKey) {
        targetY = pending.targetY;
        pendingRestoreRef.current = null;
      } else {
        try {
          const raw = sessionStorage.getItem(`scroll:${currentKey}`);
          const parsed = raw ? Number.parseInt(raw, 10) : 0;
          targetY = Number.isNaN(parsed) ? 0 : parsed;
        } catch {
          targetY = 0;
        }
      }

      let isBack = false;
      try {
        isBack = sessionStorage.getItem('nav:back:flag') === '1';
      } catch {
        isBack = false;
      }

      if (isBack && targetY > 0) {
        restoreTokenRef.current += 1;
        restoreWithLimitedAttempts(targetY, restoreTokenRef, restoringRef);
        restoredKeyRef.current = currentKey;
        unlockRestoreLock();
        try {
          sessionStorage.removeItem('nav:back:flag');
        } catch {
          // ignore storage failures
        }
      } else if (isBack) {
        unlockRestoreLock();
        try {
          sessionStorage.removeItem('nav:back:flag');
        } catch {
          // ignore storage failures
        }
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('pagehide', onPageHide);
    document.addEventListener('click', onLinkClick, true);

    if (pathname === '/') {
      window.addEventListener('home:list-ready', onHomeListReady);
    }

    const pending = pendingRestoreRef.current;
    const currentKey = buildKeyFromLocation();

    if (pending && pending.key === currentKey) {
      if (pathname !== '/') {
        restoreTokenRef.current += 1;
        restoreWithLimitedAttempts(pending.targetY, restoreTokenRef, restoringRef);
        restoredKeyRef.current = currentKey;
        pendingRestoreRef.current = null;
        unlockRestoreLock();
      } else {
        try {
          const rawReady = sessionStorage.getItem('home:list-ready');
          if (rawReady) {
            const parsedReady = JSON.parse(rawReady);
            if (parsedReady && Date.now() - parsedReady.ts < 15000) {
              restoreTokenRef.current += 1;
              restoreWithLimitedAttempts(pending.targetY, restoreTokenRef, restoringRef);
              restoredKeyRef.current = currentKey;
              pendingRestoreRef.current = null;
              unlockRestoreLock();
            }
          }
        } catch {
          // ignore parse/storage errors
        }
      }
    }

    // Avoid overwriting a pending back/restore value with 0 on first paint
    saveScroll();

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('pagehide', onPageHide);
      document.removeEventListener('click', onLinkClick, true);
      if (pathname === '/') {
        window.removeEventListener('home:list-ready', onHomeListReady);
      }
      if (saveTimerRef.current) {
        window.clearTimeout(saveTimerRef.current);
        saveTimerRef.current = null;
      }
      saveScroll();
    };
  }, [pathname]);

  return null;
}
