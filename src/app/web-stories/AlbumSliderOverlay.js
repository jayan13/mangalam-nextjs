'use client'
import { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { X } from 'lucide-react';

export default function AlbumSliderOverlay({ albumId, albumName, onClose }) {
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!albumId) return;

        const fetchImages = async () => {
            setLoading(true);
            try {
                const res = await fetch(`/api/album/${albumId}`);
                if (res.ok) {
                    const data = await res.json();
                    setImages(data.images || []);
                }
            } catch (error) {
                console.error('Error fetching album images:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchImages();
    }, [albumId]);

    // Close on escape key
    useEffect(() => {
        const handleEsc = (event) => {
            if (event.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    if (!albumId) return null;

    return (
        <div className="slider-overlay">
            <div className="overlay-content">
                <button className="close-btn" onClick={onClose}>
                    <X size={32} />
                </button>

                <div className="slider-container">
                    {loading ? (
                        <div className="loading">Loading images...</div>
                    ) : images.length > 0 ? (
                        <Swiper
                            modules={[Navigation, Pagination, Autoplay]}
                            spaceBetween={30}
                            pagination={{ clickable: true }}
                            navigation={true}
                            grabCursor={true}
                            className="overlay-swiper"
                        >
                            {images.map((img, index) => (
                                <SwiperSlide key={index}>
                                    <div className="slide-content">
                                        <div className="image-wrapper">
                                            <img
                                                src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/${img.image}`}
                                                alt={img.album_name}
                                                className="full-image"
                                            />
                                        </div>
                                        <div className="image-info">
                                            <h3>{albumName}</h3>
                                            {img.photographer_name && (
                                                <p className="photographer">Photo: <span>{img.photographer_name}</span></p>
                                            )}
                                            {img.album_description && (
                                                <div className="description">{img.album_description}</div>
                                            )}
                                        </div>
                                    </div>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    ) : (
                        <div className="no-images">No images found for this album.</div>
                    )}
                </div>
            </div>

            <style jsx>{`
                .slider-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.95);
                    z-index: 9999;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }
                .overlay-content {
                    position: relative;
                    width: 95%;
                    height: 95%;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                }
                .close-btn {
                    position: absolute;
                    top: 10px;
                    right: 10px;
                    background: none;
                    border: none;
                    color: #fff;
                    cursor: pointer;
                    z-index: 10001;
                    padding: 10px;
                }
                .slider-container {
                    width: 100%;
                    height: 100%;
                }
                .loading, .no-images {
                    color: #fff;
                    font-size: 20px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 100%;
                    font-family: var(--malayalam);
                }
                .slide-content {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    color: #fff;
                    height: 100%;
                    width: 100%;
                }
                .image-wrapper {
                    flex: 1;
                    width: 100%;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    overflow: hidden;
                }
                .full-image {
                    max-width: 100%;
                    max-height: 80vh;
                    object-fit: contain;
                }
                .image-info {
                    padding: 20px;
                    text-align: center;
                    max-width: 800px;
                }
                .image-info h3 {
                    font-size: 22px;
                    margin-bottom: 10px;
                    font-family: var(--malayalam);
                }
                .photographer {
                    font-size: 14px;
                    color: #ccc;
                    margin-bottom: 10px;
                }
                .photographer span {
                    color: #fff;
                    font-weight: bold;
                }
                .description {
                    font-size: 16px;
                    font-family: var(--malayalam);
                    line-height: 1.6;
                }
                :global(.overlay-swiper) {
                    width: 100%;
                    height: 100%;
                }
                :global(.overlay-swiper .swiper-button-next),
                :global(.overlay-swiper .swiper-button-prev) {
                    color: #fff;
                }
                :global(.overlay-swiper .swiper-pagination-bullet) {
                    background: #fff;
                }
            `}</style>
        </div>
    );
}
