'use client'
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from "next/image";
//import Slider from "./Slider";
//import SlickSlider from "./Slickslider";
import YouTubeSlider from "./YouTubeSlider";
import VisualStories from "./VisualStories";
import AdSenseAdc from "../adds/AddsCenter"

function Newimg(props) {
  const newsimage = props.news;
  const w = props.width;
  const h = props.height;
  //let src='/'+newsimage.file_name;
  let src = `${process.env.NEXT_PUBLIC_IMAGE_URL}/${newsimage.file_name}`;
  //console.log(src);
  const [imageSrc, setImageSrc] = useState(src);
  return ((newsimage.file_name != null) ? <Image src={imageSrc} alt={newsimage.alt} width={w} height={h} loading="lazy" onError={() => setImageSrc("/uploads/noimg.svg")} unoptimized={process.env.NEXT_PUBLIC_IMAGE_URL.includes('mangalam.cms')} /> : <Image src="/uploads/noimg.svg" alt={newsimage.alt} width={w} height={h} loading="lazy" />);
}

function Homenew(props) {
  const post = props.newslist;
  const template = post[0].template;

  if (template == 'top') {
    return (
      <div className='main-news'>
        <div className='main-news-left'>
          <div className="section-heading section-heading-red">
            {post?.[0]?.heading}
          </div>
          <div className='main-one'>
            {post[0] && (
              <div className="news-item">
                <figure> <Link href={`/news/${post[0].url}`}><Newimg news={post[0]} width='608' height='365' /></Link></figure>
                <Link href={`/news/${post[0].url}`}> <h1>  {post[0].title} </h1> </Link>
                <p>{post[0].news_details}</p>
              </div>
            )}
          </div>
          <div className='main-news-bottom'>
            {post[1] && (
              <div className="news-item">
                <figure> {post[1].url ? <Link href={`/news/${post[1].url}`}><Newimg news={post[1]} width='292' height='174' /></Link> : <Newimg news={post[1]} width='292' height='174' />} </figure>
                <p className="category-tag"> {post[1].links ? <Link href={`${post[1].links}`} title="text">{post[1].link_title}</Link> : post[1].link_title}</p>
                {post[1].url ? <Link href={`/news/${post[1].url}`}> <h3>  {post[1].title} </h3> </Link> : <h3> {post[1].title} </h3>}
              </div>
            )}
            {post[2] && (
              <div className="news-item">
                <figure> {post[2].url ? <Link href={`/news/${post[2].url}`}><Newimg news={post[2]} width='292' height='174' /></Link> : <Newimg news={post[2]} width='292' height='174' />} </figure>
                <p className="category-tag"> {post[2].links ? <Link href={`${post[2].links}`} title="text">{post[2].link_title}</Link> : post[2].link_title}</p>
                {post[2].url ? <Link href={`/news/${post[2].url}`}> <h3>  {post[2].title} </h3> </Link> : <h3> {post[2].title} </h3>}
              </div>
            )}
          </div>

        </div>
        <div className='main-news-right'>
          {post[3] && (<>
            <div className="section-heading section-heading-blue" >
              {post?.[3]?.heading}
            </div>
            <div className="news-item">
              <Link href={`/news/${post[3].url}`}> <h3>  {post[3].title} </h3> </Link>
              <figure> <Link href={`/news/${post[3].url}`}><Newimg news={post[3]} width='88' height='54' /></Link></figure>
            </div>
          </>
          )}
          {post[4] && (
            <div className="news-item">
              <Link href={`/news/${post[4].url}`}> <h3>  {post[4].title} </h3> </Link>
              <figure> <Link href={`/news/${post[4].url}`}><Newimg news={post[4]} width='88' height='54' /></Link></figure>
            </div>
          )}
          {post[5] && (
            <div className="news-item">
              <Link href={`/news/${post[5].url}`}> <h3>  {post[5].title} </h3> </Link>
              <figure> <Link href={`/news/${post[5].url}`}><Newimg news={post[5]} width='88' height='54' /></Link></figure>
            </div>
          )}
          {post[6] && (
            <div className="news-item">
              <Link href={`/news/${post[6].url}`}> <h3>  {post[6].title} </h3> </Link>
              <figure> <Link href={`/news/${post[6].url}`}><Newimg news={post[6]} width='88' height='54' /></Link></figure>
            </div>
          )}
          {post[7] && (
            <div className="news-item">
              <Link href={`/news/${post[7].url}`}> <h3>  {post[7].title} </h3> </Link>
              <figure> <Link href={`/news/${post[7].url}`}><Newimg news={post[7]} width='88' height='54' /></Link></figure>
            </div>
          )}
          {post[8] && (
            <div className="news-item">
              <Link href={`/news/${post[8].url}`}> <h3>  {post[8].title} </h3> </Link>
              <figure> <Link href={`/news/${post[8].url}`}><Newimg news={post[8]} width='88' height='54' /></Link></figure>
            </div>
          )}
          {post[9] && (
            <div className="news-item">
              <Link href={`/news/${post[9].url}`}> <h3>  {post[9].title} </h3> </Link>
              <figure> <Link href={`/news/${post[9].url}`}><Newimg news={post[9]} width='88' height='54' /></Link></figure>
            </div>
          )}
          {post[10] && (
            <div className="news-item">
              <Link href={`/news/${post[10].url}`}> <h3>  {post[10].title} </h3> </Link>
              <figure> <Link href={`/news/${post[10].url}`}><Newimg news={post[10]} width='88' height='54' /></Link></figure>
            </div>
          )}
          {post[11] && (
            <div className="news-item">
              <Link href={`/news/${post[11].url}`}> <h3>  {post[11].title} </h3> </Link>
              <figure> <Link href={`/news/${post[11].url}`}><Newimg news={post[11]} width='88' height='54' /></Link></figure>
            </div>
          )}
        </div>

      </div>

    );
  }
  if (template == 'home-top') {
    return (
      <div className='main-news'>
        <div className="section-heading section-heading-red">
          {post?.[0]?.heading}
        </div>
        <div className='main-news-left'>
          <div className='main-one'>
            {post[0] && (
              <div className="news-item">
                <figure> <Link href={`/news/${post[0].url}`}><Newimg news={post[0]} width='608' height='365' /></Link></figure>
                <Link href={`/news/${post[0].url}`}> <h1>  {post[0].title} </h1> </Link>
                <p>{post[0].news_details}</p>
              </div>
            )}
          </div>
          <div className='main-news-bottom'>
            {post[1] && (
              <div className="news-item">
                <figure> {post[1].url ? <Link href={`/news/${post[1].url}`}><Newimg news={post[1]} width='292' height='174' /></Link> : <Newimg news={post[1]} width='292' height='174' />} </figure>
                <p className="category-tag"> {post[1].links ? <Link href={`${post[1].links}`} title="text">{post[1].link_title}</Link> : post[1].link_title}</p>
                {post[1].url ? <Link href={`/news/${post[1].url}`}> <h3>  {post[1].title} </h3> </Link> : <h3> {post[1].title} </h3>}
              </div>
            )}
            {post[2] && (
              <div className="news-item">
                <figure> {post[2].url ? <Link href={`/news/${post[2].url}`}><Newimg news={post[2]} width='292' height='174' /></Link> : <Newimg news={post[2]} width='292' height='174' />} </figure>
                <p className="category-tag"> {post[2].links ? <Link href={`${post[2].links}`} title="text">{post[2].link_title}</Link> : post[2].link_title}</p>
                {post[2].url ? <Link href={`/news/${post[2].url}`}> <h3>  {post[2].title} </h3> </Link> : <h3> {post[2].title} </h3>}
              </div>
            )}
          </div>

        </div>
        <div className='main-news-right'>
          {post[3] && (
            <div className="news-item">
              <Link href={`/news/${post[3].url}`}> <h3>  {post[3].title} </h3> </Link>
              <figure> <Link href={`/news/${post[3].url}`}><Newimg news={post[3]} width='88' height='54' /></Link></figure>
            </div>
          )}
          {post[4] && (
            <div className="news-item">
              <Link href={`/news/${post[4].url}`}> <h3>  {post[4].title} </h3> </Link>
              <figure> <Link href={`/news/${post[4].url}`}><Newimg news={post[4]} width='88' height='54' /></Link></figure>
            </div>
          )}
          {post[5] && (
            <div className="news-item">
              <Link href={`/news/${post[5].url}`}> <h3>  {post[5].title} </h3> </Link>
              <figure> <Link href={`/news/${post[5].url}`}><Newimg news={post[5]} width='88' height='54' /></Link></figure>
            </div>
          )}
          {post[6] && (
            <div className="news-item">
              <Link href={`/news/${post[6].url}`}> <h3>  {post[6].title} </h3> </Link>
              <figure> <Link href={`/news/${post[6].url}`}><Newimg news={post[6]} width='88' height='54' /></Link></figure>
            </div>
          )}
          {post[7] && (
            <div className="news-item">
              <Link href={`/news/${post[7].url}`}> <h3>  {post[7].title} </h3> </Link>
              <figure> <Link href={`/news/${post[7].url}`}><Newimg news={post[7]} width='88' height='54' /></Link></figure>
            </div>
          )}
          {post[8] && (
            <div className="news-item">
              <Link href={`/news/${post[8].url}`}> <h3>  {post[8].title} </h3> </Link>
              <figure> <Link href={`/news/${post[8].url}`}><Newimg news={post[8]} width='88' height='54' /></Link></figure>
            </div>
          )}
          {post[9] && (
            <div className="news-item">
              <Link href={`/news/${post[9].url}`}> <h3>  {post[9].title} </h3> </Link>
              <figure> <Link href={`/news/${post[9].url}`}><Newimg news={post[9]} width='88' height='54' /></Link></figure>
            </div>
          )}
          {post[10] && (
            <div className="news-item">
              <Link href={`/news/${post[10].url}`}> <h3>  {post[10].title} </h3> </Link>
              <figure> <Link href={`/news/${post[10].url}`}><Newimg news={post[10]} width='88' height='54' /></Link></figure>
            </div>
          )}
          {post[11] && (
            <div className="news-item">
              <Link href={`/news/${post[11].url}`}> <h3>  {post[11].title} </h3> </Link>
              <figure> <Link href={`/news/${post[11].url}`}><Newimg news={post[11]} width='88' height='54' /></Link></figure>
            </div>
          )}
        </div>

      </div>

    );
  }
  //==================================================================
  if (template == 'home-7') {
    return (
      <div className='home-category'>
        <div className="section-heading section-heading-red">
          {post?.[0]?.heading}
        </div>
        <div className="home-category-main">
          <div className='home-category-main-left'>
            <div className='main-one'>
              {post[0] && (
                <div className="news-item">
                  <div className='news-item-text'>
                    <p className="category-tag">{post[0].links ? <Link href={`${post[0].links}`} title="text">{post[0].link_title}</Link> : post[0].link_title}</p>
                    <h2> {post[0].url ? <Link href={`/news/${post[0].url}`}>   {post[0].title}  </Link> : post[0].title} </h2>
                    <p>{post[0].news_details}</p>
                  </div>
                  <figure> {post[0].url ? <Link href={`/news/${post[0].url}`}><Newimg news={post[0]} width='453' height='271' /></Link> : <Newimg news={post[0]} width='453' height='271' />} </figure>
                </div>
              )}
            </div>
          </div>
          <div className='home-category-main-right'>
            {post[1] && (
              <div className="news-item">
                <figure> {post[1].url ? <Link href={`/news/${post[1].url}`}><Newimg news={post[1]} width='211' height='127' /></Link> : <Newimg news={post[1]} width='211' height='127' />} </figure>
                <div className='news-item-text'>
                  <p className="category-tag">{post[1].links ? <Link href={`${post[1].links}`} title="text">{post[1].link_title}</Link> : post[1].link_title}</p>
                  <h3> {post[1].url ? <Link href={`/news/${post[1].url}`}>   {post[1].title}  </Link> : post[1].title} </h3>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className='category-bottom'>
          <div className='category-bottom-left'>
            {post[2] && (
              <div className="news-item">
                <figure> {post[2].url ? <Link href={`/news/${post[2].url}`}><Newimg news={post[2]} width='211' height='127' /></Link> : <Newimg news={post[2]} width='211' height='127' />} </figure>
                <div className='news-item-text'>
                  <p className="category-tag">{post[2].links ? <Link href={`${post[2].links}`} title="text">{post[2].link_title}</Link> : post[2].link_title}</p>
                  <h3> {post[2].url ? <Link href={`/news/${post[2].url}`}>   {post[2].title}  </Link> : post[2].title} </h3>
                </div>
              </div>
            )}
            {post[3] && (
              <div className="news-item">
                <figure> {post[3].url ? <Link href={`/news/${post[3].url}`}><Newimg news={post[3]} width='211' height='127' /></Link> : <Newimg news={post[3]} width='211' height='127' />} </figure>
                <div className='news-item-text'>
                  <p className="category-tag">{post[3].links ? <Link href={`${post[3].links}`} title="text">{post[3].link_title}</Link> : post[3].link_title}</p>
                  <h3> {post[3].url ? <Link href={`/news/${post[3].url}`}>   {post[3].title}  </Link> : post[3].title} </h3>
                </div>
              </div>
            )}
          </div>
          <div className='category-bottom-right'>
            {post[4] && (
              <div className='news-item horizontal-news'>
                <div className='news-item-text'>
                  <p className="category-tag">{post[4].links ? <Link href={`${post[4].links}`} title="text">{post[4].link_title}</Link> : post[4].link_title}</p>
                  <h3> {post[4].url ? <Link href={`/news/${post[4].url}`}>   {post[4].title}  </Link> : post[4].title} </h3>
                </div>
                <figure> {post[4].url ? <Link href={`/news/${post[4].url}`}><Newimg news={post[4]} width='112' height='67' /></Link> : <Newimg news={post[4]} width='112' height='67' />} </figure>
              </div>
            )}
            {post[5] && (
              <div className='news-item horizontal-news'>
                <div className='news-item-text'>
                  <p className="category-tag">{post[5].links ? <Link href={`${post[5].links}`} title="text">{post[5].link_title}</Link> : post[5].link_title}</p>
                  <h3> {post[5].url ? <Link href={`/news/${post[5].url}`}>   {post[5].title}  </Link> : post[5].title} </h3>
                </div>
                <figure> {post[5].url ? <Link href={`/news/${post[5].url}`}><Newimg news={post[5]} width='112' height='67' /></Link> : <Newimg news={post[5]} width='112' height='67' />} </figure>
              </div>
            )}
            {post[6] && (
              <div className='news-item horizontal-news'>
                <div className='news-item-text'>
                  <p className="category-tag">{post[6].links ? <Link href={`${post[6].links}`} title="text">{post[6].link_title}</Link> : post[6].link_title}</p>
                  <h3> {post[6].url ? <Link href={`/news/${post[6].url}`}>   {post[6].title}  </Link> : post[6].title} </h3>
                </div>
                <figure> {post[6].url ? <Link href={`/news/${post[6].url}`}><Newimg news={post[6]} width='112' height='67' /></Link> : <Newimg news={post[6]} width='112' height='67' />} </figure>

              </div>)}

          </div>
        </div>

      </div>
    );
  }
  //==================================================================
  if (template == 'home-6') {
    return (
      <div className="home-category home-category-type2 ">
        <div className="section-heading section-heading-blue">
          {post?.[0]?.heading}
        </div>
        <div className='home-category-main'>
          <div className='home-category-main-left'>
            {post[0] && (
              <div className="news-item">
                <div className='news-item-text'>
                  <p className="category-tag">{post[0].links ? <Link href={`${post[0].links}`} title="text">{post[0].link_title}</Link> : post[0].link_title}</p>
                  <h2> {post[0].url ? <Link href={`/news/${post[0].url}`}>   {post[0].title}  </Link> : post[0].title} </h2>
                  <p>{post[0].news_details}</p>
                </div>
                <figure> {post[0].links ? <Link href={`${post[0].links}`} title="text"><Newimg news={post[0]} width='453' height='271' /></Link> : <Newimg news={post[0]} width='453' height='271' />} </figure>
              </div>
            )}
          </div>
          <div className='home-category-main-right'>
            {post[1] && (
              <div className="news-item">
                <figure> {post[1].url ? <Link href={`/news/${post[1].url}`}><Newimg news={post[1]} width='211' height='127' /></Link> : <Newimg news={post[1]} width='211' height='127' />} </figure>
                <div className='news-item-text'>
                  <p className="category-tag">{post[1].links ? <Link href={`${post[1].links}`} title="text">{post[1].link_title}</Link> : post[1].link_title}</p>
                  <h3> {post[1].url ? <Link href={`/news/${post[1].url}`}>   {post[1].title}  </Link> : post[1].title} </h3>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className='category-bottom'>
          <div className='category-bottom-left'>
            {post[2] && (
              <div className="news-item">
                <figure> {post[2].url ? <Link href={`/news/${post[2].url}`}><Newimg news={post[2]} width='211' height='127' /></Link> : <Newimg news={post[2]} width='211' height='127' />} </figure>
                <div className='news-item-text'>
                  <p className="category-tag">{post[2].links ? <Link href={`${post[2].links}`} title="text">{post[2].link_title}</Link> : post[2].link_title}</p>
                  <h3> {post[2].url ? <Link href={`/news/${post[2].url}`}>   {post[2].title}  </Link> : post[2].title} </h3>
                </div>
              </div>
            )}
            {post[3] && (
              <div className="news-item">
                <figure> {post[3].url ? <Link href={`/news/${post[3].url}`}><Newimg news={post[3]} width='211' height='127' /></Link> : <Newimg news={post[3]} width='211' height='127' />} </figure>
                <div className='news-item-text'>
                  <p className="category-tag">{post[3].links ? <Link href={`${post[3].links}`} title="text">{post[3].link_title}</Link> : post[3].link_title}</p>
                  <h3> {post[3].url ? <Link href={`/news/${post[3].url}`}>   {post[3].title}  </Link> : post[3].title} </h3>
                </div>
              </div>
            )}
            {post[4] && (
              <div className="news-item">
                <figure> {post[4].url ? <Link href={`/news/${post[4].url}`}><Newimg news={post[4]} width='211' height='127' /></Link> : <Newimg news={post[4]} width='211' height='127' />} </figure>
                <div className='news-item-text'>
                  <p className="category-tag">{post[4].links ? <Link href={`${post[4].links}`} title="text">{post[4].link_title}</Link> : post[4].link_title}</p>
                  <h3> {post[4].url ? <Link href={`/news/${post[4].url}`}>   {post[4].title}  </Link> : post[4].title} </h3>
                </div>
              </div>
            )}
            {post[5] && (
              <div className="news-item">
                <figure> {post[5].url ? <Link href={`/news/${post[5].url}`}><Newimg news={post[5]} width='211' height='127' /></Link> : <Newimg news={post[5]} width='211' height='127' />} </figure>
                <div className='news-item-text'>
                  <p className="category-tag">{post[5].links ? <Link href={`${post[5].links}`} title="text">{post[5].link_title}</Link> : post[5].link_title}</p>
                  <h3> {post[5].url ? <Link href={`/news/${post[5].url}`}>   {post[5].title}  </Link> : post[5].title} </h3>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    );
  }
  //==================================================================
  if (template == 'youtubeshorts') {
    //const imgarrs=['/img/reel-1.webp','/img/reel-2.webp','/img/reel-3.webp','/img/reel-4.webp','/img/reel-5.webp']
    return (
      <div className='reel-news'>
        <div className="section-heading section-heading-red">
          {post?.[0]?.heading}
        </div>

        <YouTubeSlider slidedata={post} />

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
  //console.log("initial="+initialPosts);
  const fetchMorePosts = async () => {

    if (isFetching) return;  // Prevent multiple calls

    setIsFetching(true);

    //console.log('Fetching page:', page);  // Debugging to ensure correct page is passed

    try {
      const res = await fetch(`/api/home?page=${page}&limit=1`, { next: { revalidate: parseInt(process.env.QUERY_REVALIDATE || '360') } });  // Fetch next page
      const data = await res.json();

      if (data.homenewslist) {
        setPosts((prevPosts) => [...prevPosts, ...data.homenewslist]);
        setHasMore(data.hasMore);
        setPage((prevPage) => prevPage + 1);
      } else {

        setHasMore(0);

      }
      //setPosts((prevPosts) => [...prevPosts, ...data.homenewslist]);
      //setHasMore(data.hasMore);
      //setPage((prevPage) => prevPage + 1);
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
      { root: null, rootMargin: '800px', threshold: 0.1 }
    );

    if (target) observer.current.observe(target);

    // Cleanup when component unmounts or page changes
    return () => {
      if (observer.current) observer.current.disconnect();
    };
  }, [page, hasMore]);  // Make sure to include `hasMore` and `page` as dependencies


  return (

    <div className="home-news-section-left">

      {!posts || posts.length === 0 ? (
        <div className="no-news">No News</div>
      ) : (
        posts.map((post, index) => (
          <div key={index} className="mid-block">
            <Homenew newslist={post} />
            <AdSenseAdc adId={index} />
          </div>
        ))
      )}


      <div id="end-of-list">
        {hasMore ? "Loading more..." : ""}
      </div>

      {!hasMore && (
        <div key={`vis`} className="mid-block">
          <VisualStories />
          <AdSenseAdc adId={100} />
        </div>
      )}

    </div>


  );
}
