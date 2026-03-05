'use client'
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import SwiperCore from 'swiper';
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { useState, useEffect, useRef, useCallback } from 'react';

SwiperCore.use([Navigation, Pagination, Autoplay]);

export default function GalleryClient({ images, albums: initialAlbums, galleryName, galleryId, currentAlbumId }) {
    const [albums, setAlbums] = useState(initialAlbums || []);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(initialAlbums?.length >= 20);
    const observer = useRef();

    if (!images || images.length === 0) return <div className="home-news-container">Gallery not found.</div>;

    const currentAlbum = albums?.find(a => a.id == currentAlbumId) || (images.length > 0 ? { name: images[0].album_name, description: images[0].album_description } : null);
    const displayAlbums = albums?.filter(a => a.id != (currentAlbumId || images[0]?.album_id)) || [];

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
        if (page === 1) return;

        const fetchMoreAlbums = async () => {
            setLoading(true);
            try {
                const res = await fetch(`/api/gallery/${galleryId}?type=albums&limit=20&offset=${page * 20}`);
                if (res.ok) {
                    const data = await res.json();
                    if (data.albums && data.albums.length > 0) {
                        setAlbums(prev => [...prev, ...data.albums]);
                        setHasMore(data.albums.length === 20);
                    } else {
                        setHasMore(false);
                    }
                }
            } catch (error) {
                console.error('Error fetching more albums:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchMoreAlbums();
    }, [page, galleryId]);

    return (
        <div className="home-news-container">
            <div className="gallery-detail-section">
                <h1 className="gallery-title">{galleryName}</h1>

                {currentAlbum && (
                    <div className="album-info">
                        <h2 className="album-name">{currentAlbum.name}</h2>
                    </div>
                )}

                <div className="gallery-slider-container">
                    <Swiper
                        spaceBetween={30}
                        pagination={{ clickable: true }}
                        navigation={true}
                        className="gallery-slider"
                    >
                        {images.map((img, index) => (
                            <SwiperSlide key={index}>
                                <div className="gallery-slide-content">
                                    <div className="gallery-image-wrapper">
                                        <img
                                            src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/${img.image}`}
                                            alt={img.image_title || img.album_name || galleryName}
                                            className="gallery-full-image"
                                            style={{
                                                maxWidth: '100%',
                                                maxHeight: '100%',
                                                width: 'auto',
                                                height: 'auto',
                                                objectFit: 'contain'
                                            }}
                                        />
                                    </div>
                                    <div className="gallery-image-info">
                                        {img.photographer_name && (
                                            <p className="photographer">Photo: <span>{img.photographer_name}</span></p>
                                        )}
                                        {img.album_description && (
                                            <div className="gallery-image-description">
                                                {img.album_description}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>

                {displayAlbums.length > 0 && (
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
                    </div>
                )}
            </div>

            <style jsx>{`
        .gallery-detail-section {
          padding: 20px 0;
          width: 100%;
          overflow: hidden;
        }
        .gallery-title {
          font-size: 28px;
          margin-bottom: 20px;
          text-align: center;
          font-family: var(--malayalam);
          color: #333;
        }
        .album-info {
          text-align: center;
          margin-bottom: 20px;
        }
        .album-name {
          font-size: 20px;
          color: #666;
          font-family: var(--malayalam);
        }
        .gallery-slider-container {
          background: #000;
          padding: 20px;
          border-radius: 8px;
          width: 100%;
          overflow: hidden;
          margin-bottom: 40px;
        }
        .gallery-slide-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          color: #fff;
          width: 100%;
        }
        .gallery-image-wrapper {
          width: 100%;
          height: 60vh;
          display: flex;
          justify-content: center;
          align-items: center;
          background: #000;
        }
        @media (min-width: 768px) {
          .gallery-image-wrapper {
            height: 80vh;
          }
        }
        .gallery-full-image {
          display: block;
        }
        .gallery-image-info {
          padding: 20px;
          text-align: center;
          max-width: 800px;
        }
        .image-title {
          font-size: 22px;
          margin-bottom: 10px;
          font-family: var(--malayalam);
        }
        .photographer {
          font-size: 14px;
          color: #ccc;
          margin-bottom: 15px;
        }
        .photographer span {
          color: #fff;
          font-weight: bold;
        }
        .gallery-image-description {
          font-size: 16px;
          font-family: var(--malayalam);
          line-height: 1.6;
        }
        .other-albums-section {
          margin-top: 40px;
          border-top: 1px solid #eee;
          padding-top: 30px;
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
        :global(.gallery-slider) {
          width: 100%;
          height: auto;
        }
        :global(.gallery-slider .swiper-button-next),
        :global(.gallery-slider .swiper-button-prev) {
          color: #fff;
        }
        :global(.gallery-slider .swiper-pagination-bullet) {
          background: #fff;
        }
      `}</style>
        </div>
    );
}
