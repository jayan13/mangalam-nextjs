
import { sign } from 'jsonwebtoken';
import { serialize } from 'cookie';

export async function POST(request) {
  const body = await request.json();
  const { username, password } = body;

  if (username === process.env.ADS_USER && password === process.env.ADS_PASS) {
    const secret = process.env.JWT_SECRET || 'secret';
    const token = sign({ username }, secret, { expiresIn: '1h' });

    const serialized = serialize('ads_auth', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 3600,
      path: '/',
    });

    return new Response(JSON.stringify({ message: 'Authenticated' }), {
      status: 200,
      headers: { 'Set-Cookie': serialized },
    });
  } else {
    return new Response(JSON.stringify({ message: 'Invalid credentials' }), {
      status: 401,
    });
  }
}
