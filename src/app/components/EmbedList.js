'use client'
import { useState, useEffect, useRef } from 'react';
import Image from "next/image";

export default function EmbedList({ initialPosts, allids }) {
  const [posts, setPosts] = useState(initialPosts);
  const [page, setPage] = useState(2);
  const [hasMore, setHasMore] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
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

    const target = document.querySelector('#end-of-list');

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

  // Helper to detect and wrap YouTube URLs if not already iframed
  const renderContent = (content) => {
    if (!content || typeof content !== 'string') return null;
    
    // If it's already an iframe, just return it
    if (content.includes('<iframe')) {
      return <div className="embed-container" dangerouslySetInnerHTML={{ __html: content }} />;
    }

    // Check for YouTube Shorts
    if (content.includes('youtube.com/shorts/')) {
      const videoId = content.split('shorts/')[1].split(/[?& ]/)[0];
      return (
        <div className="embed-container shorts-embed">
          <iframe 
            src={`https://www.youtube.com/embed/${videoId}`} 
            title="YouTube Shorts"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen" 
            allowFullScreen
          ></iframe>
        </div>
      );
    }

    // Check for regular YouTube
    if (content.includes('youtube.com/watch?v=') || content.includes('youtu.be/')) {
      let videoId = '';
      if (content.includes('watch?v=')) {
        videoId = content.split('v=')[1].split(/[& ]/)[0];
      } else {
        videoId = content.split('be/')[1].split(/[?& ]/)[0];
      }
      return (
        <div className="embed-container">
          <iframe 
            src={`https://www.youtube.com/embed/${videoId}`} 
            title="YouTube Video"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen" 
            allowFullScreen
          ></iframe>
        </div>
      );
    }

    // Default: render as HTML
    return <div className="embed-container" dangerouslySetInnerHTML={{ __html: content }} />;
  };

  return (
    <div className='home-news-section-left embed-list-section'>
      {posts.map((postPage, pageIndex) => (
        postPage.map((news, index) => (
          <div key={`${pageIndex}-${index}`} className="mid-block embed-news-item">
            {renderContent(news.news_details)}
            <h2 className="embed-news-title">{news.title}</h2>
            <div className="advertisement">
              <div className="advertisement-text">Advertisement</div>
              <div className="ad"><Image src="/img/ads/728x90.jpeg" alt='adds' width={728} height={90} loading="lazy" /></div>
            </div>
          </div>
        ))
      ))}

      <div id="end-of-list">{hasMore ? 'Loading more...' : ''}</div>

      <style jsx>{`
        .embed-list-section {
          max-width: 1000px;
          margin: 0 auto;
        }
        .embed-news-item {
          background: #fff;
          margin-bottom: 40px;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        .embed-news-title {
          font-size: 1.8rem;
          margin-top: 15px;
          margin-bottom: 20px;
          color: #333;
          line-height: 1.3;
        }
        .embed-container {
          position: relative;
          width: 100%;
          padding-bottom: 56.25%; /* 16:9 Aspect Ratio */
          height: 0;
          overflow: hidden;
          margin-bottom: 20px;
          background: #000;
          border-radius: 4px;
        }
        .embed-container iframe {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          border: 0;
        }
        .shorts-embed {
          padding-bottom: 177.77%; /* 9:16 Aspect Ratio for Shorts */
          max-width: 350px;
          margin: 0 auto 20px auto;
        }
      `}</style>
    </div>
  );
}
