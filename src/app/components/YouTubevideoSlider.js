'use client'
// components/YouTubevideoSlider.js
import { useState, useEffect, useRef, useMemo } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import SwiperCore from 'swiper';
import { Pagination, Navigation, Autoplay } from "swiper/modules";
import Image from "next/image";

// install Swiper modules
SwiperCore.use([Pagination, Navigation, Autoplay]);

const YouTubevideoSlider = ({ slidedata }) => {
  const [activeVideoId, setActiveVideoId] = useState(null);
  const swiperRef = useRef(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (activeVideoId) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [activeVideoId]);

  const extractVideoId = (content) => {
    if (!content || typeof content !== 'string') return null;

    // Check if it's already just a raw 11-char video ID format
    let trimmedContent = content.trim();
    if (/^[a-zA-Z0-9_-]{11}$/.test(trimmedContent)) {
      return trimmedContent;
    }

    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?|shorts)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i;
    const match = content.match(regex);
    return match ? match[1] : null;
  };

  const slides = useMemo(() => {
    if (!slidedata || slidedata.length === 0) return [];

    return slidedata
      .map((video, index) => {
        const videoId = extractVideoId(video.news_details);
        if (!videoId) return null;
        return { video, videoId, key: index };
      })
      .filter(Boolean);
  }, [slidedata]);

  const renderSlides = useMemo(() => {
    if (slides.length > 1 && slides.length <= 3) {
      return [...slides, ...slides];
    }
    return slides;
  }, [slides]);

  const canLoop = slides.length > 1;

  useEffect(() => {
    if (!swiperRef.current) return;
    if (!canLoop) return;

    const swiper = swiperRef.current;
    swiper.update();
    if (swiper.params.loop) {
      swiper.loopDestroy();
      swiper.loopCreate();
    }
    swiper.autoplay?.start();
  }, [canLoop, renderSlides.length]);

  if (!mounted) return null;

  return (
    <>
      <Swiper
        spaceBetween={4}
        slidesPerView={1}
        pagination={{ clickable: true }}
        centeredSlides={false} 
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
        }}
       
        autoplay={canLoop ? {
          delay: 3000,
          disableOnInteraction: false,
          stopOnLastSlide: false,
          //pauseOnMouseEnter:true
        } : false}
        loop={canLoop}
        navigation
        touchStartPreventDefault={false}  // Ensures touch interactions are enabled

        allowTouchMove={true}  // This ensures swiping is allowed
        
        style={{ paddingBottom: '20px' }} // Adjust this as needed
        breakpoints={{
          640: {
            slidesPerView: 1, // 1 slide per view on mobile
          },
          768: {
            slidesPerView: 2, // 2 slides per view on tablet
          },
          1024: {
            slidesPerView: 3, // 3 slides per view on desktop
          },
        }}
      >
        {renderSlides.map((slide, idx) => (
          <SwiperSlide key={`${slide.key}-${idx}`}>
            <div className="video-news-item" style={{ marginBottom: 0, padding: 0, border: 'none', background: 'transparent', boxShadow: 'none' }}>
              {(() => {
                const videoId = slide.videoId;
                const video = slide.video;
                

                return (
                  <div
                    className={`embed-container  video-embed thumbnail-container-video`}
                    onClick={() => setActiveVideoId({ id: videoId })}
                    style={{ position: 'relative' }}
                  >
                    <Image
                                src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`}
                                alt={`Thumbnail for ${video.title}`}
                                loading="lazy"
                                width={480}
                                height={360}
                                className="youtube-thumbnail"
                                onError={(e) => { e.target.onerror = null; e.target.src = `https://img.youtube.com/vi/${videoId}/default.jpg`; }}
                              />
                    <div className="play-button-overlay-video">
                      <svg viewBox="0 0 68 48" width="100%" height="100%">
                        <path className="ytp-large-play-button-bg" d="M66.52,7.74c-0.78-2.93-2.49-5.41-5.42-6.19C55.79,.13,34,0,34,0S12.21,.13,6.9,1.55 C3.97,2.33,2.27,4.81,1.48,7.74C0.06,13.05,0,24,0,24s0.06,10.95,1.48,16.26c0.78,2.93,2.49,5.41,5.42,6.19 C12.21,47.87,34,48,34,48s21.79-0.13,27.1-1.55c2.93-0.78,4.64-3.26,5.42-6.19C67.94,34.95,68,24,68,24S67.94,13.05,66.52,7.74z" fill="#212121" fillOpacity="0.8"></path>
                        <path d="M 45,24 27,14 27,34" fill="#fff"></path>
                      </svg>
                    </div>
                    {/* Title Overlay overlaying bottom of thumbnail */}
                    <div style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      width: '100%',
                      background: 'linear-gradient(to top, rgba(0,0,0,0.9), transparent)',
                      padding: '20px 15px 10px',
                      color: 'white',
                      fontFamily: 'var(--malayalam)',
                      fontSize: '1.1rem',
                      lineHeight: '1.3',
                      textShadow: '0 1px 3px rgba(0,0,0,0.8)'
                    }}>
                      {video.title}
                    </div>
                  </div>
                );
              })()}
            </div>
          </SwiperSlide>
        ))
        }
      </Swiper >

      {activeVideoId && (
        <div className="video-modal-overlay" onClick={() => setActiveVideoId(null)} style={{ zIndex: 99999 }}>
          <div className={`video-modal-content `} onClick={(e) => e.stopPropagation()}>
            <button className="video-modal-close" onClick={() => setActiveVideoId(null)}>×</button>
            <iframe
              src={`https://www.youtube.com/embed/${activeVideoId.id}?autoplay=1`}
              title="YouTube Video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      )}
    </>
  )

}


export default YouTubevideoSlider;
