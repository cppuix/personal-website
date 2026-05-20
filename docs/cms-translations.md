# CMS Translation Labels

This project exposes UI label text through Decap CMS using the `i18n` collection.

## Where labels live

- Source files:
	- `src/content/i18n/en.json`
	- `src/content/i18n/ar.json`
- Adapter module: `src/i18n/translations.js`
- Languages: `en` and `ar`
- Keys are used by `data-i18n` attributes across pages/components.

## Editing flow

1. Open `/admin/`.
2. Go to `Translations`.
3. Open either `English` or `Arabic`.
4. Edit only text values, not key names.
5. Save/publish.

## Safety checks

- Run `npm run check:translations` to validate key parity between `en` and `ar`.
- Run `npm run check:quality` for strict checks + content checks.
- `npm run build` already runs `check:quality` before Astro build.

## Important

- Keep key structure the same in both languages.
- If a key is removed from one language, the checker fails.
- If you need new labels, add them under both `en` and `ar`.
