'use client'
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from "next/image";

const CATEGORIES = [
    { id: 19, name: 'Keralam', slug: 'keralam' },
    { id: 20, name: 'India', slug: 'india' },
    { id: 695, name: 'Odd news', slug: 'odd-news' },
    { id: 21, name: 'International', slug: 'international' },
    { id: 100, name: 'Crime', slug: 'crime' },
    { id: 98, name: 'Sunday Mangalam', slug: 'sunday-mangalam' }
];

function Newimg(props) {
    const newsimage = props.news;
    const w = props.width;
    const h = props.height;
    let src = `${process.env.NEXT_PUBLIC_IMAGE_URL}/${newsimage.file_name}`;
    const [imageSrc, setImageSrc] = useState(src);
    return ((newsimage.file_name != null) ? <Image src={imageSrc} alt={newsimage.alt} width={w} height={h} loading="lazy" onError={() => setImageSrc("/uploads/noimg.svg")} unoptimized={process.env.NEXT_PUBLIC_IMAGE_URL.includes('mangalam.cms')} /> : <Image src="/uploads/noimg.svg" alt={newsimage.alt} width={w} height={h} loading="lazy" />);
}

export default function TodaysMangalam() {
    const [activeTab, setActiveTab] = useState(CATEGORIES[0]);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNews = async () => {
            setLoading(true);
            try {
                const res = await fetch(`/api/category?category=${activeTab.id}&limit=7`);
                const data = await res.json();
                if (data.distnewslist && data.distnewslist[0]) {
                    const processedPosts = data.distnewslist[0].map(post => ({
                        ...post,
                        news_details: SubstringWithoutBreakingWords(post.news_details || '', 160)
                    }));
                    setPosts(processedPosts);
                }
            } catch (error) {
                console.error('Error fetching today\'s mangalam news:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchNews();
    }, [activeTab]);

    function SubstringWithoutBreakingWords(str, limit) {
        if (str.length <= limit) return str;
        let substring = str.substring(0, limit);
        if (str[limit] !== ' ' && substring.lastIndexOf(' ') !== -1) {
            substring = substring.substring(0, substring.lastIndexOf(' '));
        }
        return substring;
    }

    return (
        <div className='home-category'>
            <div className="section-heading section-heading-red" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>TODAY'S MANGALAM</span>
                <Link href="/category/86-print-edition.html" style={{ fontSize: 'var(--font-size-s)', color: 'var(--mangalamcerulean)', textTransform: 'none', fontWeight: '400' }}>
                    View All &raquo;
                </Link>
            </div>

            <div className="category-sublinks">
                <ul>
                    {CATEGORIES.map((cat) => (
                        <li key={cat.id} className={activeTab.id === cat.id ? 'active' : ''}>
                            <button
                                onClick={() => setActiveTab(cat)}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    font: 'inherit',
                                    color: activeTab.id === cat.id ? 'var(--mangalamcerulean)' : 'inherit',
                                    fontWeight: activeTab.id === cat.id ? '700' : '400',
                                    padding: '5px 10px'
                                }}
                            >
                                {cat.name}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>

            {loading ? (
                <div className="loading" style={{ height: '400px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>Loading...</div>
            ) : posts.length === 0 ? (
                <div className="no-news" style={{ height: '400px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>No news available for this category.</div>
            ) : (
                <div className="home-category-main" style={{ marginTop: '16px' }}>
                    <div className='home-category-main-left'>
                        <div className='main-one'>
                            {posts[0] && (
                                <div className="news-item">
                                    <div className='news-item-text'>
                                        <p className="category-tag">
                                            <Link href={`/category/${activeTab.id}-${activeTab.slug}.html`}>
                                                {activeTab.name}
                                            </Link>
                                        </p>
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
                                    <p className="category-tag">
                                        <Link href={`/category/${activeTab.id}-${activeTab.slug}.html`}>
                                            {activeTab.name}
                                        </Link>
                                    </p>
                                    <h3> <Link href={`/news/${posts[1].url}`}> {posts[1].title} </Link> </h3>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {!loading && posts.length > 2 && (
                <div className='category-bottom'>
                    <div className='category-bottom-left'>
                        {posts[2] && (
                            <div className="news-item">
                                <figure> <Link href={`/news/${posts[2].url}`}><Newimg news={posts[2]} width='211' height='127' /></Link> </figure>
                                <div className='news-item-text'>
                                    <p className="category-tag">
                                        <Link href={`/category/${activeTab.id}-${activeTab.slug}.html`}>
                                            {activeTab.name}
                                        </Link>
                                    </p>
                                    <h3> <Link href={`/news/${posts[2].url}`}> {posts[2].title} </Link> </h3>
                                </div>
                            </div>
                        )}
                        {posts[3] && (
                            <div className="news-item">
                                <figure> <Link href={`/news/${posts[3].url}`}><Newimg news={posts[3]} width='211' height='127' /></Link> </figure>
                                <div className='news-item-text'>
                                    <p className="category-tag">
                                        <Link href={`/category/${activeTab.id}-${activeTab.slug}.html`}>
                                            {activeTab.name}
                                        </Link>
                                    </p>
                                    <h3> <Link href={`/news/${posts[3].url}`}> {posts[3].title} </Link> </h3>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className='category-bottom-right'>
                        {posts[4] && (
                            <div className='news-item horizontal-news'>
                                <div className='news-item-text'>
                                    <p className="category-tag">
                                        <Link href={`/category/${activeTab.id}-${activeTab.slug}.html`}>
                                            {activeTab.name}
                                        </Link>
                                    </p>
                                    <h3> <Link href={`/news/${posts[4].url}`}> {posts[4].title} </Link> </h3>
                                </div>
                                <figure> <Link href={`/news/${posts[4].url}`}><Newimg news={posts[4]} width='112' height='67' /></Link> </figure>
                            </div>
                        )}
                        {posts[5] && (
                            <div className='news-item horizontal-news'>
                                <div className='news-item-text'>
                                    <p className="category-tag">
                                        <Link href={`/category/${activeTab.id}-${activeTab.slug}.html`}>
                                            {activeTab.name}
                                        </Link>
                                    </p>
                                    <h3> <Link href={`/news/${posts[5].url}`}> {posts[5].title} </Link> </h3>
                                </div>
                                <figure> <Link href={`/news/${posts[5].url}`}><Newimg news={posts[5]} width='112' height='67' /></Link> </figure>
                            </div>
                        )}
                        {posts[6] && (
                            <div className='news-item horizontal-news'>
                                <div className='news-item-text'>
                                    <p className="category-tag">
                                        <Link href={`/category/${activeTab.id}-${activeTab.slug}.html`}>
                                            {activeTab.name}
                                        </Link>
                                    </p>
                                    <h3> <Link href={`/news/${posts[6].url}`}> {posts[6].title} </Link> </h3>
                                </div>
                                <figure> <Link href={`/news/${posts[6].url}`}><Newimg news={posts[6]} width='112' height='67' /></Link> </figure>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {!loading && posts.length > 0 && (
                <div style={{ display: 'flex', justifyContent: 'center', margin: '20px 0' }}>
                    <Link
                        href={`/category/${activeTab.id}-${activeTab.slug}.html`}
                        style={{
                            backgroundColor: 'var(--mangalamcerulean)',
                            color: '#fff',
                            padding: '10px 30px',
                            borderRadius: '5px',
                            fontWeight: '600',
                            textDecoration: 'none'
                        }}
                    >
                        View all {activeTab.name} &raquo;
                    </Link>
                </div>
            )}
        </div>
    );
}
