'use client'
import Link from 'next/link';
import { useState, useEffect, useRef, useCallback } from 'react';

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
        const fetchAlbums = async () => {
            console.log('fetchAlbums initiated', { galleryId, albumsLength: albums.length, hasMore });
            if (!hasMore && albums.length > 0) return;

            setLoading(true);
            try {
                const currentOffset = albums.length;
                const url = `/api/gallery/${galleryId}?limit=20&offset=${currentOffset}`;
                console.log('Fetching albums from:', url);
                const res = await fetch(url);
                if (res.ok) {
                    const data = await res.json();
                    console.log('Received albums data:', data);
                    if (data.albums && data.albums.length > 0) {
                        setAlbums(prev => {
                            // Filter out duplicates just in case
                            const newAlbums = data.albums.filter(newAlbum => !prev.some(oldAlbum => oldAlbum.id === newAlbum.id));
                            return [...prev, ...newAlbums];
                        });
                        setHasMore(data.albums.length === 20);
                    } else {
                        setHasMore(false);
                    }
                }
            } catch (error) {
                console.error('Error fetching albums:', error);
            } finally {
                setLoading(false);
            }
        };

        if (page === 1 && albums.length === 0) {
            fetchAlbums();
        } else if (page > 1) {
            fetchAlbums();
        }
    }, [page, galleryId]);

    if (displayAlbums.length === 0 && !loading) return null;

    return (
        <div className="other-albums-section">
            <h3 className="other-albums-title">Other Albums in this Gallery</h3>
            <div className="albums-grid">
                {displayAlbums.map((album, index) => {
                    const isLastElement = displayAlbums.length === index + 1;
                    const slug = galleryName.toLowerCase().replace(/[^\w\s]/gi, '').replaceAll(' ', '-').replaceAll(/-+/gi, '-');
                    return (
                        <Link
                            key={album.id}
                            href={`/gallery/${galleryId}-${slug}?album=${album.id}`}
                            className="album-card"
                            ref={isLastElement ? lastAlbumElementRef : null}
                        >
                            <div className="album-card-image">
                                {album.thumbnail ? (
                                    <img
                                        src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/${album.thumbnail}`}
                                        alt={album.ml_name || album.name}
                                    />
                                ) : (
                                    <div className="no-image">No Image</div>
                                )}
                            </div>
                            <div className="album-card-name">{album.ml_name || album.name}</div>
                        </Link>
                    );
                })}
            </div>
            {loading && <div className="loading-more">Loading more albums...</div>}
            {!hasMore && displayAlbums.length > 0 && <div className="no-more">No more albums to show.</div>}

            <style jsx>{`
                .other-albums-section {
                    margin-top: 40px;
                    border-top: 1px solid #eee;
                    padding-top: 30px;
                    width: 100%;
                }
                .other-albums-title {
                    font-size: 22px;
                    margin-bottom: 20px;
                    font-family: var(--malayalam);
                    color: #333;
                }
                .albums-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
                    gap: 20px;
                    width: 100%;
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
