'use client'
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect, useRef, useCallback } from 'react';

function AlbumThumbnail({ filename, alt }) {
    const src = filename ? `${process.env.NEXT_PUBLIC_IMAGE_URL}/${filename}` : "/uploads/noimg.svg";
    const [imageSrc, setImageSrc] = useState(src);

    return (
        <Image
            src={imageSrc}
            alt={alt}
            width={300}
            height={200}
            loading="lazy"
            onError={() => setImageSrc("/uploads/noimg.svg")}
            unoptimized={process.env.NEXT_PUBLIC_IMAGE_URL.includes('mangalam.cms')}
        />
    );
}

export default function OtherAlbums({ initialAlbums, galleryId, galleryName, currentAlbumId }) {
    const [albums, setAlbums] = useState(initialAlbums || []);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(initialAlbums && initialAlbums.length > 0 ? initialAlbums.length >= 20 : true);
    const observer = useRef();

    const displayAlbums = albums?.filter(a => a.id != currentAlbumId) || [];

    const lastAlbumElementRef = useCallback(node => {
        if (loading) return;
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) {
                setPage(prevPage => prevPage + 1);
            }
        });
        if (node) observer.current.observe(node);
    }, [loading, hasMore]);

    useEffect(() => {
        if (!galleryId) {
            console.warn('OtherAlbums: No galleryId provided');
            return;
        }

        const fetchAlbums = async () => {
            console.log(`OtherAlbums: Fetching for gallery ${galleryId}, offset ${albums.length}`);
            setLoading(true);
            try {
                const currentOffset = albums.length;
                const res = await fetch(`/api/gallery/${galleryId}?limit=20&offset=${currentOffset}`);
                if (res.ok) {
                    const data = await res.json();
                    console.log(`OtherAlbums: Received ${data.albums?.length || 0} albums`);
                    if (data.albums && data.albums.length > 0) {
                        setAlbums(prev => {
                            const newAlbums = data.albums.filter(na => !prev.some(pa => pa.id === na.id));
                            return [...prev, ...newAlbums];
                        });
                        setHasMore(data.albums.length === 20);
                    } else {
                        setHasMore(false);
                    }
                } else {
                    console.error(`OtherAlbums: API error ${res.status}`);
                    setHasMore(false);
                }
            } catch (error) {
                console.error('OtherAlbums: Fetch failed', error);
                setHasMore(false);
            } finally {
                setLoading(false);
            }
        };

        if (page === 1 && albums.length === 0 && hasMore) {
            fetchAlbums();
        } else if (page > 1 && hasMore) {
            fetchAlbums();
        }
    }, [page, galleryId, hasMore]); // Added hasMore to deps

    // Only hide if we are not loading AND have no albums and no more to fetch
    if (!loading && displayAlbums.length === 0 && !hasMore) return null;

    return (
        <div className="other-albums-section">
            <h3 className="other-albums-title text-xl md:text-4xl text-white p-4 mb-6">Other Albums in this Gallery</h3>
            {displayAlbums.length > 0 ? (
                <div className="albums-grid">
                    {displayAlbums.map((album, index) => {
                        const isLastElement = displayAlbums.length === index + 1;
                        const slug = galleryName.toLowerCase().replace(/[^\w\s]/gi, '').replaceAll(' ', '-').replaceAll(/-+/gi, '-');
                        return (
                            <Link
                                key={album.id}
                                href={`/visual-stories/${galleryId}-${slug}?album=${album.id}`}
                                className="album-card"
                                ref={isLastElement ? lastAlbumElementRef : null}
                            >
                                <div className="album-card-image">
                                    <AlbumThumbnail
                                        filename={album.thumbnail}
                                        alt={album.ml_name || album.name}
                                    />
                                </div>
                                <div className="album-card-name">{album.ml_name || album.name}</div>
                            </Link>
                        );
                    })}
                </div>
            ) : !loading && (
                <div className="no-albums">No other albums found in this gallery.</div>
            )}

            {loading && <div className="loading-more">Loading albums...</div>}
            {!hasMore && displayAlbums.length > 0 && <div className="no-more">No more albums to show.</div>}

            <style jsx>{`
                .other-albums-section {                    
                    width: 100%;
                    border-top: none !important;
                    padding: 20px !important;
                    margin-top: 0 !important;
                }
                .other-albums-title {
                    margin-bottom: 40px;
                    margin-top: 20px;
                    font-family: var(--malayalam);
                    color: #fff;
                    text-align: center;
                    font-weight: bold;
                    text-transform: uppercase;
                    letter-spacing: 2px;
                }
                @media (max-width: 768px) {
                    .other-albums-title {
                        margin-bottom: 20px;
                    }
                }
                .albums-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
                    gap: 20px;
                    width: 100%;
                    justify-content: center;
                }
                .album-card {
                    background: #f9f9f9;
                    border-radius: 8px;
                    text-decoration: none;
                    color: #333;
                    transition: transform 0.2s, background 0.2s;
                    border: 1px solid #eee;
                    overflow: hidden;
                    display: flex;
                    flex-direction: column;
                }
                .album-card:hover {
                    background: #f0f0f0;
                    transform: translateY(-2px);
                    border-color: #ddd;
                }
                .album-card-image {
                    width: 100%;
                    aspect-ratio: 16/9;
                    background: #eee;
                    overflow: hidden;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .album-card-image img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }
                .no-image {
                    font-size: 12px;
                    color: #999;
                }
                .album-card-name {
                    padding: 10px;
                    font-size: 14px;
                    font-weight: 500;
                    font-family: var(--malayalam);
                    text-align: center;
                    line-height: 1.4;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    min-height: 50px;
                    color: #fff !important;
                }
                .loading-more, .no-more {
                    text-align: center;
                    padding: 20px;
                    font-size: 14px;
                    color: #666;
                    font-family: var(--malayalam);
                }
            `}</style>
        </div>
    );
}
