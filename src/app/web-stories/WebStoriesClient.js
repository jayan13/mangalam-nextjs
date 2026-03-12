'use client'
import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import AlbumSliderOverlay from './AlbumSliderOverlay';

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

export default function WebStoriesClient({ initialAlbums, galleryId, galleryName, initialAlbumId }) {
    const [albums, setAlbums] = useState(initialAlbums || []);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(initialAlbums && initialAlbums.length >= 20);
    const [selectedAlbum, setSelectedAlbum] = useState(null);
    const observer = useRef();

    // Handle initialAlbumId from query params
    useEffect(() => {
        if (initialAlbumId && albums.length > 0) {
            const album = albums.find(a => a.id == initialAlbumId);
            if (album) {
                setSelectedAlbum(album);
            } else {
                // If it's not in the initial list, we still want to open the slider
                // We'll use the ID and fetch the rest in the overlay
                setSelectedAlbum({ id: initialAlbumId, name: galleryName });
            }
        }
    }, [initialAlbumId, albums, galleryName]);

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
        console.log(`WebStoriesClient: galleryId=${galleryId}, initialAlbums=${initialAlbums?.length}, currentAlbums=${albums.length}, page=${page}`);
        
        // If we have initial albums and it's the first page, don't fetch from API
        if (page === 1 && albums.length > 0) {
            return;
        }

        const fetchAlbums = async () => {
            setLoading(true);
            try {
                const offset = (page - 1) * 20;
                const res = await fetch(`/api/photo-gallery?galleryId=${galleryId}&limit=20&offset=${offset}`);
                if (res.ok) {
                    const data = await res.json();
                    if (data && data.length > 0) {
                        setAlbums(prev => {
                            const newAlbums = data.filter(na => !prev.some(pa => pa.id === na.id));
                            return [...prev, ...newAlbums];
                        });
                        setHasMore(data.length === 20);
                    } else {
                        setHasMore(false);
                    }
                }
            } catch (error) {
                console.error('Error fetching albums:', error);
                setHasMore(false);
            } finally {
                setLoading(false);
            }
        };

        fetchAlbums();
    }, [page, galleryId]);

    const handleAlbumClick = (e, album) => {
        e.preventDefault();
        setSelectedAlbum(album);
    };

    return (
        <div className="home-news-container">
            <h1 className="web-stories-title">{galleryName}</h1>
            
            <div className="albums-grid">
                {albums.map((album, index) => {
                    const isLastElement = albums.length === index + 1;
                    return (
                        <div 
                            key={album.id} 
                            className="album-card"
                            ref={isLastElement ? lastAlbumElementRef : null}
                            onClick={(e) => handleAlbumClick(e, album)}
                            style={{ cursor: 'pointer' }}
                        >
                            <div className="album-card-image">
                                <AlbumThumbnail
                                    filename={album.thumbnail}
                                    alt={album.ml_name || album.name}
                                />
                            </div>
                            <div className="album-card-name">{album.ml_name || album.name}</div>
                        </div>
                    );
                })}
            </div>

            {loading && <div className="loading-more">Loading stories...</div>}
            {!hasMore && albums.length > 0 && <div className="no-more">No more stories to show.</div>}

            {selectedAlbum && (
                <AlbumSliderOverlay 
                    albumId={selectedAlbum.id} 
                    albumName={selectedAlbum.ml_name || selectedAlbum.name}
                    onClose={() => setSelectedAlbum(null)} 
                />
            )}

            <style jsx>{`
                .web-stories-title {
                    font-size: 32px;
                    margin: 30px 0;
                    text-align: center;
                    font-family: var(--malayalam);
                    font-weight: bold;
                    color: #333;
                }
                .albums-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
                    gap: 25px;
                    width: 100%;
                    padding: 0 15px;
                    margin-bottom: 50px;
                }
                .album-card {
                    background: #fff;
                    border-radius: 12px;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
                    overflow: hidden;
                    transition: transform 0.3s ease, box-shadow 0.3s ease;
                    border: 1px solid #eee;
                }
                .album-card:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 8px 20px rgba(0,0,0,0.15);
                }
                .album-card-image {
                    width: 100%;
                    aspect-ratio: 9/16;
                    background: #f0f0f0;
                    overflow: hidden;
                }
                :global(.album-card-image img) {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }
                .album-card-name {
                    padding: 15px;
                    font-size: 16px;
                    font-weight: 600;
                    font-family: var(--malayalam);
                    text-align: center;
                    color: #222;
                    line-height: 1.4;
                    min-height: 60px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .loading-more, .no-more {
                    text-align: center;
                    padding: 30px;
                    font-size: 16px;
                    color: #888;
                    font-family: var(--malayalam);
                }
            `}</style>
        </div>
    );
}
