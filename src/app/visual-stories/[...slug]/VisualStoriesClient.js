'use client'
import React from 'react';
import ReelSlider from '../../components/ReelSlider';
import OtherAlbums from './OtherAlbums';

export default function VisualStoriesClient({ images, galleryName, galleryId, currentAlbumId }) {
    if (!images || images.length === 0) return (
        <div className="min-h-screen bg-black flex items-center justify-center text-white">
            Story not found.
        </div>
    );

    // Format images for ReelSlider
    const sliderItems = images.map(img => ({
        id: img.id || Math.random().toString(36).substr(2, 9),
        type: 'image',
        src: `${process.env.NEXT_PUBLIC_IMAGE_URL}/${img.image}`,
        title: img.album_name,
        photographer: img.photographer_name,
        description: img.album_description
    }));

    return (
        <div className="w-full bg-black min-h-screen">
            <div className=" px-4 py-8 " >

                <h1 className="text-6xl md:text-9xl font-extrabold text-white mb-8 text-center leading-tight uppercase tracking-tighter m-4">
                    {galleryName}
                </h1>

                <div className="w-full bg-black min-h-auto py-10 ">
                    <ReelSlider items={sliderItems} />
                </div>


                <div className="mt-16 bg-black rounded-xl p-6 md:p-10">
                    <OtherAlbums
                        initialAlbums={[]}
                        galleryId={galleryId}
                        galleryName={galleryName}
                        currentAlbumId={currentAlbumId}
                    />
                </div>
            </div>

            <style jsx>{`
                :global(.other-albums-section) {
                    border-top: none !important;
                    padding: 20px !important;
                    margin-top: 0 !important;
                }
                :global(.other-albums-title) {
                    font-size: 28px !important;
                    margin-bottom: 30px !important;
                    font-weight: bold !important;
                    color: #fff !important;     
                }
                :global(.album-card-name) {
                    color: #fff !important;
                }
                :global(body) {
                    background-color: #000 !important;
                }
                :global(.advertisement) {
                    background-color: #000 !important;
                }
                :global(.main-header) {
                    background-color: #fff !important;
                }                           
            `}</style>
        </div>
    );
}
