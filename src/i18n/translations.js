import en from '../content/i18n/en.json';
import ar from '../content/i18n/ar.json';

export const translations = { en, ar };

export function t(lang, key) {
  const keys = key.split('.');
  let val = translations[lang] ?? translations['en'];
  for (const k of keys) val = val?.[k];
  return val ?? key;
}
