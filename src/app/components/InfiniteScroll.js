// components/InfiniteScroll.js
'use client'
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from "next/image";
import GoogleAdPcItem from "../adds/Addsright";
function Newimg(props) {
  const newsimage = props.news;
  //let src='/'+newsimage.file_name;
  let src = `${process.env.NEXT_PUBLIC_IMAGE_URL}/${newsimage.file_name}`;
  const [imageSrc, setImageSrc] = useState(src);
  return ((newsimage.file_name != null) ? <Image src={imageSrc} alt="news image" width="308" height="185" loading="lazy" onError={() => setImageSrc("/uploads/noimg.svg")} unoptimized={process.env.NEXT_PUBLIC_IMAGE_URL.includes('mangalam.cms')} /> : <Image src="/uploads/noimg.svg" alt="news image" width="308" height="185" loading="lazy" />);
}
function Newimgs(props) {
  const newsimage = props.news;
  //let src='/'+newsimage.file_name;
  let src = `${process.env.NEXT_PUBLIC_IMAGE_URL}/${newsimage.file_name}`;
  const [imageSrc, setImageSrc] = useState(src);
  return ((newsimage.file_name != null) ? <Image src={imageSrc} className='news-image' alt="news image" width="88" height="54" loading="lazy" onError={() => setImageSrc("/uploads/noimg.svg")} unoptimized={process.env.NEXT_PUBLIC_IMAGE_URL.includes('mangalam.cms')} /> : <Image src="/uploads/noimg.svg" className='news-image' alt="news image" width="88" height="54" loading="lazy" />);
}
function Newsright(props) {
  const post = props.news;
  const template = post[0].template;
  let imgmark = '';
  let topclass = 'news-in-pics';
  let hed = post[0].heading;
  let hedcolr = 'section-heading-blue';
  if (template == 'premium') {
    imgmark = <div className="premium-tag">PREMIUM</div>;
    topclass = 'mangalam-special';
    hedcolr = 'section-heading-red';
  }
  if (template == 'pic') {
    imgmark = <div className="pic-tag">5</div>;
    hedcolr = 'section-heading-red';
  }
  if (template == 'video') {
    imgmark = <div className="video-tag">Play</div>;
    hedcolr = 'section-heading-red';
  }
  return (
    <div className={`right-news-section ${topclass}`}>
      <div className={`section-heading ${hedcolr}`}>{hed}</div>
      {post[0] && (
        <div key={`lft-${post[0].id}`} id={`lft-${post[0].id}`} className="news-item right-main-news">
          <figure>
            {imgmark}
            {post[0].url ? <Link href={`/news/${post[0].url}`}><Newimg news={post[0]} /></Link> : <Newimg news={post[0]} />}
          </figure>
          <div className="news-item-text">
            <h3>{post[0].url ? <Link href={`/news/${post[0].url}`}>{post[0].title}</Link> : post[0].title}
            </h3>
          </div>

        </div>
      )}

      <div className="right-news-bottom" >
        {post[1] && (
          <div key={`lft-${post[1].id}`} id={`lft-${post[1].id}`} className="news-item">

            <div className="news-item-text">
              <h3>{post[1].url ? <Link href={`/news/${post[1].url}`}>{post[1].title}</Link> : post[1].title}
              </h3>
            </div>
            <figure>
              {imgmark}
              {post[1].url ? <Link href={`/news/${post[1].url}`}><Newimgs news={post[1]} /></Link> : <Newimgs news={post[1]} />}
            </figure>
          </div>
        )}
        {post[2] && (
          <div key={`lft-${post[2].id}`} id={`lft-${post[2].id}`} className="news-item">

            <div className="news-item-text">
              <h3>{post[2].url ? <Link href={`/news/${post[2].url}`}>{post[2].title}</Link> : post[2].title}
              </h3>
            </div>
            <figure>
              {imgmark}
              {post[2].url ? <Link href={`/news/${post[2].url}`}><Newimgs news={post[2]} /></Link> : <Newimgs news={post[2]} />}
            </figure>
          </div>
        )}
        {post[3] && (
          <div key={`lft-${post[3].id}`} id={`lft-${post[3].id}`} className="news-item">

            <div className="news-item-text">
              <h3>{post[3].url ? <Link href={`/news/${post[3].url}`}>{post[3].title}</Link> : post[3].title}
              </h3>
            </div>
            <figure>
              {imgmark}
              {post[3].url ? <Link href={`/news/${post[3].url}`}><Newimgs news={post[3]} /></Link> : <Newimgs news={post[3]} />}
            </figure>
          </div>
        )}
        {post[4] && (
          <div key={`lft-${post[4].id}`} id={`lft-${post[4].id}`} className="news-item">

            <div className="news-item-text">
              <h3>{post[4].url ? <Link href={`/news/${post[4].url}`}>{post[4].title}</Link> : post[4].title}
              </h3>
            </div>
            <figure>
              {imgmark}
              {post[4].url ? <Link href={`/news/${post[4].url}`}><Newimgs news={post[4]} /></Link> : <Newimgs news={post[4]} />}
            </figure>
          </div>
        )}
      </div>
    </div>
  );
}

export default function InfiniteScroll() {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isFetchingrgt, setIsFetchingrgt] = useState(false); // Prevent multiple fetches at once
  const observer = useRef();

  const loadMore = async () => {
    if (isFetchingrgt) return;  // Prevent multiple calls

    setIsFetchingrgt(true);
    const res = await fetch(`/api/right?page=${page}&limit=5`, { next: { revalidate: 360 } });
    const data = await res.json();
    //console.log(data);
    if (data.newslist) {
      setPosts((prevPosts) => [...prevPosts, ...data.newslist]);
      setHasMore(data.hasMore);
      setPage((prev) => prev + 1);
    } else {
      setHasMore(0);
    }
    //setPosts((prevPosts) => [...prevPosts, ...data.newslist]);
    //setHasMore(data.hasMore);
    //setPage((prev) => prev + 1);
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
    <div className="home-news-section-right no-printme">
      {posts.map((post, index) => (
        <div key={index} className='rght-block'>
          <GoogleAdPcItem adId={index} />
          <Newsright news={post} />
        </div>
      ))}
      <div id="end-of-list-right">
        {hasMore ? <p>Loading more...</p> : <p></p>}
      </div>
    </div>
  );
};