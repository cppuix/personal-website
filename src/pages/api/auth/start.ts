import type { APIRoute } from 'astro';

export const prerender = false;

export const GET: APIRoute = ({ url, redirect }) => {
  const clientId = import.meta.env.GITHUB_CLIENT_ID;
  if (!clientId) {
    return new Response('Missing GITHUB_CLIENT_ID', { status: 500 });
  }
  const redirectUri = `${import.meta.env.SITE ?? url.origin}/api/auth/callback`;
  const provider = url.searchParams.get('provider') || 'github';
  const siteId = url.searchParams.get('site_id') || url.hostname;
  const scope = url.searchParams.get('scope') || 'repo';

  const state = JSON.stringify({
    provider,
    site_id: siteId,
    origin: url.origin,
  });

  const githubAuthUrl = new URL('https://github.com/login/oauth/authorize');
  githubAuthUrl.searchParams.set('client_id', clientId);
  githubAuthUrl.searchParams.set('redirect_uri', redirectUri);
  githubAuthUrl.searchParams.set('scope', scope);
  githubAuthUrl.searchParams.set('state', state);

  return redirect(githubAuthUrl.toString());
};