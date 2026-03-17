'use client'
import { useState, useEffect, useRef } from 'react';
import Image from "next/image";

export default function ShortsList({ initialPosts, allids }) {
  const [posts, setPosts] = useState(initialPosts);
  const [page, setPage] = useState(2);
  const [hasMore, setHasMore] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const [activeVideoId, setActiveVideoId] = useState(null);
  const observer = useRef(null);

  const fetchMorePosts = async () => {
    if (!allids || allids === 'undefined' || (Array.isArray(allids) && allids.length === 0)) {
      setIsFetching(false);
      return;
    }

    setIsFetching(true);

    try {
      const catid = Array.isArray(allids) ? allids.join(',') : allids;
      const res = await fetch(`/api/embeds?page=${page}&limit=8&category=${catid}`, { next: { revalidate: 360 } });
      const data = await res.json();

      if (data.distnewslist) {
        setPosts((prevPosts) => [...prevPosts, ...data.distnewslist]);
        setHasMore(data.hasMore);
        setPage((prevPage) => prevPage + 1);
      }
    } catch (error) {
      console.error('Error fetching more posts:', error);
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    if (!hasMore) return;

    const target = document.querySelector('#end-of-list-shorts');

    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !isFetching) {
          fetchMorePosts();
        }
      },
      { root: null, rootMargin: '20px', threshold: 1.0 }
    );

    if (target) observer.current.observe(target);

    return () => {
      if (observer.current) observer.current.disconnect();
    };
  }, [page, hasMore]);

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (activeVideoId) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [activeVideoId]);

  const extractVideoId = (content) => {
    if (!content || typeof content !== 'string') return null;
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?|shorts)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i;
    const match = content.match(regex);
    return match ? match[1] : null;
  };

  const renderContent = (content, title) => {
    const videoId = extractVideoId(content);
    if (videoId) {
      const isShort = true; // Everything in Shorts category should play as a short
      return (
        <div
          className="embed-container thumbnail-container shorts-embed"
          onClick={() => setActiveVideoId({ id: videoId, isShort })}
        >
          <Image
            src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`}
            alt={`Thumbnail for ${title}`}
            loading="lazy"
            width={480}
            height={360}
            className="youtube-thumbnail"
            onError={(e) => { e.target.onerror = null; e.target.src = `https://img.youtube.com/vi/${videoId}/default.jpg`; }}
          />
          <div className="play-button-overlay">
            <svg viewBox="0 0 68 48" width="100%" height="100%">
              <path className="ytp-large-play-button-bg" d="M66.52,7.74c-0.78-2.93-2.49-5.41-5.42-6.19C55.79,.13,34,0,34,0S12.21,.13,6.9,1.55 C3.97,2.33,2.27,4.81,1.48,7.74C0.06,13.05,0,24,0,24s0.06,10.95,1.48,16.26c0.78,2.93,2.49,5.41,5.42,6.19 C12.21,47.87,34,48,34,48s21.79-0.13,27.1-1.55c2.93-0.78,4.64-3.26,5.42-6.19C67.94,34.95,68,24,68,24S67.94,13.05,66.52,7.74z" fill="#212121" fillOpacity="0.8"></path>
              <path d="M 45,24 27,14 27,34" fill="#fff"></path>
            </svg>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className='shorts-list-section'>
      {posts.map((postPage, pageIndex) => (
        postPage.map((news, index) => (
          <div key={`${pageIndex}-${index}`} className="shorts-news-item">
            {renderContent(news.news_details, news.title)}
            <h2 className="shorts-news-title">{news.title}</h2>
          </div>
        ))
      ))}

      <div id="end-of-list-shorts" className="loading-indicator">{hasMore ? <Image src="/img/icons/loading-indicator.gif" alt="Loading..." width={30} height={30} unoptimized={true}/> : ''}</div>

      {activeVideoId && (
        <div className="video-modal-overlay" onClick={() => setActiveVideoId(null)}>
          <div className={`video-modal-content ${activeVideoId.isShort ? 'shorts-modal' : ''}`} onClick={(e) => e.stopPropagation()}>
            <button className="video-modal-close" onClick={() => setActiveVideoId(null)}>×</button>
            <iframe
              src={`https://www.youtube.com/embed/${activeVideoId.id}?autoplay=1`}
              title="YouTube Shorts"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      )}

    </div>
  );
}
