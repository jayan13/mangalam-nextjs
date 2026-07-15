export default function YoutubeEmbed({ html }) {

    return (
        <div
            className="youtube"
            dangerouslySetInnerHTML={{
                __html: html
            }}
        />
    );

}