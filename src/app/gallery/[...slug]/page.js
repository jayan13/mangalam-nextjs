import GalleryClient from './GalleryClient';

export const revalidate = 360;

async function getGalleryData(galleryId, albumId) {
  try {
    const url = new URL(`${process.env.BASEURL || 'http://localhost:3000'}/api/gallery/${galleryId}`);
    if (albumId) url.searchParams.set('album', albumId);

    const res = await fetch(url.toString(), {
      next: { revalidate: 3600 }
    });
    if (!res.ok) return { images: [], albums: [] };
    return await res.json();
  } catch (error) {
    console.error('Error fetching gallery:', error);
    return { images: [], albums: [] };
  }
}

export default async function GalleryPage({ params, searchParams }) {
  const { slug } = await params;
  const { album } = await searchParams;

  if (!slug || slug.length === 0) return <div className="home-news-container">Gallery not found.</div>;

  const galleryId = slug[0].split('-')[0];
  const { images, albums } = await getGalleryData(galleryId, album);

  if (!images || images.length === 0) return <div className="home-news-container">Gallery not found.</div>;

  const galleryName = images[0]?.gallery_ml_name || images[0]?.gallery_name || "Gallery";

  return <GalleryClient images={images} albums={albums} galleryName={galleryName} galleryId={galleryId} currentAlbumId={album} />;
}
