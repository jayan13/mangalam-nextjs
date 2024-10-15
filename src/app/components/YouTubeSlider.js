// components/YouTubeSlider.js
import { Swiper, SwiperSlide } from 'swiper/react';
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import SwiperCore from 'swiper';
import { Pagination, Navigation,Autoplay } from  "swiper/modules";
import YouTube from 'react-youtube';
import { useRef,useEffect,useState} from 'react';
// install Swiper modules
SwiperCore.use([Pagination, Navigation, Autoplay]);

const YouTubeSlider = ({ slidedata }) => {

  const youtubeRefs = useRef([]);
  const swiperRef = useRef(null);
  const [allVideosReady, setAllVideosReady] = useState(false);

  const onSlideChange = (swiper) => {
    // Pause all videos except for the active slide
    youtubeRefs.current.forEach((player, index) => {
      if (player && index !== swiper.activeIndex) {
        player.pauseVideo();
      }
    });
  };

  const onPlayerReady = (event, index) => {
    // Store the YouTube player reference
    youtubeRefs.current[index] = event.target;

    // Check if all videos are ready
    if (youtubeRefs.current.filter(Boolean).length === slidedata.length) {
      setAllVideosReady(true); // All videos are ready
    }
  };

  const onPlayerStateChange = (event, swiper) => {
    // Check if the video is playing
    if (event.data === 1) {
      // Video is playing, stop Swiper autoplay
      if (swiper.autoplay) swiper.autoplay.stop();
    } else if (event.data === 2 || event.data === 0) {
      // Video is paused or ended, resume Swiper autoplay
      if (swiper.autoplay) swiper.autoplay.start();
    }
  };
  
  const opts = {
    height: '600',
    width: '310',
    playerVars: {
      autoplay: 0,
    },
  };

  useEffect(() => {
    // Delay autoplay by 10 seconds after all slides are ready
    if (allVideosReady && swiperRef.current) {
      setTimeout(() => {
        swiperRef.current.autoplay.start();
      }, 3000); // 10 seconds delay
    }
  }, [allVideosReady]);

  return (
    <div className='reel-news-container'>
      <Swiper
        spaceBetween={4}
        pagination={{ clickable: true }}
        //centeredSlides={true}
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
          swiper.autoplay.stop(); // Initially stop autoplay
        }}
        autoplay={{
          delay: 2000,
          disableOnInteraction: false,
          //pauseOnMouseEnter:true
        }}
        loop={true}        
        navigation
        touchStartPreventDefault={false}  // Ensures touch interactions are enabled

        allowTouchMove={true}  // This ensures swiping is allowed
        //onSlideChange={() => console.log('slide changed')}
        onSlideChange={onSlideChange}
        //onSwiper={(swiper) => console.log(swiper)}
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
        {slidedata.map((video,index) => (
          <SwiperSlide key={video.news_details}>
            <YouTube videoId={video.news_details} opts={opts} onReady={(event) => onPlayerReady(event, index)} onStateChange={(event) => onPlayerStateChange(event, swiperRef.current)} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default YouTubeSlider;
