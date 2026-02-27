// components/InfiniteScroll.js
'use client'
import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import Image from "next/image";
import GoogleAdPcItem from "../adds/Addsright";

function NewsImage({ news, width, height, className = '' }) {
  const src = `${process.env.NEXT_PUBLIC_IMAGE_URL}/${news.file_name}`;
  const [imageSrc, setImageSrc] = useState(src);

  if (!news.file_name) {
    return (
      <Image
        src="/uploads/noimg.svg"
        alt="no image available"
        width={width}
        height={height}
        className={className}
        loading="lazy"
      />
    );
  }

  return (
    <Image
      src={imageSrc}
      alt={news.alt || "news image"}
      width={width}
      height={height}
      className={className}
      loading="lazy"
      onError={() => setImageSrc("/uploads/noimg.svg")}
      unoptimized={process.env.NEXT_PUBLIC_IMAGE_URL.includes('mangalam.cms')}
    />
  );
}

function NewsItem({ news, isMain = false }) {
  const url = news.url ? `/news/${news.url}` : '#';
  const imgMark = news.template === 'premium' ? <div className="premium-tag">PREMIUM</div> :
    news.template === 'pic' ? <div className="pic-tag">5</div> :
      news.template === 'video' ? <div className="video-tag">Play</div> : null;

  return (
    <div className={`news-item ${isMain ? 'right-main-news' : ''}`}>
      <figure>
        {imgMark}
        {news.url ? (
          <Link href={url}>
            <NewsImage news={news} width={isMain ? 308 : 88} height={isMain ? 185 : 54} className={!isMain ? 'news-image' : ''} />
          </Link>
        ) : (
          <NewsImage news={news} width={isMain ? 308 : 88} height={isMain ? 185 : 54} className={!isMain ? 'news-image' : ''} />
        )}
      </figure>
      <div className="news-item-text">
        <h3>
          {news.url ? <Link href={url}>{news.title}</Link> : news.title}
        </h3>
      </div>
    </div>
  );
}

function NewsSection({ posts }) {
  if (!posts || posts.length === 0) return null;

  const firstPost = posts[0];
  const template = firstPost?.template;
  const isPremium = template === 'premium';

  const topClass = isPremium ? 'mangalam-special' : 'news-in-pics';
  const hedColor = (isPremium || template === 'pic' || template === 'video') ? 'section-heading-red' : 'section-heading-blue';
  const heading = firstPost?.heading || '';

  return (
    <div className={`right-news-section ${topClass}`}>
      <div className={`section-heading ${hedColor}`}>{heading}</div>
      <NewsItem news={firstPost} isMain={true} />
      <div className="right-news-bottom">
        {posts.slice(1, 5).map((post) => (
          <NewsItem key={post.id} news={post} />
        ))}
      </div>
    </div>
  );
}

export default function InfiniteScroll() {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const observer = useRef();

  const loadMore = useCallback(async () => {
    if (isFetching || !hasMore) return;

    setIsFetching(true);
    try {
      const revalidateTime = process.env.QUERY_REVALIDATE || '360';
      const res = await fetch(`/api/right?page=${page}&limit=5`, {
        next: { revalidate: parseInt(revalidateTime) }
      });
      const data = await res.json();

      if (data.newslist && data.newslist.length > 0) {
        setPosts((prev) => [...prev, ...data.newslist]);
        setHasMore(data.hasMore);
        setPage((prev) => prev + 1);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error('Error loading more posts:', error);
    } finally {
      setIsFetching(false);
    }
  }, [page, isFetching, hasMore]);

  useEffect(() => {
    const currentObserver = observer.current;
    if (currentObserver) currentObserver.disconnect();

    observer.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isFetching && hasMore) {
          loadMore();
        }
      },
      { root: null, rootMargin: '100px', threshold: 0.1 }
    );

    const target = document.querySelector('#end-of-list-right');
    if (target) observer.current.observe(target);

    return () => {
      if (observer.current) observer.current.disconnect();
    };
  }, [loadMore, isFetching, hasMore]);

  return (
    <div className="home-news-section-right no-printme">
      {posts.map((postGroup, index) => (
        <div key={index} className='rght-block'>
          <GoogleAdPcItem adId={index} />
          <NewsSection posts={postGroup} />
        </div>
      ))}
      <div id="end-of-list-right" style={{ minHeight: '1px' }}>
        {hasMore && <p>Loading more...</p>}
      </div>
    </div>
  );
}
