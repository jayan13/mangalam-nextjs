"use client";
import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from "next/image";

function Newimg(props) {
  const newsimage = props.news;
  const w = props.width;
  const h = props.height;
  let src = `${process.env.NEXT_PUBLIC_IMAGE_URL}/${newsimage.file_name}`;
  
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setHasError(false);
  }, [src]);

  const displaySrc = hasError ? "/uploads/noimg.svg" : src;

  return ((newsimage.file_name != null) ? <Image src={displaySrc} alt={newsimage.alt} width={w} height={h} loading="lazy" onError={() => setHasError(true)} unoptimized={process.env.NEXT_PUBLIC_IMAGE_URL?.includes('mangalam.cms')} /> : <Image src="/uploads/noimg.svg" alt={newsimage.alt} width={w} height={h} loading="lazy" />);
}

export default function LeadPage({ leadItems: initialLeadItems = [] }) {
  const scrollContainerRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startY, setStartY] = useState(0);
  const [scrollTop, setScrollTop] = useState(0);
  const [leadItems, setLeadItems] = useState(Array.isArray(initialLeadItems) ? initialLeadItems : []);
  const [liveUpdates, setLiveUpdates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const display_from = leadItems[0]?.display_from || 0;
  const onMouseDown = (e) => {
    if (!scrollContainerRef.current) return;
    setIsDragging(true);
    setStartY(e.pageY - scrollContainerRef.current.offsetTop);
    setScrollTop(scrollContainerRef.current.scrollTop);
  };

  const onMouseLeave = () => {
    setIsDragging(false);
  };

  const onMouseUp = () => {
    setIsDragging(false);
  };

  const onMouseMove = (e) => {
    if (!isDragging || !scrollContainerRef.current) return;
    e.preventDefault();
    const y = e.pageY - scrollContainerRef.current.offsetTop;
    const scrollDelta = (y - startY) * 1.5;
    scrollContainerRef.current.scrollTop = scrollTop - scrollDelta;
  };

  useEffect(() => {
    let isMounted = true;
    let intervalId;
    const loadLiveUpdates = async () => {
      try {
        const res = await fetch(`/api/live-updates?displayfrom=${display_from}`, { next: { revalidate: 60 } });
        const data = await res.json();
        if (!isMounted) return;
        if (!leadItems.length && Array.isArray(data.lead)) {
          setLeadItems(data.lead);
        }
        setLiveUpdates(Array.isArray(data.updates) ? data.updates : []);
      } catch (error) {
        console.error('Error loading live updates:', error);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };
    loadLiveUpdates();
    intervalId = setInterval(loadLiveUpdates, 120000);
    return () => {
      isMounted = false;
      if (intervalId) clearInterval(intervalId);
    };
  }, [display_from]);

  
  const formatAbsolute = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    if (Number.isNaN(d.getTime())) return '';
    return d.toLocaleString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
      timeZone: 'Asia/Kolkata',
    });
  };

  const formatRelative = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    if (Number.isNaN(d.getTime())) return '';
    const diffMs = Date.now() - d.getTime();
    const diffMins = Math.max(1, Math.floor(diffMs / 60000));
    if (diffMins < 60) return `${diffMins} Minutes Ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} Hours Ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} Days Ago`;
  };

  return (
    <div className="lead-page-container">
      <div className="lead-section">
        <h2 className="section-title">{leadItems?.[0]?.heading}</h2>

        <div className="main-lead-article">
           {leadItems[0] && (
              <div className="main-lead-article">
                <figure> <Link href={`/news/${leadItems[0].url}`}><Newimg news={leadItems[0]} width='608' height='365' /></Link></figure>                
                <h1 className="malayalam-text"> <Link href={`/news/${leadItems[0].url}`}>  {leadItems[0].title} </Link></h1>                 
                <p>{leadItems[0].news_details}</p>
              </div>
            )}
        </div>

        <div className="sub-leads">
          {leadItems[1] && (
            <div  className="sub-lead-item">
              <figure>
                  <figure> {leadItems[1].url ? <Link href={`/news/${leadItems[1].url}`}><Newimg news={leadItems[1]} width='292' height='174' /></Link> : <Newimg news={leadItems[1]} width='292' height='174' />} </figure>
                
              </figure>
              <h3 className="malayalam-text">
                <Link href={`/news/${leadItems[1].url}`}>
                  {leadItems[1].title}
                </Link>
              </h3>
            </div>
            )}
            {leadItems[2] && (
            <div  className="sub-lead-item">
              <figure>                
                  <figure> {leadItems[2].url ? <Link href={`/news/${leadItems[2].url}`}><Newimg news={leadItems[2]} width='292' height='174' /></Link> : <Newimg news={leadItems[2]} width='292' height='174' />} </figure>
              </figure>
              <h3 className="malayalam-text">
                <Link href={`/news/${leadItems[2].url}`}>
                  {leadItems[2].title}
                </Link>
              </h3>
            </div>
            )}
        </div>
      </div>

      <div className="live-updates-section">
        <div className="live-updates-header">Live Updates</div>

        <div
          className="live-updates-scroll-area"
          ref={scrollContainerRef}
          onMouseDown={onMouseDown}
          onMouseLeave={onMouseLeave}
          onMouseUp={onMouseUp}
          onMouseMove={onMouseMove}
        >
          {isLoading && (
            <div className="live-update-card">
              <div className="update-time-relative">Loading...</div>
              <div className="update-time-absolute"></div>
              <div className="update-content">
                <h3 className="malayalam-text">Please wait</h3>
                <p className="malayalam-text"></p>
              </div>
            </div>
          )}

          {!isLoading && liveUpdates.length === 0 && (
            <div className="live-update-card">
              <div className="update-time-relative">No updates</div>
              <div className="update-time-absolute"></div>
              <div className="update-content">
                <h3 className="malayalam-text">No live updates available</h3>
                <p className="malayalam-text"></p>
              </div>
            </div>
          )}

          {liveUpdates.map((item) => (
            <div key={item.id} className="live-update-card">
              <div className="update-time-relative">{formatRelative(item.modified_date)}</div>
              <div className="update-time-absolute">{formatAbsolute(item.modified_date)}</div>

              <div className="update-content">
                <h3 className="news-item-text">                  
                    {item.title}                 
                </h3>                
              </div>

              
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
