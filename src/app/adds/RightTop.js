
import Link from "next/link";
import Image from "next/image";

export default function RightTop() {
    return (
        <div className="advertisement no-margin" >
          <div className="advertisement-text">Advertisement</div>
          <div className="ad">
            <Link href="https://ksfe.com/" target="_blank"><Image src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/uploads/ads/KSFE-Banner-300-x-250-news.jpg`} alt={'KSFE'} width={300} height={250} loading="lazy" unoptimized={process.env.NEXT_PUBLIC_IMAGE_URL.includes('mangalam.cms')} /></Link>
          </div>
        </div>  
        );
}


