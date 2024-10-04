// components/InfiniteScroll.js
'use client'
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from "next/image";

function Newimg(props) {
  const newsimage= props.news;
  return ( (newsimage.file_name!=null)? <Image src={'/'+newsimage.file_name} alt="A portrait of me" width="308" height="185" loading="lazy"  /> : <div>No Image</div>);
}
function Newimgs(props) {
  const newsimage= props.news;
  return ( (newsimage.file_name!=null)? <Image src={'/'+newsimage.file_name} className='news-image' alt="A portrait of me" width="88" height="54" loading="lazy"  /> : <div>No Image</div>);
}
function Newsright(props) {
  const post= props.news;
  const template='';
  let imgmark='';
  let topclass='news-in-pics';
  let hed='BUSINESS';
  let hedcolr='section-heading-blue';
  if (template=='MANGALAM PREMIUM')
  {
    imgmark=<div className="premium-tag">PREMIUM</div>;    
    topclass='mangalam-special';
    hed='MANGALAM PREMIUM';
    hedcolr='section-heading-red';
  }
  if (template=='news-in-pics')
    {
      imgmark=<div className="pic-tag">5</div>;   
      hed='NEWS IN PICS';
      hedcolr='section-heading-red';
    }
  if (template=='videos')
    {
       imgmark=<div className="video-tag">Play</div>;  
       hed='NEWS IN VIDEOS';
       hedcolr='section-heading-red';
    }
  return (
    <div className={`right-news-section ${topclass}`}>
      <div className={`section-heading ${hedcolr}`}>{hed}</div>
      <div key={`lft-${post[0].id}`} id={`lft-${post[0].id}`} className="news-item right-main-news">
          <figure>
            {imgmark}
          <Newimg news={post[0]}/>
          </figure>
          <div className="news-item-text">
            <h3><Link href={`/news/${post[0].url}`}>{post[0].title}</Link>
            </h3>
          </div>
        </div>
        <div className="right-news-bottom" id={`lftbtm-${post[0].id}`} key={`lftbtm-${post[0].id}`}>

          <div key={`lft-${post[1].id}`} id={`lft-${post[1].id}`} className="news-item">
            <figure>
            {imgmark}
            <Newimgs news={post[1]}/>
            </figure>
            <div className="news-item-text">
              <h3><Link href={`/news/${post[1].url}`}>{post[1].title}</Link>
              </h3>
            </div>
          </div>
          <div key={`lft-${post[2].id}`} id={`lft-${post[2].id}`} className="news-item">
            <figure>
            {imgmark}
            <Newimgs news={post[2]}/>
            </figure>
            <div className="news-item-text">
              <h3><Link href={`/news/${post[2].url}`}>{post[2].title}</Link>
              </h3>
            </div>
          </div>
          <div key={`lft-${post[3].id}`} id={`lft-${post[3].id}`} className="news-item">
            <figure>
            {imgmark}
            <Newimgs news={post[3]}/>
            </figure>
            <div className="news-item-text">
              <h3><Link href={`/news/${post[3].url}`}>{post[3].title}</Link>
              </h3>
            </div>
          </div>
          <div key={`lft-${post[4].id}`} id={`lft-${post[4].id}`} className="news-item">
            <figure>
            {imgmark}
            <Newimgs news={post[4]}/>
            </figure>
            <div className="news-item-text">
              <h3><Link href={`/news/${post[4].url}`}>{post[4].title}</Link>
              </h3>
            </div>
          </div>

        </div>
    </div>
  );
}

export default function InfiniteScroll(){
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isFetchingrgt, setIsFetchingrgt] = useState(false); // Prevent multiple fetches at once
  const observer = useRef();

  const loadMore = async () => {
    if (isFetchingrgt) return;  // Prevent multiple calls

    setIsFetchingrgt(true);
    const res = await fetch(`/api/right?page=${page}&limit=5`);
    const data = await res.json();
    //console.log(data);
    setPosts((prevPosts) => [...prevPosts, ...data.newslist]);
    setHasMore(data.hasMore);
    setPage((prev) => prev + 1);
    setIsFetchingrgt(false);
  };

  useEffect(() => {
    if (!hasMore) return;  // Stop if no more posts to load

    const target = document.querySelector('#end-of-list-right');

    if (observer.current) observer.current.disconnect();  // Clean up previous observer

    observer.current = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !isFetchingrgt) {
          // Fetch more posts only when the target is visible and we're not already fetching
          loadMore();
        }
      },
      { root: null, rootMargin: '20px', threshold: 1.0 }
    );

    if (target) observer.current.observe(target);

    // Cleanup when component unmounts or page changes
    return () => {
      if (observer.current) observer.current.disconnect();
    };
  }, [page, hasMore]);


  return (
    <div className="home-news-section-right">
      {posts.map((post, index) => (
      <div key={index}>
        <div className="advertisement no-margin">
          <div className="advertisement-text">Advertisement</div>
          <div className="ad"> <Image src="/img/ads/side-ad-small.jpg" alt='adds' width={300} height={250} loading="lazy" /> </div>
        </div>
        <Newsright news={post} />
        </div>
      ))}
      <div id="end-of-list-right">
        {hasMore ? <p>Loading more...</p> : <p>No more posts to load</p>}
      </div>
    </div>
  );
};