import ReelSlider from '../components/ReelSlider';

export const metadata = {
    title: 'Reels - Mangalam',
    description: 'Short video reels and featured stories',
};

// Dummy data using open sources
const dummyReels = [
    {
        id: "reel-1",
        type: "video",
        // 9:16 vertical video placeholder
        src: "https://www.w3schools.com/html/mov_bbb.mp4",
        title: "Big Buck Bunny Feature",
        thumbnail: "https://images.unsplash.com/photo-1542204165-65bf26472b9b?q=80&w=400&auto=format&fit=crop"
    },
    {
        id: "reel-2",
        type: "image",
        src: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=400&auto=format&fit=crop",
        title: "Nature Photography Highlight",
    },
    {
        id: "reel-3",
        type: "video",
        src: "https://www.w3schools.com/html/mov_bbb.mp4",
        title: "Second Video Demo",
        thumbnail: "https://images.unsplash.com/photo-1620336655174-3268cb1b7326?q=80&w=400&auto=format&fit=crop"
    }
];

export default function ReelsPage() {
    return (
        <div className="w-full bg-black min-h-screen py-10 ">
            <h1 className="text-3xl font-bold text-white mb-6 text-center">Shorts & Reels</h1>
            <ReelSlider items={dummyReels} />
        </div>
    );
}
