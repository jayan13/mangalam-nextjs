'use client'
import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import ReelSlider from '../components/ReelSlider';

export default function AlbumSliderOverlay({ albumId, albumName, onClose }) {
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!albumId) return;

        const fetchImages = async () => {
            setLoading(true);
            try {
                const res = await fetch(`/api/album/${albumId}`);
                if (res.ok) {
                    const data = await res.json();
                    setImages(data.images || []);
                }
            } catch (error) {
                console.error('Error fetching album images:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchImages();
    }, [albumId]);

    // Close on escape key
    useEffect(() => {
        const handleEsc = (event) => {
            if (event.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    if (!albumId) return null;

    const sliderItems = images.map(img => ({
        id: img.id || Math.random().toString(36).substr(2, 9),
        type: 'image',
        src: `${process.env.NEXT_PUBLIC_IMAGE_URL}/${img.image}`,
        title: albumName,
        photographer: img.photographer_name,
        description: img.album_description
    }));

    return (
        <div className="slider-overlay">
            <div className="overlay-content">
                <button className="close-btn" onClick={onClose}>
                    <X size={32} />
                </button>

                <div className="slider-container">
                    {loading ? (
                        <div className="loading">Loading images...</div>
                    ) : images.length > 0 ? (
                        <ReelSlider items={sliderItems} />
                    ) : (
                        <div className="no-images">No images found for this album.</div>
                    )}
                </div>
            </div>

            <style jsx>{`
                .slider-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.95);
                    z-index: 9999;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }
                .overlay-content {
                    position: relative;
                    width: 95%;
                    height: 95%;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                }
                .close-btn {
                    position: absolute;
                    top: 10px;
                    right: 10px;
                    background: rgba(0, 0, 0, 0.5);
                    border: none;
                    border-radius: 50%;
                    color: #fff;
                    cursor: pointer;
                    z-index: 10001;
                    padding: 10px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    transition: background 0.2s ease;
                }
                .close-btn:hover {
                    background: rgba(0, 0, 0, 0.8);
                }
                .slider-container {
                    width: 100%;
                    height: 100%;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }
                .loading, .no-images {
                    color: #fff;
                    font-size: 20px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 100%;
                    font-family: var(--malayalam);
                }
            `}</style>
        </div>
    );
}
