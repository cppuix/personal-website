import type { APIRoute } from 'astro';
import { parse } from 'cookie';

export const GET: APIRoute = async ({ request }) => {
  const cookies = parse(request.headers.get('cookie') || '');
  const token = cookies['decap-cms-token'];
  if (!token) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  
  // Fetch GitHub user info
  const userRes = await fetch('https://api.github.com/user', {
    headers: { Authorization: `Bearer ${token}` }
  });
  const user = await userRes.json();
  
  return new Response(JSON.stringify({ login: user.login, name: user.name }), {
    headers: { 'Content-Type': 'application/json' }
  });
};