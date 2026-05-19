# CMS Translation Labels

This project exposes UI label text through Decap CMS using the `site_text` collection.

## Where labels live

- Source file: `src/i18n/translations.js`
- Languages: `en` and `ar`
- Keys are used by `data-i18n` attributes across pages/components.

## Editing flow

1. Open `/admin/`.
2. Go to `Site Text`.
3. Open `Translations (UI Labels)`.
4. Edit only text values, not key names.
5. Save/publish.

## Safety checks

- Run `npm run check:translations` to validate key parity between `en` and `ar`.
- `npm run build` already runs translation validation first.

## Important

- Keep key structure the same in both languages.
- If a key is removed from one language, the checker fails.
- If you need new labels, add them under both `en` and `ar`.
