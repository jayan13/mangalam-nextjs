// components/YouTubeSlider.js
import { Swiper, SwiperSlide } from 'swiper/react';
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import SwiperCore from 'swiper';
import { Pagination, Navigation } from  "swiper/modules";
import { useRef, useEffect } from 'react';

// install Swiper modules
SwiperCore.use([Pagination, Navigation]);

const SwipeSlider = ({ slidedata }) => {
    const swiperRef = useRef(null);

        const touchstart = () => {
        console.log('touch start');
        const iframes = document.querySelectorAll('.youtube-videos');
        iframes.forEach((iframe) => {
            console.log('touch start iframs');
          iframe.style.pointerEvents = 'auto';
        });
      };
    
      const touchend = () => {
        console.log('touch end');
        const iframes = document.querySelectorAll('.youtube-videos');
        iframes.forEach((iframe) => {
          iframe.style.pointerEvents = 'auto';
        });
      };
      
      const touchmove = () => {
        console.log('touch move');
        const iframes = document.querySelectorAll('.youtube-videos');
        iframes.forEach((iframe) => {
          iframe.style.pointerEvents = 'none';
        });
      }; 
      const handleTouchStart = () => {
        const iframeContainers = document.querySelectorAll('.iframe-container');
        iframeContainers.forEach((container) => {
          container.style.pointerEvents = 'none';
        });
      };
    
      const handleTouchEnd = () => {
        const iframeContainers = document.querySelectorAll('.iframe-container');
        iframeContainers.forEach((container) => {
          container.style.pointerEvents = 'auto';
        });
      };

  return (
    <div className='reel-news-container'>
    <Swiper
        ref={swiperRef}
        spaceBetween={10}
        //slidesPerView={3}
        pagination={{
        clickable: true,
        }}
        navigation={true}      
        className="youtube-shorts-slider"
        touchStartPreventDefault={false}  // Ensures touch interactions are enabled
        allowTouchMove={true}  // This ensures swiping is allowed
        //onTouchStart={handleTouchStart}
        //onSliderMove={handleTouchStart} // Disable pointer events while swiping
        //onTouchEnd={handleTouchEnd} // Re-enable pointer events when the swipe ends
        //onTouchMove={handleTouchStart}
        //onTouchStart={handleTouchStart}
        //onSliderMove={() => console.log('slide move')} // Disable pointer events while swiping
       // onTouchEnd={handleTouchEnd} // Re-enable pointer events when the swipe ends
        //onTouchMove={handleTouchStart}
        style={{ paddingBottom: '20px' }}
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
          <div className="iframe-container">
            <iframe className='youtube-videos'
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
    </div>
  );
};

export default SwipeSlider;
