export default function NewsHtml({ html }) {
    return (
        <div
            className="article"
            dangerouslySetInnerHTML={{ __html: html }}
        />
    );
}