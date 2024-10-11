// components/YouTubeShortsSlider.js
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Pagination, Navigation } from "swiper/modules";

const YouTubeShortsSlider = ({ slidedata }) => {
  return (
    <Swiper
      spaceBetween={10}
      //slidesPerView={3}
      pagination={{
        clickable: true,
      }}
      navigation={true}
      modules={[Pagination, Navigation]}
      className="youtube-shorts-slider"
      touchStartPreventDefault={false}  // Ensures touch interactions are enabled
    allowTouchMove={true}  // This ensures swiping is allowed
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
      {slidedata.map((video, index) => (
        <SwiperSlide key={index}>
          <div className="video-container">
            <iframe
              width="410"
              height="720"
              src={video.news_details}
              title={video.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default YouTubeShortsSlider;
