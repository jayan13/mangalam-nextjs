'use client'
import { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import SwiperCore from 'swiper';
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import Image from 'next/image';
import { use } from 'react';

SwiperCore.use([Navigation, Pagination, Autoplay]);

export default function GalleryPage({ params }) {
  const { slug } = use(params);
  const galleryId = slug[0].split('-')[0];
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const res = await fetch(`/api/gallery/${galleryId}`);
        const data = await res.json();
        setImages(data);
      } catch (error) {
        console.error('Error fetching gallery:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchGallery();
  }, [galleryId]);

  if (loading) return <div className="home-news-container"><div className="loading-gallery">Loading Gallery...</div></div>;
  if (!images || images.length === 0) return <div className="home-news-container">Gallery not found.</div>;

  const galleryName = images[0]?.gallery_name || "Gallery";

  return (
    <div className="home-news-container">
      <div className="gallery-detail-section">
        <h1 className="gallery-title">{galleryName}</h1>

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
                    <Image
                      src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/${img.image}`}
                      alt={img.album_name || galleryName}
                      width={1200}
                      height={800}
                      className="gallery-full-image"
                      unoptimized={true}
                    />
                  </div>
                  {img.description && (
                    <div className="gallery-image-description">
                      {img.description}
                    </div>
                  )}
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
        }
        .gallery-slider-container {
          background: #000;
          padding: 20px;
          border-radius: 8px;
          width: 100%;
          overflow: hidden;
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
          max-height: 75vh;
          display: flex;
          justify-content: center;
          overflow: hidden;
        }
        .gallery-full-image {
          max-width: 100%;
          height: auto;
          max-height: 75vh;
          object-fit: contain;
        }
        .gallery-image-description {
          padding: 20px;
          font-size: 16px;
          font-family: var(--malayalam);
          text-align: center;
          max-width: 800px;
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
        .loading-gallery {
          padding: 50px;
          text-align: center;
          font-size: 20px;
        }
      `}</style>
    </div>
  );
}
