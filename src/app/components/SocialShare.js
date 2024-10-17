'use client'
// components/SocialShare.js
import Image from "next/image";

import {
    FacebookShareButton,
    TwitterShareButton,
    LinkedinShareButton,
    WhatsappShareButton,
  } from "react-share";
  import {
    FacebookIcon,
    TwitterIcon,
    LinkedinIcon,
    WhatsappIcon,
  } from "react-share";
  
  const SocialShare = ({ url, title }) => {
    return (
      <div className="social-share">
        <FacebookShareButton url={url} quote={title}>
          <FacebookIcon size={32} round />
        </FacebookShareButton>
  
        <TwitterShareButton url={url} title={title}>          
          <Image src={'/img/icons/x-logo.svg'} width={32} alt="x" height={32} />
        </TwitterShareButton>
  
        <LinkedinShareButton url={url} title={title}>
          <LinkedinIcon size={32} round />
        </LinkedinShareButton>
  
        <WhatsappShareButton url={url} title={title}>
          <WhatsappIcon size={32} round />
        </WhatsappShareButton>
      </div>
    );
  };
  
  export default SocialShare;
  