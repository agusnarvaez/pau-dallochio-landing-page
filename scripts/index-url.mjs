#!/usr/bin/env node
/**
 * Submits a URL to the Google Indexing API.
 *
 * Usage:
 *   npm run index-url https://www.pauladallochio.com.ar/catalogo/123
 *
 * Requires:
 *   - GOOGLE_SA_KEY env var with path to service account JSON, OR
 *   - Default file: ./pau-dallochio-service-account.json in project root
 *   - Service account must be added as Owner in Search Console
 */

import { readFileSync } from "fs";
import { GoogleAuth } from "google-auth-library";

const url = process.argv[2];

if (!url) {
  console.error("Usage: npm run index-url <url>");
  console.error("Example: npm run index-url https://www.pauladallochio.com.ar/catalogo/123");
  process.exit(1);
}

if (!url.startsWith("https://www.pauladallochio.com.ar")) {
  console.error("Error: URL must start with https://www.pauladallochio.com.ar");
  process.exit(1);
}

const keyFile =
  process.env.GOOGLE_SA_KEY ||
  new URL("../pau-dallochio-service-account.json", import.meta.url).pathname.replace(/^\/([A-Z]:)/, "$1");

// Verify key file exists
try {
  readFileSync(keyFile);
} catch {
  console.error(`Service account key not found: ${keyFile}`);
  console.error("Set GOOGLE_SA_KEY env var to the path of your service account JSON.");
  process.exit(1);
}

const auth = new GoogleAuth({
  keyFile,
  scopes: ["https://www.googleapis.com/auth/indexing"],
});

console.log(`Submitting to Google Indexing API: ${url}`);

try {
  const client = await auth.getClient();
  const response = await client.request({
    url: "https://indexing.googleapis.com/v3/urlNotifications:publish",
    method: "POST",
    data: {
      url,
      type: "URL_UPDATED",
    },
  });

  const data = response.data;
  console.log("Done.");
  console.log(`  URL: ${data.urlNotificationMetadata?.url ?? url}`);
  console.log(`  Latest notify time: ${data.urlNotificationMetadata?.latestUpdate?.notifyTime ?? "—"}`);
} catch (err) {
  const msg = err?.response?.data?.error?.message ?? err.message;
  console.error(`Indexing API error: ${msg}`);
  process.exit(1);
}
