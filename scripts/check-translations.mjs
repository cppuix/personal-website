import fs from "node:fs";
import path from "node:path";
import { translations } from "../src/i18n/translations.js";

const REQUIRED_LANGS = ["en", "ar"];
const SOURCE_ROOT = path.resolve("src");
const SOURCE_EXTENSIONS = new Set([".astro", ".js", ".ts"]);

function isObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function collectLeafPaths(node, path = [], acc = []) {
  if (isObject(node)) {
    for (const key of Object.keys(node)) {
      collectLeafPaths(node[key], [...path, key], acc);
    }
    return acc;
  }

  if (typeof node === "string") {
    acc.push(path.join("."));
    return acc;
  }

  throw new Error(`Invalid translation value at '${path.join(".")}'. Expected string or nested object.`);
}

function hasOwnPath(obj, path) {
  const parts = path.split(".");
  let cur = obj;

  for (const part of parts) {
    if (!isObject(cur) || !(part in cur)) return false;
    cur = cur[part];
  }

  return typeof cur === "string";
}

function walkFiles(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkFiles(fullPath, files);
      continue;
    }

    if (SOURCE_EXTENSIONS.has(path.extname(entry.name))) {
      files.push(fullPath);
    }
  }

  return files;
}

function collectI18nUsages() {
  const usages = new Set();
  const dynamicPrefixes = new Set();
  const files = walkFiles(SOURCE_ROOT);

  const staticPattern = /data-i18n\s*=\s*(["'`])([^"'`{}]+?)\1/g;
  const dynamicPattern = /data-i18n\s*=\s*`([^`$]+)\$\{/g;

  for (const filePath of files) {
    const content = fs.readFileSync(filePath, "utf8");

    for (const match of content.matchAll(staticPattern)) {
      usages.add(match[2].trim());
    }

    for (const match of content.matchAll(dynamicPattern)) {
      dynamicPrefixes.add(match[1].trim());
    }
  }

  return { usages, dynamicPrefixes };
}

function hasObjectPath(obj, pathValue) {
  const parts = pathValue.split(".");
  let cur = obj;

  for (const part of parts) {
    if (!isObject(cur) || !(part in cur)) return false;
    cur = cur[part];
  }

  return isObject(cur);
}

function validateUsageKeys() {
  const { usages, dynamicPrefixes } = collectI18nUsages();
  const missingStaticKeys = [];
  const missingDynamicPrefixes = [];

  for (const key of usages) {
    if (!hasOwnPath(translations.en, key) || !hasOwnPath(translations.ar, key)) {
      missingStaticKeys.push(key);
    }
  }

  for (const prefix of dynamicPrefixes) {
    const normalized = prefix.endsWith(".") ? prefix.slice(0, -1) : prefix;
    if (!hasObjectPath(translations.en, normalized) || !hasObjectPath(translations.ar, normalized)) {
      missingDynamicPrefixes.push(normalized);
    }
  }

  if (missingStaticKeys.length || missingDynamicPrefixes.length) {
    const lines = ["Source i18n usage mismatch detected."];

    if (missingStaticKeys.length) {
      lines.push(`Missing static keys (${missingStaticKeys.length}):`);
      lines.push(...missingStaticKeys.sort().slice(0, 50).map((key) => `  - ${key}`));
      if (missingStaticKeys.length > 50) lines.push(`  ...and ${missingStaticKeys.length - 50} more`);
    }

    if (missingDynamicPrefixes.length) {
      lines.push(`Missing dynamic prefixes (${missingDynamicPrefixes.length}):`);
      lines.push(...missingDynamicPrefixes.sort().slice(0, 50).map((key) => `  - ${key}`));
      if (missingDynamicPrefixes.length > 50) lines.push(`  ...and ${missingDynamicPrefixes.length - 50} more`);
    }

    throw new Error(lines.join("\n"));
  }

  console.log(`Source usages OK. ${usages.size} static keys and ${dynamicPrefixes.size} dynamic prefixes found.`);
}

function validate() {
  for (const lang of REQUIRED_LANGS) {
    if (!translations[lang]) {
      throw new Error(`Missing required language '${lang}'.`);
    }
  }

  const enPaths = collectLeafPaths(translations.en).sort();
  const arPaths = collectLeafPaths(translations.ar).sort();

  const missingInAr = enPaths.filter((p) => !hasOwnPath(translations.ar, p));
  const missingInEn = arPaths.filter((p) => !hasOwnPath(translations.en, p));

  if (missingInAr.length || missingInEn.length) {
    const lines = ["Translation key mismatch detected."];

    if (missingInAr.length) {
      lines.push(`Missing in ar (${missingInAr.length}):`);
      lines.push(...missingInAr.slice(0, 30).map((p) => `  - ${p}`));
      if (missingInAr.length > 30) lines.push(`  ...and ${missingInAr.length - 30} more`);
    }

    if (missingInEn.length) {
      lines.push(`Missing in en (${missingInEn.length}):`);
      lines.push(...missingInEn.slice(0, 30).map((p) => `  - ${p}`));
      if (missingInEn.length > 30) lines.push(`  ...and ${missingInEn.length - 30} more`);
    }

    throw new Error(lines.join("\n"));
  }

  console.log(`Translations OK. ${enPaths.length} shared keys across en/ar.`);
}

try {
  validate();
  validateUsageKeys();
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
