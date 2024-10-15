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
    //const indx= props.ind;
    return (
      <div className="news-item" >
              <figure> <Link href={`/news/${ndata.url}`}><Newimg news={ndata} width='213' height='128'/></Link></figure>
              <div className="news-item-text">
                <h3>
                    <Link href={`/news/${ndata.url}`}> {ndata.title}</Link>
                </h3>
      
              </div>
      </div>
    );
  }


  function Blockstop(props){
    const ndata= props.ndt;
    let rcnt0='';
    let rcnt1='';
    let rcnt2='';
    let rcnt3='';
    let rcnt4='';
    let rcnt5='';
    let rcnt6='';
    let i=0;
   // {post.map((news, index) => (
    //  <Blockstop ndt={post} />
    //   ))} 
    for (let nws in Object.keys(ndata)) {
      if(i==0)
        {
          rcnt0=<div className="news-item">
          <figure> <Link href={`/news/${ndata[nws].url}`}><Newimg news={ndata[nws]} width='500' height='300'/></Link></figure>
          <div className="news-item-text">
            <h1>
                <Link href={`/news/${ndata[nws].url}`}> {ndata[nws].title}</Link>
            </h1>
            <p>{ndata[nws].news_details}</p>
          </div>
          </div>;
        }
        if(i==1)
        {
          rcnt1=<div className="news-item">
            <h3><Link href={`/news/${ndata[nws].url}`}> {ndata[nws].title}</Link>  </h3>
              <figure><Link href={`/news/${ndata[nws].url}`}><Newimg news={ndata[nws]} width='88' height='54'/></Link> </figure>
            </div>;
        }
        if(i==2)
          {
            rcnt2=<div className="news-item">
              <h3><Link href={`/news/${ndata[nws].url}`}> {ndata[nws].title}</Link>  </h3>
                <figure><Link href={`/news/${ndata[nws].url}`}><Newimg news={ndata[nws]} width='88' height='54'/></Link>  </figure>
              </div>;
          }
          if(i==3)
            {
              rcnt3=<div className="news-item">
                <h3><Link href={`/news/${ndata[nws].url}`}> {ndata[nws].title}</Link>  </h3>
                  <figure><Link href={`/news/${ndata[nws].url}`}><Newimg news={ndata[nws]} width='88' height='54'/></Link> </figure>
                </div>;
            }
            if(i==4)
              {
                rcnt4=<div className="news-item">
                  <h3><Link href={`/news/${ndata[nws].url}`}> {ndata[nws].title}</Link>  </h3>
                    <figure><Link href={`/news/${ndata[nws].url}`}><Newimg news={ndata[nws]} width='88' height='54'/></Link> </figure>
                  </div>;
              }
              if(i==5)
                {
                  rcnt5=<div className="news-item">
                    <h3><Link href={`/news/${ndata[nws].url}`}> {ndata[nws].title}</Link>  </h3>
                      <figure><Link href={`/news/${ndata[nws].url}`}><Newimg news={ndata[nws]} width='88' height='54'/></Link> </figure>
                    </div>;
                }
                if(i==6)
                  {
                    rcnt6=<div className="news-item">
                      <h3><Link href={`/news/${ndata[nws].url}`}> {ndata[nws].title}</Link>  </h3>
                        <figure><Link href={`/news/${ndata[nws].url}`}><Newimg news={ndata[nws]} width='88' height='54'/></Link>  </figure>
                      </div>;
                  }           
        i=i+1;
      }
    
      return (
        <div className='main-news category-main-news'>
      <div className='category-news-left'>
        <div className='main-one'>          
          {rcnt0}
        </div>
      </div>
      <div className='category-news-right'> {rcnt1} {rcnt2} {rcnt3} {rcnt4}{rcnt5}{rcnt6}</div>
      </div>
      );
    
  }

function Catgnews(props){
  const post= props.newslist;
  const ix= props.ind;
  if(ix==0){
    return (
            <Blockstop ndt={post} />
    );
  }else{
    return (
      <div className='category-bottom-list'>
        {post.map((news, index) => (
            <Blocks ndt={news} key={index} />
             ))} 
      </div>
    );
  }

}
  export default function Distnews({ initialPosts, category_id }) {
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
        const distid=category_id;
        const res = await fetch(`/api/category?page=${page}&limit=8&category=${distid}`);  // Fetch next page
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
        <Catgnews newslist={post} ind={index}/>
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
  