import db from '../../../../lib/db';

export async function GET(request,{params}) {
  try {
    const searchParams = request.nextUrl.searchParams
    //const limit = searchParams.get('limit')
    //const page = searchParams.get('page') 
    const [rows] = await db.query('SELECT * FROM news where id="'+params.id+'"');
    
    return new Response(JSON.stringify({ data: rows }), { status: 200 });
  } catch (error) {
    console.error('Error fetching data:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch data' }), { status: 500 });
  }
}