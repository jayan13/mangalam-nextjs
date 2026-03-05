'use client'
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import SwiperCore from 'swiper';
import { Navigation, Pagination, Autoplay } from "swiper/modules";


SwiperCore.use([Navigation, Pagination, Autoplay]);

export default function GalleryClient({ images, albums, galleryName, galleryId, currentAlbumId }) {
    if (!images || images.length === 0) return <div className="home-news-container">Gallery not found.</div>;

    const currentAlbum = albums?.find(a => a.id == currentAlbumId) || (images.length > 0 ? { name: images[0].album_name, description: images[0].album_description } : null);

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
