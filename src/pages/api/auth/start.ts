import type { APIRoute } from 'astro';

export const prerender = false;

export const GET: APIRoute = ({ url, redirect }) => {
  const clientId = import.meta.env.GITHUB_CLIENT_ID;
  const redirectUri = `${import.meta.env.SITE ?? url.origin}/api/auth/callback`;
  
  const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=repo`;
  
  return redirect(githubAuthUrl);
};