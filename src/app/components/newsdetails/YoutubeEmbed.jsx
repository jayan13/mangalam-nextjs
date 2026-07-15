export default function YoutubeEmbed({ html }) {

    return (
        <div
            className="youtube no-printme"
            dangerouslySetInnerHTML={{
                __html: html
            }}
        />
    );

}