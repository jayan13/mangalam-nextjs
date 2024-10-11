'use client';

import Slider from 'react-slick';


export default function SlickSlider({ slidedata }) {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,   // Show 3 slides by default
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    pauseOnHover:false,
    pauseOnFocus:false,
    responsive: [
        {
          breakpoint: 768,
          settings: {
            arrows: false,
            centerMode: true,
            slidesToShow: 3
          }
        },
        {
          breakpoint: 480,
          settings: {
            arrows: false,
            centerMode: true,
            slidesToShow: 1
          }
        }
      ]
  };

  return (
    <div className='reel-news-container'>
      <Slider {...settings}>
        {slidedata.map((url, index) => (
          <div key={index}>
            <iframe
              width="330"
              height="600"
              src={url.news_details}
              title={`YouTube video player ${url.title}`}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        ))}
      </Slider>
    </div>
  );
};




/*
'use client'
import Image from "next/image";
export default function SlickSlider({ slidedata }) {

  return (
    <div className="reel-news-container">
     <ul className="reel-slides">
        {slidedata.map((post,index) => (
        <li key={index}>
            <div className="reel-continer">
              <div className="reel-items story" >
              <Image src="/img/reel-3.webp" width={292} height={518} class="reel-image" alt="news image" />
                <div className="reel-text">{post.title}</div>   
              </div>
                   
            </div>
        </li>
       ))};
      
    </ul>
    
    </div>
  );
};

*/

    