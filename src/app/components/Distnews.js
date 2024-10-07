'use client'
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from "next/image";


function Newimg(props) {
    const newsimage= props.news;
    const w=props.width;
    const h=props.height;
    return ( (newsimage.file_name!=null)? <Image src={'/'+newsimage.file_name} alt={newsimage.alt} width={w} height={h} loading="lazy"  /> : <div>No Image</div>);
  }

  function Blocks(props){
    const ndata= props.ndt;
    return (
      <div className="news-item">
              <figure> <Newimg news={ndata} width='213' height='128'/></figure>
              <div className="news-item-text">
                <h3>
                    <Link href={`/news/${ndata.url}`}> {ndata.title}</Link>
                </h3>
      
              </div>
      </div>
    );
  }

function Homenew(props){
  const post= props.newslist;
  const pageno=props.pag;
  console.log('page='+pageno);
  //if (pageno==2)
 // {
    return (
      <div className='category-bottom-list'>
        {post.map((news, index) => (
            <Blocks ndt={news} ind={index}/>
             ))} 
      </div>
    );
  //}

}
  export default function Distnews({ initialPosts, district_id }) {
    const [posts, setPosts] = useState(initialPosts);  // Initial posts loaded via SSR
    const [page, setPage] = useState(2);               // Start from page 2
    const [hasMore, setHasMore] = useState(true);      // Determine if there's more data to load
    const [isFetching, setIsFetching] = useState(false); // Prevent multiple fetches at once
    const observer = useRef(null); // Ref for IntersectionObserver
  
    // Function to fetch more posts
    const fetchMorePosts = async () => {
       
      if (isFetching) return;  // Prevent multiple calls

      setIsFetching(true);
  
      //console.log('Fetching page:', district);  // Debugging to ensure correct page is passed
  
      try {
        //const distid=posts[0][0].district_id;
        const distid=district_id;
        const res = await fetch(`/api/district?page=${page}&limit=8&district=${distid}`);  // Fetch next page
        const data = await res.json();
  
        // Append new posts to the existing list
        setPosts((prevPosts) => [...prevPosts, ...data.distnewslist]);
  
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
    <div className='home-news-section-left'>
      {posts.map((post, index) => (
       <div key={index} className='mid-block'>
        <Homenew newslist={post} pag={page}/>
        <div className="advertisement">
          <div className="advertisement-text">Advertisement</div>
          <div className="ad"><Image src="/img/ads/728x90.jpeg" alt='adds' width={728} height={90} loading="lazy" /></div>
        </div>
       </div>
      ))}
      
      <div id="end-of-list">{hasMore ? 'Loading more...' : 'No more News'}</div>
    </div>
  );
}
  