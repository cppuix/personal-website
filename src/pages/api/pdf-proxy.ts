import type { APIRoute } from 'astro';

export const prerender = false;

const ALLOWED_HOSTS = new Set(['archive.org', 'www.archive.org']);

export const GET: APIRoute = async ({ url }) => {
  const rawUrl = url.searchParams.get('url');
  if (!rawUrl) {
    return new Response('Missing url parameter', { status: 400 });
  }

  let target: URL;
  try {
    target = new URL(rawUrl);
  } catch {
    return new Response('Invalid url parameter', { status: 400 });
  }

  if (target.protocol !== 'https:' || !ALLOWED_HOSTS.has(target.hostname)) {
    return new Response('Blocked target URL', { status: 403 });
  }

  let upstream: Response;
  try {
    upstream = await fetch(target.toString(), {
      redirect: 'follow',
      headers: {
        Accept: 'application/pdf,*/*'
      }
    });
  } catch {
    return new Response('Upstream fetch failed', { status: 502 });
  }

  if (!upstream.ok || !upstream.body) {
    return new Response('Upstream PDF unavailable', { status: 502 });
  }

  const contentType = upstream.headers.get('content-type') || 'application/pdf';

  return new Response(upstream.body, {
    status: 200,
    headers: {
      'Content-Type': contentType,
      'Cache-Control': 'public, max-age=3600'
    }
  });
};
