'use client'
import { Swiper, SwiperSlide } from 'swiper/react';
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import SwiperCore from 'swiper';
import { Navigation, Autoplay } from "swiper/modules";
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

SwiperCore.use([Navigation, Autoplay]);

const PhotoGallery = () => {
    const [albums, setAlbums] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAlbums = async () => {
            try {
                const res = await fetch('/api/photo-gallery?promoted=true&limit=10');
                const data = await res.json();
                setAlbums(data);
            } catch (error) {
                console.error('Error fetching photo gallery:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchAlbums();
    }, []);

    if (loading || albums.length === 0) return null;

    return (
        <div className="reel-news gallery-section">
            <div className="section-heading section-heading-red">PHOTO GALLERY</div>
            <div className="reel-news-container">
                <Swiper
                    spaceBetween={10}
                    slidesPerView={1}
                    navigation={true}
                    grabCursor={true}
                    loop={true}
                    autoplay={{
                        delay: 4000,
                        disableOnInteraction: false,
                    }}
                    breakpoints={{
                        640: { slidesPerView: 2 },
                        768: { slidesPerView: 2 },
                        1024: { slidesPerView: 3 },
                    }}
                    className="reel-slides"
                >
                    {albums.map((album) => (
                        <SwiperSlide key={album.album_id}>
                            <Link href={album.url} className="reel-link" target="_blank">
                                <div className="reel-continer">
                                    <div className="reel-items story gallery-item">
                                        <Image
                                            src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/${album.image}`}
                                            alt={album.album_name}
                                            width={200}
                                            height={300}
                                            className="reel-image"
                                            unoptimized={true}
                                        />
                                        <div className="gallery-tag">{album.gallery_name}</div>
                                        <div className="reel-text line-clamp-2">{album.album_name}</div>
                                    </div>
                                </div>
                            </Link>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
            <style jsx>{`
                .gallery-section {
                    margin-top: 20px;
                }
                .gallery-item {
                    position: relative;
                }
                .gallery-tag {
                    position: absolute;
                    top: 10px;
                    left: 10px;
                    background: rgba(231, 25, 43, 0.8);
                    color: #fff;
                    padding: 2px 8px;
                    font-size: 10px;
                    font-weight: bold;
                    text-transform: uppercase;
                    border-radius: 4px;
                    z-index: 2;
                }
                .line-clamp-2 {
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }
            `}</style>
        </div>
    );
};

export default PhotoGallery;
