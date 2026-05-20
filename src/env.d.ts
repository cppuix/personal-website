/// <reference path="../.astro/types.d.ts" />

interface ImportMetaEnv {
	readonly SITE?: string;
	readonly GITHUB_CLIENT_ID?: string;
	readonly GITHUB_CLIENT_SECRET?: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}