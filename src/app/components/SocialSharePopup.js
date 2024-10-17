'use client'
// components/SocialSharePopup.js
import Image from "next/image";
import React, { useState } from "react";
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

const SocialSharePopup = ({ url, title }) => {
  const [isOpen, setIsOpen] = useState(false);

  const openPopup = () => setIsOpen(true);
  const closePopup = () => setIsOpen(false);

  return (
    <div>
      {/* Share button */}
      <button
        onClick={openPopup}
        style={{
          padding: "0px",
          backgroundColor: "white",
          color: "white",
          cursor: "pointer",
          border:"0px",
        }}
      >
        <Image src="/img/icons/share.svg" width={32} height={32} alt="Share" />
      </button>
      
      {/* Popup Modal */}
      {isOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              padding: "20px",
              borderRadius: "10px",
              boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
              position: "relative",
            }}
          >
            
            <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
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

            {/* Close button */}
            <button
              onClick={closePopup}
              style={{
                position: "absolute",
                top: "10px",
                right: "10px",
                background: "none",
                border: "none",
                fontSize: "20px",
                cursor: "pointer",
              }}
            >
              &times;
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SocialSharePopup;
