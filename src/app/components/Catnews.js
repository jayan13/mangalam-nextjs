'use client'
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from "next/image";
//import Slider from "./Slider";
import SlickSlider from "./Slickslider"

function Newimg(props) {
    const newsimage= props.news;
    const w=props.width;
    const h=props.height;
    return ( (newsimage.file_name!=null)? <Image src={'/'+newsimage.file_name} alt={newsimage.alt} width={w} height={h} loading="lazy"  /> : <div>No Image</div>);
  }

function Homenew(props){
  const post= props.newslist;
  const template=post[0].template;
  //console.log(news);
  if (template=='home-top')
  {
    return (
      <div className='main-news'> 
        <div className='main-news-left'>
          <div className='main-one'>
              <div className="news-item">                
                <figure> <Newimg news={post[0]} width='608' height='365'/></figure>
                <Link href={`/news/${post[0].url}`}> <h1>  {post[0].title} </h1> </Link>
                <p>{post[0].news_details}</p>
              </div>
          </div>
              <div className='main-news-bottom'>
                <div className="news-item">                
                  <figure> <Newimg news={post[1]} width='292' height='174'/></figure>
                  <p className="category-tag"> <Link href={`${post[1].links}`} title="text">{post[1].link_title}</Link></p>
                  <Link href={`/news/${post[1].url}`}> <h3>  {post[1].title} </h3> </Link>
                </div>
                <div className="news-item">                
                  <figure> <Newimg news={post[2]} width='292' height='174'/></figure>
                  <p className="category-tag"> <Link href={`${post[2].links}`} title="text">{post[2].link_title}</Link></p>
                  <Link href={`/news/${post[2].url}`}> <h3>  {post[2].title} </h3> </Link>
                </div>
              </div>
          
        </div>
        <div className='main-news-right'>
          <div className="news-item">                
            <figure> <Newimg news={post[3]} width='88' height='54'/></figure>
            <Link href={`/news/${post[3].url}`}> <h3>  {post[3].title} </h3> </Link>
          </div>
          <div className="news-item">                
            <figure> <Newimg news={post[4]} width='88' height='54'/></figure>
            <Link href={`/news/${post[4].url}`}> <h3>  {post[4].title} </h3> </Link>
          </div>
          <div className="news-item">                
            <figure> <Newimg news={post[5]} width='88' height='54'/></figure>
            <Link href={`/news/${post[5].url}`}> <h3>  {post[5].title} </h3> </Link>
          </div>
          <div className="news-item">                
            <figure> <Newimg news={post[6]} width='88' height='54'/></figure>
            <Link href={`/news/${post[6].url}`}> <h3>  {post[6].title} </h3> </Link>
          </div>
          <div className="news-item">                
            <figure> <Newimg news={post[7]} width='88' height='54'/></figure>
            <Link href={`/news/${post[7].url}`}> <h3>  {post[7].title} </h3> </Link>
          </div>
          <div className="news-item">                
            <figure> <Newimg news={post[8]} width='88' height='54'/></figure>
            <Link href={`/news/${post[8].url}`}> <h3>  {post[8].title} </h3> </Link>
          </div>
          <div className="news-item">                
            <figure> <Newimg news={post[9]} width='88' height='54'/></figure>
            <Link href={`/news/${post[9].url}`}> <h3>  {post[9].title} </h3> </Link>
          </div>
          <div className="news-item">                
            <figure> <Newimg news={post[10]} width='88' height='54'/></figure>
            <Link href={`/news/${post[10].url}`}> <h3>  {post[10].title} </h3> </Link>
          </div>
          <div className="news-item">                
            <figure> <Newimg news={post[11]} width='88' height='54' /></figure>
            <Link href={`/news/${post[11].url}`}> <h3>  {post[11].title} </h3> </Link>
          </div>
        </div>

      </div>
      
    );
  }
  //==================================================================
  if (template=='home-7')
    {
      return (
        <div className='home-category'>
          <div className="home-category-main">
            <div className='home-category-main-left'>
              <div className='main-one'>
                <div className="news-item">
                  <div className='news-item-text'>
                    <p className="category-tag"><Link href={`${post[0].links}`} title="text">{post[0].link_title}</Link></p>
                    <h2> <Link href={`/news/${post[0].url}`}>   {post[0].title}  </Link> </h2>
                    <p>{post[0].news_details}</p>
                  </div>                
                  <figure> <Newimg news={post[0]} width='453' height='271'/></figure>
                </div>
              </div>
            </div>
            <div className='home-category-main-right'>
              <div className="news-item">
                <figure> <Newimg news={post[1]} width='211' height='127'/></figure>
                  <div className='news-item-text'>
                      <p className="category-tag"><Link href={`${post[1].links}`} title="text">{post[1].link_title}</Link></p>
                      <h3> <Link href={`/news/${post[1].url}`}>   {post[1].title}  </Link> </h3>
                  </div> 
              </div>
            </div>   
          </div>
          <div className='category-bottom'>
            <div className='category-bottom-left'>
              <div className="news-item">
                <figure> <Newimg news={post[2]} width='211' height='127'/></figure>
                  <div className='news-item-text'>
                      <p className="category-tag"><Link href={`${post[2].links}`} title="text">{post[2].link_title}</Link></p>
                      <h3> <Link href={`/news/${post[2].url}`}>   {post[2].title}  </Link> </h3>
                  </div> 
              </div>
              <div className="news-item">
                <figure> <Newimg news={post[3]} width='211' height='127'/></figure>
                  <div className='news-item-text'>
                      <p className="category-tag"><Link href={`${post[3].links}`} title="text">{post[3].link_title}</Link></p>
                      <h3> <Link href={`/news/${post[3].url}`}>   {post[3].title}  </Link> </h3>
                  </div> 
              </div>
            </div>
            <div className='category-bottom-right'>
              <div className='news-item horizontal-news'>
                <div className='news-item-text'>
                      <p className="category-tag"><Link href={`${post[4].links}`} title="text">{post[4].link_title}</Link></p>
                      <h3> <Link href={`/news/${post[4].url}`}>   {post[4].title}  </Link> </h3>
                  </div> 
                <figure> <Newimg news={post[4]} width='112' height='67'/></figure>
              </div>
              <div className='news-item horizontal-news'>
                <div className='news-item-text'>
                      <p className="category-tag"><Link href={`${post[5].links}`} title="text">{post[5].link_title}</Link></p>
                      <h3> <Link href={`/news/${post[5].url}`}>   {post[5].title}  </Link> </h3>
                  </div> 
                <figure> <Newimg news={post[5]} width='112' height='67'/></figure>
              </div>
              <div className='news-item horizontal-news'>
                <div className='news-item-text'>
                      <p className="category-tag"><Link href={`${post[6].links}`} title="text">{post[6].link_title}</Link></p>
                      <h3> <Link href={`/news/${post[6].url}`}>   {post[6].title}  </Link> </h3>
                  </div> 
                <figure> <Newimg news={post[6]} width='112' height='67'/></figure>
              </div>
              
            </div>
          </div>

        </div>
      );
    }
  //==================================================================
  if (template=='home-6')
    {
      return (
        <div className="home-category home-category-type2 ">
          <div className='home-category-main'>
            <div className='home-category-main-left'>
                <div className="news-item">
                  <div className='news-item-text'>
                    <p className="category-tag"><Link href={`${post[0].links}`} title="text">{post[0].link_title}</Link></p>
                    <h2> <Link href={`/news/${post[0].url}`}>   {post[0].title}  </Link> </h2>
                    <p>{post[0].news_details}</p>
                  </div>                
                  <figure> <Newimg news={post[0]} width='453' height='271'/></figure>
                </div>
            </div>
            <div className='home-category-main-right'>
              <div className="news-item">
                <figure> <Newimg news={post[1]} width='211' height='127'/></figure>
                  <div className='news-item-text'>
                      <p className="category-tag"><Link href={`${post[1].links}`} title="text">{post[1].link_title}</Link></p>
                      <h3> <Link href={`/news/${post[1].url}`}>   {post[1].title}  </Link> </h3>
                  </div> 
              </div>
            </div>
          </div>
          <div className='category-bottom'>
            <div className='category-bottom-left'>
              <div className="news-item">
                <figure> <Newimg news={post[2]} width='211' height='127'/></figure>
                  <div className='news-item-text'>
                      <p className="category-tag"><Link href={`${post[2].links}`} title="text">{post[2].link_title}</Link></p>
                      <h3> <Link href={`/news/${post[2].url}`}>   {post[2].title}  </Link> </h3>
                  </div> 
              </div>
              <div className="news-item">
                <figure> <Newimg news={post[3]} width='211' height='127'/></figure>
                  <div className='news-item-text'>
                      <p className="category-tag"><Link href={`${post[3].links}`} title="text">{post[3].link_title}</Link></p>
                      <h3> <Link href={`/news/${post[3].url}`}>   {post[3].title}  </Link> </h3>
                  </div> 
              </div>
              <div className="news-item">
                <figure> <Newimg news={post[4]} width='211' height='127'/></figure>
                  <div className='news-item-text'>
                      <p className="category-tag"><Link href={`${post[4].links}`} title="text">{post[4].link_title}</Link></p>
                      <h3> <Link href={`/news/${post[4].url}`}>   {post[4].title}  </Link> </h3>
                  </div> 
              </div>
              <div className="news-item">
                <figure> <Newimg news={post[5]} width='211' height='127'/></figure>
                  <div className='news-item-text'>
                      <p className="category-tag"><Link href={`${post[5].links}`} title="text">{post[5].link_title}</Link></p>
                      <h3> <Link href={`/news/${post[5].url}`}>   {post[5].title}  </Link> </h3>
                  </div> 
              </div>
            </div>
          </div>
                 
        </div>
      );
    }
  //==================================================================
  if (template=='youtubeshorts')
    {
      return (
        <div className='reel-news'>
        
        <SlickSlider slidedata={post} />         
        
        </div>
      );
    }
  
  return (
    <div className="news-item">
          
    </div>
  );
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
        const res = await fetch(`/api/home?page=${page}&limit=1`);  // Fetch next page
        const data = await res.json();
  
        // Append new posts to the existing list
        setPosts((prevPosts) => [...prevPosts, ...data.homenewslist]);
  
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
        <div className="section-heading section-heading-red">{post[0].heading}</div>
        <Homenew newslist={post} />
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
  