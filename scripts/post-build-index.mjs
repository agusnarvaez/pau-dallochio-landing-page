#!/usr/bin/env node
/**
 * Runs automatically after `npm run build` (via the "postbuild" npm hook).
 * Compares dist/pau-dallochio-landing-page/browser/sitemap.xml against
 * scripts/indexed-urls.json and submits new URLs to the Google Indexing API.
 *
 * Must run AFTER scripts/generate-sitemap.mjs, which is the script that
 * actually writes the sitemap.xml consumed here.
 */

import { readFileSync, writeFileSync, existsSync } from "fs";
import { GoogleAuth } from "google-auth-library";

const ROOT = new URL("..", import.meta.url).pathname.replace(/^\/([A-Z]:)/, "$1");

const SITEMAP_PATH = `${ROOT}/dist/pau-dallochio-landing-page/browser/sitemap.xml`;
const INDEXED_PATH = new URL("./indexed-urls.json", import.meta.url).pathname.replace(/^\/([A-Z]:)/, "$1");
const KEY_FILE = process.env.GOOGLE_SA_KEY || `${ROOT}/pau-dallochio-service-account.json`;

function parseSitemapUrls(xml) {
  return [...xml.matchAll(/<loc>(https?:\/\/[^<]+)<\/loc>/g)].map((m) => m[1].trim());
}

function loadIndexed() {
  if (!existsSync(INDEXED_PATH)) return new Set();
  try {
    return new Set(JSON.parse(readFileSync(INDEXED_PATH, "utf-8")));
  } catch {
    return new Set();
  }
}

function saveIndexed(set) {
  writeFileSync(INDEXED_PATH, JSON.stringify([...set].sort(), null, 2));
}

if (!existsSync(SITEMAP_PATH)) {
  console.warn(`[index] Warning: sitemap not found at:\n  ${SITEMAP_PATH}`);
  console.warn("[index] Run the sitemap generation step before this script. Skipping.");
  process.exit(0);
}

const sitemapXml = readFileSync(SITEMAP_PATH, "utf-8");
const allUrls = parseSitemapUrls(sitemapXml);
const indexed = loadIndexed();
const newUrls = allUrls.filter((url) => !indexed.has(url));

if (newUrls.length === 0) {
  console.log("[index] No new URLs — skipping Google Indexing API.");
  process.exit(0);
}

console.log(`[index] ${newUrls.length} new URL(s) found:`);
newUrls.forEach((url) => console.log(`  + ${url}`));

let keyOk = false;
try {
  readFileSync(KEY_FILE);
  keyOk = true;
} catch {
  console.warn(`[index] Warning: service account key not found at:\n  ${KEY_FILE}`);
  console.warn("[index] Skipping Indexing API. Set GOOGLE_SA_KEY to the key path.");
}

if (keyOk) {
  const auth = new GoogleAuth({
    keyFile: KEY_FILE,
    scopes: ["https://www.googleapis.com/auth/indexing"],
  });
  const client = await auth.getClient();

  for (const url of newUrls) {
    try {
      await client.request({
        url: "https://indexing.googleapis.com/v3/urlNotifications:publish",
        method: "POST",
        data: { url, type: "URL_UPDATED" },
      });
      indexed.add(url);
      console.log(`  ✓ Indexed: ${url}`);
    } catch (err) {
      const msg = err?.response?.data?.error?.message ?? err.message;
      console.error(`  ✗ Failed: ${url}\n    ${msg}`);
    }
  }

  saveIndexed(indexed);
  console.log("[index] indexed-urls.json updated.");
}
