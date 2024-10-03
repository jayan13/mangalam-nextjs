import db from '../../../lib/db';

export async function GET(request) {
  try {
    const searchParams = request.nextUrl.searchParams
    let limit = 10;
    let page = (searchParams.get('page'))?searchParams.get('page'):1;
    const startIndex = (page - 1) * limit;    
    const [rows] = await db.query('SELECT news.id,news.title,news.eng_title,CONVERT(news.news_details USING utf8) as "news_details",news_image.file_name,if(news_image.title,news_image.title,news.title) as alt,"" as url FROM news left join news_image on news_image.news_id=news.id where news.published=1 and NOW() between news.effective_date and news.expiry_date group by news.id order by news.effective_date DESC limit ?,?',[startIndex,limit]);
    return new Response(JSON.parse(JSON.stringify({ data: rows }), { status: 200 }));
    
  } catch (error) {
    console.error('Error fetching data:', error);
    return new Response(JSON.parse(JSON.stringify({ error: 'Failed to fetch data' }), { status: 500 }));
  }
}