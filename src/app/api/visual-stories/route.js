import db from '../../../lib/db';
import { unstable_cache } from 'next/cache';

const getVisualStories = unstable_cache(
    async () => {
        try {
            const query = `
        SELECT 'photo' as typ, photo_album.description as description, parent.name as category, 
               photo_gallery.ml_name, photo_gallery.name, photo_gallery.id as gallery_id, 
               photo_album.id as album_id,
               album_image.file_name as image, photo_album.modified_date as modified_date
        FROM photo_gallery
        LEFT JOIN photo_album ON photo_album.photo_gallery_id = photo_gallery.id
        LEFT JOIN album_image ON album_image.photo_album_id = photo_album.id
        LEFT JOIN photo_gallery as parent ON parent.id = photo_gallery.parent_id
        WHERE photo_album.id IS NOT NULL
        GROUP BY photo_gallery.id 
        ORDER BY photo_gallery.modified_date DESC, album_image.is_cover_image DESC 
        LIMIT 0, 12
      `;
            const [rows] = await db.query(query);

            const formattedRows = rows.map(row => {
                const slug = row.name.toLowerCase().replace(/[^\w\s]/gi, '').replaceAll(' ', '-').replaceAll(/-+/gi, '-');
                return {
                    ...row,
                    url: `/gallery/${row.gallery_id}-${slug}.html`,
                    // Update image path based on user info: mangalam.cms/uplods/ablum/id/images.jpg
                    // Actually, let's stick to the SQL's image field and use it appropriately in the component.
                };
            });

            return formattedRows;
        } catch (error) {
            console.error('Database error in getVisualStories:', error);
            return [];
        }
    },
    ['visual-stories'],
    { revalidate: 360, tags: ['visual-stories'] }
);

export async function GET() {
    try {
        const data = await getVisualStories();
        return new Response(JSON.stringify(data), {
            status: 200,
            headers: {
                'Cache-Control': 'public, s-maxage=360, stale-while-revalidate=60',
                'Content-Type': 'application/json',
            },
        });
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ message: 'Error fetching visual stories' }), { status: 500 });
    }
}
