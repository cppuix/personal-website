import type { APIRoute } from 'astro';

export const prerender = false;

function htmlResponse(body: string, status = 200) {
  return new Response(body, {
    status,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'no-store',
    },
  });
}

function sanitizeForScript(value: string) {
  return value.replace(/</g, '\\u003c');
}

export const GET: APIRoute = async ({ url }) => {
  const code = url.searchParams.get('code');
  const rawState = url.searchParams.get('state') || '{}';

  let state: { provider?: string; site_id?: string; origin?: string } = {};
  try {
    state = JSON.parse(rawState);
  } catch {
    state = {};
  }

  const provider = state.provider || 'github';
  const origin = state.origin || url.origin;

  if (!code) {
    const errorPayload = sanitizeForScript(
      JSON.stringify({
        error: 'missing_code',
        error_description: 'No code provided',
      }),
    );
    return htmlResponse(`<!doctype html>
<html><body>
<script>
  (function () {
    var provider = ${JSON.stringify(provider)};
    var targetOrigin = ${JSON.stringify(origin)};
    var payload = ${errorPayload};
    if (window.opener) {
      window.opener.postMessage('authorization:' + provider + ':error:' + JSON.stringify(payload), targetOrigin);
      window.close();
      return;
    }
    document.body.textContent = 'Authentication failed: missing code';
  })();
</script>
</body></html>`, 400);
  }

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
    const errorPayload = sanitizeForScript(
      JSON.stringify({
        error: tokenData.error || 'token_exchange_failed',
        error_description: tokenData.error_description || 'Token exchange failed',
      }),
    );
    return htmlResponse(`<!doctype html>
<html><body>
<script>
  (function () {
    var provider = ${JSON.stringify(provider)};
    var targetOrigin = ${JSON.stringify(origin)};
    var payload = ${errorPayload};
    if (window.opener) {
      window.opener.postMessage('authorization:' + provider + ':error:' + JSON.stringify(payload), targetOrigin);
      window.close();
      return;
    }
    document.body.textContent = 'Authentication failed: token exchange failed';
  })();
</script>
</body></html>`, 500);
  }

  const successPayload = sanitizeForScript(
    JSON.stringify({
      token: accessToken,
      provider,
      token_type: tokenData.token_type || 'bearer',
      scope: tokenData.scope || '',
      site_id: state.site_id,
    }),
  );

  return htmlResponse(`<!doctype html>
<html><body>
<script>
  (function () {
    var provider = ${JSON.stringify(provider)};
    var targetOrigin = ${JSON.stringify(origin)};
    var payload = ${successPayload};

    if (window.opener) {
      window.opener.postMessage('authorizing:' + provider, targetOrigin);
      window.opener.postMessage('authorization:' + provider + ':success:' + JSON.stringify(payload), targetOrigin);
      window.close();
      return;
    }

    window.location.replace('/admin/#access_token=' + encodeURIComponent(payload.token) + '&token_type=' + encodeURIComponent(payload.token_type));
  })();
</script>
</body></html>`);
};