// Genera src/environments/environment.prod.ts (gitignored) desde variables de entorno (BUILD_ENV en CI).
// Si el archivo ya existe (dev local) no lo pisa. Con REQUIRE_BUILD_ENV=1 (deploy) exige las keys.
import { existsSync, writeFileSync } from 'node:fs'

const OUT = new URL('../src/environments/environment.prod.ts', import.meta.url)
if (existsSync(OUT) && !process.env.REQUIRE_BUILD_ENV) process.exit(0)

const required = ['TOKKOBROKER_KEY', 'SANITY_KEY', 'MAPS_KEY', 'PLACE_ID']
const missing = required.filter((k) => !process.env[k])
if (process.env.REQUIRE_BUILD_ENV && missing.length) {
  console.error(`[env] Faltan en BUILD_ENV: ${missing.join(', ')}`)
  process.exit(1)
}
// Sin keys (QA/PR) se usan los mismos placeholders que environment.ts; el sitemap los ignora.
const clean = (x) => String(x).replace(/[^\w.:/@+=-]/g, '')   // sin comillas ni saltos: va dentro de '...'
const v = (k, d) => `'${clean(process.env[k] || d)}'`
writeFileSync(
  OUT,
  `export const environment = {
  production: true,
  TOKKOBROKER_KEY: ${v('TOKKOBROKER_KEY', 'tokkoKey')},
  sanity_key: ${v('SANITY_KEY', 'sanityKey')},
  mail_api_dev: 'http://localhost:3000',
  mail_api_prod: ${v('MAIL_API_PROD', 'https://mailing-api.fly.dev')},
  maps_key: ${v('MAPS_KEY', 'mapsKey')},
  reviews_api_dev: 'http://localhost:3000',
  reviews_api_prod: ${v('REVIEWS_API_PROD', 'https://bapps-reviews-api.fly.dev')},
  place_id: ${v('PLACE_ID', 'placeId')},
}
`,
)
