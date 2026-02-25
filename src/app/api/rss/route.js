import db from '../../../lib/db';

export const revalidate = 600; // Cache for 10 minutes

export async function GET() {
    const baseUrl = process.env.BASEURL || 'http://localhost:3000';
    const imageUrl = process.env.NEXT_PUBLIC_IMAGE_URL || 'http://mangalam.cms';

    try {
        const [rows] = await db.query(`
            SELECT 
                news.id, 
                CONVERT(news.title USING utf8) as title, 
                news.eng_title, 
                news.eng_summary, 
                CONVERT(news.news_details USING utf8) as news_details,
                news.effective_date,
                news_image.file_name as thumbnail
            FROM news 
            LEFT JOIN news_image ON news_image.news_id = news.id
            WHERE news.published = 1 
            AND NOW() BETWEEN news.effective_date AND news.expiry_date 
            GROUP BY news.id 
            ORDER BY news.effective_date DESC 
            LIMIT 50
        `);

        const rssItems = rows.map(post => {
            const slug = post.eng_title
                ? post.eng_title.replace(/[^\w\s-]/g, '').toLowerCase().replace(/\s+/g, '-').replace(/-+/g, '-').trim()
                : 'news-details';
            const link = `${baseUrl}/news/${post.id}-${slug}.html`;
            const pubDate = new Date(post.effective_date).toUTCString().replace('GMT', '+0000');
            const imgPath = post.thumbnail ? `${imageUrl}/${post.thumbnail}` : '';

            // Format content with images and text
            const content = post.news_details ? post.news_details.replace(/\[BREAK\]/g, '').replace(/\[IMG\]/g, '') : '';

            return `
      <item>
         <title><![CDATA[${post.title}]]></title>
         <link>${link}</link>
         <pubDate>${pubDate}</pubDate>
         <modifiedDate>${pubDate}</modifiedDate>
         ${imgPath ? `<media:thumbnail url="${imgPath}" />` : ''}
         <content:encoded><![CDATA[<p>${post.eng_summary || ''}</p>${content}]]></content:encoded>
      </item>`;
        }).join('');

        const rssFeed = `<?xml version="1.0" encoding="UTF-8"?>
<rss xmlns:atom="http://www.w3.org/2005/Atom" 
     xmlns:content="http://purl.org/rss/1.0/modules/content/" 
     xmlns:dc="http://purl.org/dc/elements/1.1/" 
     xmlns:slash="http://purl.org/rss/1.0/modules/slash/" 
     xmlns:sy="http://purl.org/rss/1.0/modules/syndication/" 
     xmlns:wfw="http://wellformedweb.org/CommentAPI/" 
     xmlns:media="http://search.yahoo.com/mrss/"
     version="2.0">
   <channel>
      <title>Mangalam News</title>
      <atom:link href="${baseUrl}/api/rss" rel="self" type="application/rss+xml" />
      <link>${baseUrl}</link>
      <description>Latest news from Mangalam</description>
      <lastBuildDate>${new Date().toUTCString().replace('GMT', '+0000')}</lastBuildDate>
      <language>ml</language>
      <sy:updatePeriod>hourly</sy:updatePeriod>
      <sy:updateFrequency>1</sy:updateFrequency>
      ${rssItems}
   </channel>
</rss>`;

        return new Response(rssFeed, {
            headers: {
                'Content-Type': 'application/xml; charset=utf-8',
            },
        });
    } catch (error) {
        console.error('RSS Feed Error:', error);
        return new Response('Error generating RSS feed', { status: 500 });
    }
}
