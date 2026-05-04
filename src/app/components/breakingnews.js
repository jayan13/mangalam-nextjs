'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';

function resolveImageUrl(image) {
  if (!image) return null;
  if (image.startsWith('http://') || image.startsWith('https://')) return image;
  const base = process.env.NEXT_PUBLIC_IMAGE_URL || '';
  if (!base) return image;
  return `${base.replace(/\/+$/, '')}/${image.replace(/^\/+/, '')}`;
}

export default function BreakingNewsBlock({
  className = '',
  label = 'BREAKING',
}) {
  const [item, setItem] = useState(null);
  const [hasError, setHasError] = useState(false);

  const apiUrl = useMemo(() => {
    const params = new URLSearchParams();
    params.set('limit', '1');
    return `/api/breaking-news?${params.toString()}`;
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setHasError(false);
        const res = await fetch(apiUrl, { cache: 'no-store' });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        const rows = Array.isArray(json?.data) ? json.data : [];
        if (!cancelled) setItem(rows[0] || null);
      } catch (error) {
        console.error('Failed to load breaking news:', error);
        if (!cancelled) {
          setItem(null);
          setHasError(true);
        }
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [apiUrl]);

  const title = item?.title || '';
  const imgSrc = resolveImageUrl(item?.image);

  if (!item || item?.published !== 1) return null;
  if (!imgSrc && !title) return null;

  const href = item?.target_url || '#';

  return (
    <section
      className={['breaking-news', className].filter(Boolean).join(' ')}
      aria-label="Breaking news"
    >
      <Link href={href} className="breaking-news__link" prefetch={false}>        
        {imgSrc ? (
          <span className="breaking-news__banner" data-error={hasError ? '1' : '0'}>
            <Image
              src={imgSrc}
              alt={title}
              width={1285}
              height={180}
              sizes="(max-width: 1285px) 100vw, 1285px"
              style={{ width: '100%', height: 'auto' }}
              loading="lazy"
              onError={() => setHasError(true)}
              unoptimized={imgSrc.includes('mangalam.cms')}
            />
          </span>
        ) : (
          <span className="breaking-news__text" data-error={hasError ? '1' : '0'}>            
            {title}
          </span>
        )}
      </Link>
    </section>
  );
}
