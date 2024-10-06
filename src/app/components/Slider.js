'use client'
import { Swiper, SwiperSlide } from 'swiper/react';
//import '../../../node_modules/swiper/swiper-bundle.min.css';

//import SwiperCore, { Autoplay, Pagination, Navigation } from 'swiper';
//SwiperCore.use([Autoplay, Pagination, Navigation]);
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import 'swiper/css/autoplay';

export default function Slider({ slidedata }) {
    //const [posts, setPosts] = useState({slidedata});
    return (
    <div className="reel-news-container">
         <Swiper
      slidesPerView={3}
      spaceBetween={20}
      loop={true}
      centeredSlides={true}
      autoplay={{
        delay: 4000,
        disableOnInteraction: false,
      }}
      navigation={true} // Enable navigation arrows
      pagination={{ clickable: true }} // Enable pagination dots
      grabCursor={true} // Enable grab cursor
    >
        {slidedata.map((post,index) => (
            <SwiperSlide key={index}>
            <div className="embed-slide" dangerouslySetInnerHTML={{ __html: post.news_details }}></div>            
            </SwiperSlide>
        ))};
        </Swiper>
    </div>
    )
}