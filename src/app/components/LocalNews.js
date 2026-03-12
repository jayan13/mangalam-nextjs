'use client'
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from "next/image";
import DistrictNav from "./DistrictNav";

function Newimg(props) {
    const newsimage = props.news;
    const w = props.width;
    const h = props.height;
    let src = `${process.env.NEXT_PUBLIC_IMAGE_URL}/${newsimage.file_name}`;
    const [imageSrc, setImageSrc] = useState(src);
    return ((newsimage.file_name != null) ? <Image src={imageSrc} alt={newsimage.alt} width={w} height={h} loading="lazy" onError={() => setImageSrc("/uploads/noimg.svg")} unoptimized={process.env.NEXT_PUBLIC_IMAGE_URL.includes('mangalam.cms')} /> : <Image src="/uploads/noimg.svg" alt={newsimage.alt} width={w} height={h} loading="lazy" />);
}

export default function LocalNews() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLocalNews = async () => {
            try {
                const res = await fetch('/api/district?district=0&limit=7');
                const data = await res.json();
                if (data.distnewslist && data.distnewslist[0]) {
                    const processedPosts = data.distnewslist[0].map(post => ({
                        ...post,
                        news_details: SubstringWithoutBreakingWords(post.news_details || '', 160)
                    }));
                    setPosts(processedPosts);
                }
            } catch (error) {
                console.error('Error fetching local news:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchLocalNews();
    }, []);

    function SubstringWithoutBreakingWords(str, limit) {
        if (str.length <= limit) return str;
        let substring = str.substring(0, limit);
        if (str[limit] !== ' ' && substring.lastIndexOf(' ') !== -1) {
            substring = substring.substring(0, substring.lastIndexOf(' '));
        }
        return substring;
    }

    if (loading) return <div className="loading">Loading Local News...</div>;
    if (posts.length === 0) return null;

    return (
        <div className='home-category'>
            <div className="section-heading section-heading-red" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>Local News</span>
                <Link href="/district" style={{ fontSize: 'var(--font-size-s)', color: 'var(--mangalamcerulean)', textTransform: 'none', fontWeight: '400' }}>
                    View All &raquo;
                </Link>
            </div>
            
            <DistrictNav />

            <div className="home-category-main" style={{ marginTop: '16px' }}>
                <div className='home-category-main-left'>
                    <div className='main-one'>
                        {posts[0] && (
                            <div className="news-item">
                                <div className='news-item-text'>
                                    <p className="category-tag">{posts[0].links ? <Link href={`${posts[0].links}`} title="text">{posts[0].link_title}</Link> : posts[0].link_title}</p>
                                    <h2> <Link href={`/news/${posts[0].url}`}> {posts[0].title} </Link> </h2>
                                    <p>{posts[0].news_details}</p>
                                </div>
                                <figure> <Link href={`/news/${posts[0].url}`}><Newimg news={posts[0]} width='453' height='271' /></Link> </figure>
                            </div>
                        )}
                    </div>
                </div>
                <div className='home-category-main-right'>
                    {posts[1] && (
                        <div className="news-item">
                            <figure> <Link href={`/news/${posts[1].url}`}><Newimg news={posts[1]} width='211' height='127' /></Link> </figure>
                            <div className='news-item-text'>
                                <p className="category-tag">{posts[1].links ? <Link href={`${posts[1].links}`} title="text">{posts[1].link_title}</Link> : posts[1].link_title}</p>
                                <h3> <Link href={`/news/${posts[1].url}`}> {posts[1].title} </Link> </h3>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <div className='category-bottom'>
                <div className='category-bottom-left'>
                    {posts[2] && (
                        <div className="news-item">
                            <figure> <Link href={`/news/${posts[2].url}`}><Newimg news={posts[2]} width='211' height='127' /></Link> </figure>
                            <div className='news-item-text'>
                                <p className="category-tag">{posts[2].links ? <Link href={`${posts[2].links}`} title="text">{posts[2].link_title}</Link> : posts[2].link_title}</p>
                                <h3> <Link href={`/news/${posts[2].url}`}> {posts[2].title} </Link> </h3>
                            </div>
                        </div>
                    )}
                    {posts[3] && (
                        <div className="news-item">
                            <figure> <Link href={`/news/${posts[3].url}`}><Newimg news={posts[3]} width='211' height='127' /></Link> </figure>
                            <div className='news-item-text'>
                                <p className="category-tag">{posts[3].links ? <Link href={`${posts[3].links}`} title="text">{posts[3].link_title}</Link> : posts[3].link_title}</p>
                                <h3> <Link href={`/news/${posts[3].url}`}> {posts[3].title} </Link> </h3>
                            </div>
                        </div>
                    )}
                </div>
                <div className='category-bottom-right'>
                    {posts[4] && (
                        <div className='news-item horizontal-news'>
                            <div className='news-item-text'>
                                <p className="category-tag">{posts[4].links ? <Link href={`${posts[4].links}`} title="text">{posts[4].link_title}</Link> : posts[4].link_title}</p>
                                <h3> <Link href={`/news/${posts[4].url}`}> {posts[4].title} </Link> </h3>
                            </div>
                            <figure> <Link href={`/news/${posts[4].url}`}><Newimg news={posts[4]} width='112' height='67' /></Link> </figure>
                        </div>
                    )}
                    {posts[5] && (
                        <div className='news-item horizontal-news'>
                            <div className='news-item-text'>
                                <p className="category-tag">{posts[5].links ? <Link href={`${posts[5].links}`} title="text">{posts[5].link_title}</Link> : posts[5].link_title}</p>
                                <h3> <Link href={`/news/${posts[5].url}`}> {posts[5].title} </Link> </h3>
                            </div>
                            <figure> <Link href={`/news/${posts[5].url}`}><Newimg news={posts[5]} width='112' height='67' /></Link> </figure>
                        </div>
                    )}
                    {posts[6] && (
                        <div className='news-item horizontal-news'>
                            <div className='news-item-text'>
                                <p className="category-tag">{posts[6].links ? <Link href={`${posts[6].links}`} title="text">{posts[6].link_title}</Link> : posts[6].link_title}</p>
                                <h3> <Link href={`/news/${posts[6].url}`}> {posts[6].title} </Link> </h3>
                            </div>
                            <figure> <Link href={`/news/${posts[6].url}`}><Newimg news={posts[6]} width='112' height='67' /></Link> </figure>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
