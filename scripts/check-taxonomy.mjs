import { readFile } from 'node:fs/promises';
import { glob } from 'node:fs/promises';

const BOOK_CATEGORIES = new Set([
  'aqeedah',
  'fiqh',
  'hadith',
  'tafsir',
  'seerah',
  'manhaj',
  'fitan',
  'translations',
  'other',
]);

const BOOK_LANGUAGES = new Set(['ar', 'en']);

const BLOG_CATEGORIES = new Set([
  'aqeedah',
  'fiqh',
  'manhaj',
  'translation',
  'reflection',
  'announcement',
  'other',
]);

const PROJECT_CATEGORIES = new Set([
  'education',
  'library',
  'publishing',
  'community',
  'tool',
  'other',
]);

const PROJECT_TAGS = new Set([
  'pwa',
  'website',
  'community',
  'offline',
  'privacy',
  'search',
  'archive',
  'learning',
  'other',
]);

function normalizeKey(value) {
  return String(value || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\u0600-\u06ff]+/g, '_')
    .replace(/^_+|_+$/g, '');
}

async function parseJson(path) {
  const raw = await readFile(path, 'utf8');
  return JSON.parse(raw);
}

async function run() {
  const errors = [];

  for await (const path of glob('src/content/books/*.json')) {
    const data = await parseJson(path);

    if (!BOOK_CATEGORIES.has(data.category)) {
      errors.push(`${path}: invalid book category "${data.category}"`);
    }

    if (!BOOK_LANGUAGES.has(data.language)) {
      errors.push(`${path}: invalid book language "${data.language}"`);
    }
  }

  for await (const path of glob('src/content/projects/*.json')) {
    const data = await parseJson(path);

    if (data.category && !PROJECT_CATEGORIES.has(data.category)) {
      errors.push(`${path}: invalid project category "${data.category}"`);
    }

    for (const tag of data.tags || []) {
      if (!PROJECT_TAGS.has(tag)) {
        errors.push(`${path}: invalid project tag "${tag}"`);
      }
    }
  }

  for await (const path of glob('src/content/blog/**/*.md')) {
    const raw = await readFile(path, 'utf8');
    if (!raw.startsWith('---')) continue;

    const parts = raw.split('---');
    if (parts.length < 3) continue;

    const fm = parts[1];
    const categoryMatch = fm.match(/^category:\s*(.+)$/m);
    if (!categoryMatch) continue;

    const category = normalizeKey(categoryMatch[1]);
    if (!BLOG_CATEGORIES.has(category)) {
      errors.push(`${path}: invalid blog category "${category}"`);
    }
  }

  if (errors.length > 0) {
    console.error('taxonomy-integrity-failed');
    for (const err of errors) console.error(err);
    process.exit(1);
  }

  console.log('taxonomy-integrity-ok');
}

run().catch((err) => {
  console.error('taxonomy-integrity-error');
  console.error(err);
  process.exit(1);
});
