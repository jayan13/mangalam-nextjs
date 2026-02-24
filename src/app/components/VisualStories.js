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

const VisualStories = () => {
    const [stories, setStories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStories = async () => {
            try {
                const res = await fetch('/api/visual-stories');
                const data = await res.json();
                setStories(data);
            } catch (error) {
                console.error('Error fetching visual stories:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchStories();
    }, []);

    if (loading || stories.length === 0) return null;

    return (
        <div className="reel-news">
            <div className="section-heading section-heading-blue">VISUAL STORIES</div>
            <div className="reel-news-container">
                <Swiper
                    spaceBetween={10}
                    slidesPerView={1}
                    navigation={true}
                    loop={true}
                    autoplay={{
                        delay: 3000,
                        disableOnInteraction: false,
                    }}
                    breakpoints={{
                        640: { slidesPerView: 2 },
                        768: { slidesPerView: 2 },
                        1024: { slidesPerView: 3 },
                    }}
                    className="reel-slides"
                >
                    {stories.map((story) => (
                        <SwiperSlide key={story.gallery_id}>
                            <Link href={story.url} className="reel-link">
                                <div className="reel-continer">
                                    <div className="reel-items story">
                                        <Image
                                            src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/${story.image}`}
                                            alt={story.name}
                                            width={200}
                                            height={300}
                                            className="reel-image"
                                            unoptimized={true}
                                        />
                                        <div className="reel-text">{story.name}</div>
                                    </div>
                                </div>
                            </Link>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </div>
    );
};

export default VisualStories;
