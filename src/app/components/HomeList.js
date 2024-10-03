'use client'
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from "next/image";

function Newimg(props) {
    const newsimage= props.news;
    return ( (newsimage.file_name!=null)? <Image src={'/'+newsimage.file_name} alt="A portrait of me" width="600" height="362" loading="lazy"  /> : <div>No Image</div>);
  }

  export default function HomeList({ initialPosts }) {
    const [posts, setPosts] = useState(initialPosts);  // Initial posts loaded via SSR
    const [page, setPage] = useState(2);               // Start from page 2
    const [hasMore, setHasMore] = useState(true);      // Determine if there's more data to load
    const [isFetching, setIsFetching] = useState(false); // Prevent multiple fetches at once
    const observer = useRef(null);                     // Ref for IntersectionObserver
  
    // Function to fetch more posts
    const fetchMorePosts = async () => {
       
      if (isFetching) return;  // Prevent multiple calls

      setIsFetching(true);
  
      //console.log('Fetching page:', page);  // Debugging to ensure correct page is passed
  
      try {
        const res = await fetch(`/api/home?page=${page}&limit=10`);  // Fetch next page
        const data = await res.json();
  
        // Append new posts to the existing list
        setPosts((prevPosts) => [...prevPosts, ...data.posts]);
  
        // Check if there are more posts to load
        setHasMore(data.hasMore);
  
        // Increment the page number after successful fetch
        setPage((prevPage) => prevPage + 1);
        setIsFetching(false);
      } catch (error) {
        console.error('Error fetching more posts:', error);
      } finally {
        setIsFetching(false);  // Reset fetching state
      }
      //console.log('Fetching-l:', isFetching); 
    };
  
    useEffect(() => {
      if (!hasMore) return;  // Stop if no more posts to load
  
      const target = document.querySelector('#end-of-list');
  
      if (observer.current) observer.current.disconnect();  // Clean up previous observer
  
      observer.current = new IntersectionObserver(
        (entries) => {
          const [entry] = entries;
          if (entry.isIntersecting && !isFetching) {
            // Fetch more posts only when the target is visible and we're not already fetching
            fetchMorePosts();
          }
        },
        { root: null, rootMargin: '20px', threshold: 1.0 }
      );
  
      if (target) observer.current.observe(target);
  
      // Cleanup when component unmounts or page changes
      return () => {
        if (observer.current) observer.current.disconnect();
      };
    }, [page, hasMore]);  // Make sure to include `hasMore` and `page` as dependencies
  

  return (
    <div>
      {posts.map((post) => (
        <div key={post.id} className="news-item">
          
          <figure>
                    <Newimg news={post}/>
                    </figure>
                    <Link href={`/news/${post.url}`}>
                    <h3>   {post.title} </h3>
                    </Link>
        </div>
      ))}
      <div id="end-of-list">{hasMore ? 'Loading more...' : 'No more posts'}</div>
    </div>
  );
}
  