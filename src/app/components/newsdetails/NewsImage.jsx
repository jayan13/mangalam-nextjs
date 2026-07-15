import Image from "next/image";

export default function NewsImage({ image, title }) {

    return (
        <figure className="news-image-block">

            <Image
                src={process.env.NEXT_PUBLIC_IMAGE_URL+"/"+image.file_name}
                width={924}
                height={555}
                alt={image.title || title}
            />

            <figcaption className="news-image-title">{image.title}</figcaption>

        </figure>
    );

}