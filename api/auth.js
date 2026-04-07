const CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;

export default async function handler(req, res) {
  if (!CLIENT_ID || !CLIENT_SECRET) {
    return res.status(500).send("Missing OAuth environment variables.");
  }

  const { searchParams } = new URL(req.url, `https://${req.headers.host}`);
  const code = searchParams.get("code");

  if (!code) {
    const state = Math.random().toString(36).slice(2);
    const params = new URLSearchParams({
      client_id: CLIENT_ID,
      scope: "repo,user",
      state,
    });
    return res.redirect(`https://github.com/login/oauth/authorize?${params.toString()}`);
  }

  try {
    const tokenRes = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        code,
      }),
    });

    const tokenData = await tokenRes.json();
    if (!tokenData.access_token) {
      return res.status(400).send("OAuth exchange failed.");
    }

    const token = tokenData.access_token;
    const provider = "github";

    return res.status(200).send(`<!DOCTYPE html>
<html>
  <body>
    <script>
      (function() {
        function receiveMessage(e) {
          window.opener.postMessage(
            'authorization:${provider}:success:{"token":"${token}","provider":"${provider}"}',
            e.origin
          );
        }
        window.addEventListener("message", receiveMessage, false);
        window.opener.postMessage("authorizing:${provider}", "*");
      })();
    </script>
    <p>Authorizing, please wait...</p>
  </body>
</html>`);
  } catch (err) {
    return res.status(500).send(`OAuth error: ${err.message}`);
  }
}
