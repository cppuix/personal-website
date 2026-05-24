import type { APIRoute } from 'astro';

export const prerender = false;

export const GET: APIRoute = async ({ url, redirect }) => {
  const code = url.searchParams.get('code');
  if (!code) return new Response('No code provided', { status: 400 });

  const clientId = import.meta.env.GITHUB_CLIENT_ID;
  const clientSecret = import.meta.env.GITHUB_CLIENT_SECRET;
  const redirectUri = `${import.meta.env.SITE ?? url.origin}/api/auth/callback`;

  const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
    body: JSON.stringify({ client_id: clientId, client_secret: clientSecret, code, redirect_uri: redirectUri })
  });
  const tokenData = await tokenResponse.json();
  const accessToken = tokenData.access_token;

  if (!accessToken) {
    return new Response('Token exchange failed', { status: 500 });
  }

  return redirect(`/admin/#access_token=${encodeURIComponent(accessToken)}&token_type=bearer`);
};