import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'

const SITE_URL = 'https://www.pauladallochio.com.ar'
const DIST_SITEMAP_PATH = resolve(
  'dist',
  'pau-dallochio-landing-page',
  'browser',
  'sitemap.xml',
)
const ENV_PATH = resolve('enviroment.prod.ts')

const STATIC_ROUTES = ['', 'como-trabajamos', 'vender', 'catalogo', 'contacto']

function normalizeUrl(path) {
  if (!path) {
    return SITE_URL
  }

  return `${SITE_URL}/${path}`
}

function toXmlDate(date = new Date()) {
  return date.toISOString().split('T')[0]
}

function buildUrlEntry(url, lastmod, changefreq = 'weekly', priority = '0.7') {
  return [
    '  <url>',
    `    <loc>${url}</loc>`,
    `    <lastmod>${lastmod}</lastmod>`,
    `    <changefreq>${changefreq}</changefreq>`,
    `    <priority>${priority}</priority>`,
    '  </url>',
  ].join('\n')
}

async function getTokkoKey() {
  const envFile = await readFile(ENV_PATH, 'utf-8')
  const keyMatch = envFile.match(/tokkoBrokerKey:\s*'([^']+)'/)

  if (!keyMatch?.[1]) {
    throw new Error('No se encontro tokkoBrokerKey en enviroment.prod.ts')
  }

  return keyMatch[1]
}

async function fetchDynamicProductRoutes() {
  try {
    const tokkoKey = await getTokkoKey()
    const tokkoBaseQuery = {
      current_localization_id: 0,
      current_localization_type: 'country',
      price_from: 0,
      price_to: 999999999,
      operation_types: [1, 2, 3],
      property_types: [
        1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
        21, 22, 23, 24, 25,
      ],
      currency: 'ANY',
      filters: [],
    }

    const searchParams = new URLSearchParams({
      limit: '200',
      lang: 'es_ar',
      key: tokkoKey,
      data: JSON.stringify(tokkoBaseQuery),
      order_by: '',
      order: '',
    })

    const endpoint = `https://www.tokkobroker.com/api/v1/property/search?${searchParams.toString()}`
    const response = await fetch(endpoint)

    if (!response.ok) {
      throw new Error(`Tokko API respondio con status ${response.status}`)
    }

    const data = await response.json()
    const objects = Array.isArray(data?.objects) ? data.objects : []

    const ids = objects
      .map((item) => item?.id)
      .filter((id) => id !== null && id !== undefined)
      .map((id) => String(id))

    const uniqueIds = [...new Set(ids)]

    return uniqueIds.map((id) => `catalogo/${id}`)
  } catch (error) {
    console.warn(
      `[sitemap] No se pudieron obtener rutas dinamicas de Tokko: ${error.message}`,
    )
    return []
  }
}

async function generateSitemap() {
  const lastmod = toXmlDate()
  const dynamicRoutes = await fetchDynamicProductRoutes()
  const allRoutes = [...new Set([...STATIC_ROUTES, ...dynamicRoutes])]

  const entries = allRoutes.map((route) => {
    if (!route) {
      return buildUrlEntry(normalizeUrl(route), lastmod, 'weekly', '1.0')
    }

    if (route.startsWith('catalogo/')) {
      return buildUrlEntry(normalizeUrl(route), lastmod, 'daily', '0.9')
    }

    return buildUrlEntry(normalizeUrl(route), lastmod)
  })

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...entries,
    '</urlset>',
    '',
  ].join('\n')

  await mkdir(dirname(DIST_SITEMAP_PATH), { recursive: true })
  await writeFile(DIST_SITEMAP_PATH, xml, 'utf-8')

  console.log(
    `[sitemap] Generado en ${DIST_SITEMAP_PATH} con ${allRoutes.length} URLs (${dynamicRoutes.length} dinamicas).`,
  )
}

generateSitemap().catch((error) => {
  console.error(`[sitemap] Error al generar sitemap: ${error.message}`)
  process.exit(1)
})
