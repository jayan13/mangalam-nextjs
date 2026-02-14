
import { verify } from 'jsonwebtoken';
import { cookies } from 'next/headers';
import fs from 'fs';
import path from 'path';

const ADS_PATH = path.join(process.cwd(), 'public', 'ads.txt');

async function isAuthenticated() {
    const cookieStore = await cookies();
    const token = cookieStore.get('ads_auth');

    if (!token) return false;

    try {
        const secret = process.env.JWT_SECRET || 'secret';
        verify(token.value, secret);
        return true;
    } catch (e) {
        return false;
    }
}

export async function GET() {
    if (!(await isAuthenticated())) {
        return new Response(JSON.stringify({ message: 'Unauthorized' }), { status: 401 });
    }

    try {
        const content = fs.readFileSync(ADS_PATH, 'utf-8');
        return new Response(JSON.stringify({ content }), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ content: '' }), { status: 200 });
    }
}

export async function POST(request) {
    if (!(await isAuthenticated())) {
        return new Response(JSON.stringify({ message: 'Unauthorized' }), { status: 401 });
    }

    const body = await request.json();
    const { content } = body;

    try {
        fs.writeFileSync(ADS_PATH, content);
        return new Response(JSON.stringify({ message: 'Updated successfully' }), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ message: 'Error writing file' }), { status: 500 });
    }
}
