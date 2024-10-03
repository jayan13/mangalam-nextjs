// components/InfiniteScroll.js
'use client'
import { useState, useEffect, useRef } from 'react';

const InfiniteScroll = () => {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef();

  const loadMore = async () => {
    const res = await fetch(`/api/home?page=${page}&limit=10`);
    const data = await res.json();
    setPosts((prevPosts) => [...prevPosts, ...data.posts]);
    setHasMore(data.hasMore);
  };

  useEffect(() => {
    loadMore();
  }, [page]);

  useEffect(() => {
    if (!hasMore) return;
    const handleObserver = (entries) => {
      const target = entries[0];
      if (target.isIntersecting) {
        setPage((prev) => prev + 1);
      }
    };

    const options = {
      root: null,
      rootMargin: '20px',
      threshold: 0,
    };

    observer.current = new IntersectionObserver(handleObserver, options);
    const target = document.querySelector('#end-of-list');
    if (target) observer.current.observe(target);

    return () => observer.current.disconnect();
  }, [hasMore]);

  return (
    <div>
      {posts.map((post, index) => (
        <div key={index}>
          <h2>{index}-{post.title}</h2>
          <p>{post.news_details}</p>
        </div>
      ))}
      <div id="end-of-list">
        {hasMore ? <p>Loading more...</p> : <p>No more posts to load</p>}
      </div>
    </div>
  );
};

export default InfiniteScroll;
