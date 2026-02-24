import Image from "next/image";

export default function Newimg({ news, width = "600", height = "362" }) {
    if (!news || !news.file_name) {
        return <div style={{ width: `${width}px`, height: `${height}px`, background: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>No Image</div>;
    }

    const src = `${process.env.NEXT_PUBLIC_IMAGE_URL}/${news.file_name}`;
    return (
        <Image
            src={src}
            alt={news.alt || news.title || "Mangalam News"}
            width={width}
            height={height}
            loading="lazy"
            unoptimized={process.env.NEXT_PUBLIC_IMAGE_URL?.includes('mangalam.cms')}
        />
    );
}
