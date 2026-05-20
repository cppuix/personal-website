import type { APIRoute } from 'astro';

export const prerender = false;

export const GET: APIRoute = async ({ url }) => {
  const target = url.searchParams.get('url');
  if (!target) {
    return new Response('Missing ?url', { status: 400 });
  }

  let parsed: URL;
  try {
    parsed = new URL(target);
  } catch {
    return new Response('Invalid URL', { status: 400 });
  }

  if (parsed.protocol !== 'https:') {
    return new Response('Only https is allowed', { status: 400 });
  }
  if (!parsed.hostname.endsWith('archive.org')) {
    return new Response('Only archive.org URLs are allowed', { status: 403 });
  }

  try {
    const res = await fetch(target);
    if (!res.ok) {
      return new Response(`Upstream error: ${res.status} ${res.statusText}`, { status: 502 });
    }

    return new Response(res.body, {
      headers: {
        'Content-Type': 'application/pdf',
        'Cache-Control': 'public, max-age=3600'
      }
    });
  } catch {
    return new Response('Failed to fetch upstream PDF', { status: 502 });
  }
};
