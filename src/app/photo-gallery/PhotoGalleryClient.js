'use client'
import { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import AlbumSliderOverlay from '../web-stories/AlbumSliderOverlay';

export default function PhotoGalleryClient({ initialAlbums, galleryId = null, initialAlbumId = null }) {
    const [albums, setAlbums] = useState(initialAlbums || []);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(initialAlbums && initialAlbums.length >= 20);
    const [selectedAlbum, setSelectedAlbum] = useState(null);
    const observer = useRef();

    // Handle initialAlbumId from query params
    useEffect(() => {
        if (initialAlbumId && albums.length > 0) {
            const album = albums.find(a => (a.album_id || a.id) == initialAlbumId);
            if (album) {
                setSelectedAlbum({
                    id: album.album_id || album.id,
                    name: album.album_name || album.name
                });
            } else if (galleryId) {
                // If it's not in the initial list, we still want to open it
                setSelectedAlbum({ id: initialAlbumId, name: "Gallery Album" });
            }
        }
    }, [initialAlbumId, albums, galleryId]);

    const lastAlbumElementRef = useCallback(node => {
        if (loading) return;
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) {
                setPage(prevPage => prevPage + 1);
            }
        });
        if (node) observer.current.observe(node);
    }, [loading, hasMore]);

    useEffect(() => {
        if (page === 1) return;

        const fetchAlbums = async () => {
            setLoading(true);
            try {
                const url = galleryId
                    ? `/api/photo-gallery?galleryId=${galleryId}&limit=20&offset=${page * 20}`
                    : `/api/photo-gallery?limit=20&offset=${page * 20}`;

                const res = await fetch(url);
                if (res.ok) {
                    const newAlbums = await res.json();
                    setAlbums(prev => [...prev, ...newAlbums]);
                    setHasMore(newAlbums.length >= 20);
                }
            } catch (error) {
                console.error('Error fetching more albums:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchAlbums();
    }, [page, galleryId]);

    const handleAlbumClick = (album) => {
        setSelectedAlbum({
            id: album.album_id || album.id,
            name: album.album_name || album.name
        });
    };

    return (
        <div className="photo-gallery-client">
            <div className="album-grid">
                {albums.map((album, index) => (
                    <div
                        key={`${album.album_id || album.id}-${index}`}
                        className="album-card"
                        onClick={() => handleAlbumClick(album)}
                        ref={index === albums.length - 1 ? lastAlbumElementRef : null}
                    >
                        <div className="thumbnail-container">
                            <Image
                                src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/${album.image || album.thumbnail}`}
                                alt={album.album_name || album.name}
                                width={400}
                                height={300}
                                className="album-thumbnail"
                                unoptimized={process.env.NEXT_PUBLIC_IMAGE_URL.includes('mangalam.cms')}
                            />
                            {album.gallery_name && (
                                <span className="gallery-badge">{album.gallery_name}</span>
                            )}
                        </div>
                        <div className="album-info">
                            <h3 className="album-name">{album.album_name || album.name}</h3>
                        </div>
                    </div>
                ))}
            </div>

            {loading && <div className="loading-text">Loading more albums...</div>}

            {!hasMore && albums.length > 0 && (
                <div className="end-text">You've reached the end.</div>
            )}

            {selectedAlbum && (
                <AlbumSliderOverlay
                    albumId={selectedAlbum.id}
                    albumName={selectedAlbum.name}
                    onClose={() => setSelectedAlbum(null)}
                />
            )}
        </div>
    );
}
