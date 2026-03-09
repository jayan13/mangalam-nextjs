"use client"

import React, { useState, useRef, useEffect } from 'react';
import { Play, Volume2, VolumeX, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../../lib/utils';

export default function ReelSlider({ items }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(true);
    const [isMuted, setIsMuted] = useState(true);
    const videoRefs = useRef([]);

    const handleNext = () => {
        setCurrentIndex((prev) => (prev === items.length - 1 ? 0 : prev + 1));
    };

    const handlePrev = () => {
        setCurrentIndex((prev) => (prev === 0 ? items.length - 1 : prev - 1));
    };

    const togglePlay = () => {
        setIsPlaying(!isPlaying);
    };

    const toggleMute = () => {
        setIsMuted((prev) => !prev);
    };

    // Handle play/pause state for current video
    useEffect(() => {
        videoRefs.current.forEach((video, index) => {
            if (!video) return;

            if (index === currentIndex) {
                if (isPlaying) {
                    video.play().catch(e => console.log('Autoplay prevented by browser', e));
                } else {
                    video.pause();
                }
            } else {
                video.pause();
                video.currentTime = 0;
            }
        });
    }, [currentIndex, isPlaying]);

    // Handle video ending to auto-advance
    useEffect(() => {
        const currentVideo = videoRefs.current[currentIndex];
        if (!currentVideo) return;

        const handleEnded = () => {
            handleNext();
        };

        currentVideo.addEventListener('ended', handleEnded);
        return () => {
            currentVideo.removeEventListener('ended', handleEnded);
        };
    }, [currentIndex]);

    if (!items || items.length === 0) return null;

    const currentItem = items[currentIndex];
    // Use thumbnail or src for background blur
    const bgImage = currentItem.thumbnail || (currentItem.type === 'image' ? currentItem.src : '');

    return (
        <div className="relative w-full h-[80vh] min-h-[600px] flex items-center justify-center bg-transparent overflow-hidden group ">
            {/* Blurred Background */}
            <div
                className="absolute inset-0 bg-cover bg-center blur-2xl opacity-40 scale-110 transition-all duration-500"
                style={{ backgroundImage: bgImage ? `url(${bgImage})` : 'none' }}
            />

            <div className="absolute inset-0 bg-black/60 pointer-events-none" />

            {/* Navigation Arrows */}
            <button
                onClick={handlePrev}
                className="absolute left-4 md:left-20 z-20 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm transition-colors opacity-0 group-hover:opacity-100"
                aria-label="Previous Reel"
            >
                <ChevronLeft className="w-8 h-8" />
            </button>

            <button
                onClick={handleNext}
                className="absolute right-4 md:right-20 z-20 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm transition-colors opacity-0 group-hover:opacity-100"
                aria-label="Next Reel"
            >
                <ChevronRight className="w-8 h-8" />
            </button>

            {/* Main Content Reel Area (9:16 aspect ratio) */}
            <div className="relative z-10 w-full max-w-[400px] aspect-[9/16] bg-black rounded-xl overflow-hidden shadow-2xl">

                {/* Progress Bars */}
                <div className="absolute top-0 middle-0 right-0 z-30 flex gap-1 p-3">
                    {items.map((_, idx) => (
                        <div key={idx} className="h-1 flex-1 bg-white/30 rounded-full overflow-hidden">
                            <div
                                className={cn(
                                    "h-full bg-white transition-all duration-300",
                                    idx === currentIndex ? "w-full" : idx < currentIndex ? "w-full" : "w-0"
                                )}
                            />
                        </div>
                    ))}
                </div>

                {/* Media Content */}
                <div className="relative w-full h-full">
                    {items.map((item, index) => {
                        const isActive = index === currentIndex;

                        return (
                            <div
                                key={item.id}
                                className={cn(
                                    "absolute inset-0 transition-opacity duration-300",
                                    isActive ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
                                )}
                            >
                                {item.type === 'video' ? (
                                    <video
                                        ref={(el) => {
                                            videoRefs.current[index] = el;
                                        }}
                                        src={item.src}
                                        className="w-full h-full object-cover cursor-pointer"
                                        muted={isMuted}
                                        playsInline
                                        onClick={togglePlay}
                                    />
                                ) : (
                                    <div className="relative w-full h-full cursor-pointer" onClick={togglePlay}>
                                        <img
                                            src={item.src}
                                            alt={item.title || "Reel content"}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                )}

                                {/* Title Overlay */}
                                <div className="absolute bottom-6 left-4 right-16 text-white z-20 pointer-events-none">
                                    {item.title && (
                                        <h3 className="text-xl font-bold drop-shadow-md mb-2">{item.title}</h3>
                                    )}
                                    {item.photographer && (
                                        <p className="text-sm font-medium opacity-90 drop-shadow-sm mb-1">
                                            Photo: <span className="font-bold">{item.photographer}</span>
                                        </p>
                                    )}
                                    {item.description && (
                                        <p className="text-sm leading-relaxed opacity-80 line-clamp-3 drop-shadow-sm bg-black/20 p-2 rounded backdrop-blur-[2px]">
                                            {item.description}
                                        </p>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Controls Overlay - Only for video */}
                {currentItem.type === 'video' && (
                    <div className="absolute bottom-6 right-4 z-30 flex flex-col gap-4">
                        <button
                            onClick={toggleMute}
                            className="p-3 rounded-full bg-black/40 text-white backdrop-blur-md hover:bg-black/60 transition-colors"
                            aria-label={isMuted ? "Unmute" : "Mute"}
                        >
                            {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                        </button>
                    </div>
                )}

                {/* Play Pause Indicator */}
                {!isPlaying && (
                    <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
                        <div className="p-4 rounded-full bg-black/40 text-white backdrop-blur-md transition-opacity duration-300">
                            <Play className="w-12 h-12 fill-white" />
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}
