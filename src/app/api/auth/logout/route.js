
import { serialize } from 'cookie';

export async function POST() {
    const serialized = serialize('ads_auth', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: -1,
        path: '/',
    });

    return new Response(JSON.stringify({ message: 'Logged out' }), {
        status: 200,
        headers: { 'Set-Cookie': serialized },
    });
}
