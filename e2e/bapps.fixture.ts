// Fixture de e2e de los proyectos de bapps (bapps-console, Fase 4): junta los errores de consola y saca una captura
// por paso. La verificación con IA del panel lee test-results/ (artifact e2e-<sha> de GitHub): capturas
// `<flujo>--<nn>-<paso>.png` y `console.json` por test.
// ponytail: copiado igual en mendez-prop, pau-dallochio-landing-page y bapps-console; si llegan a 5 repos, paquete.
import { writeFileSync } from 'node:fs'
import { test as base } from '@playwright/test'

export { expect } from '@playwright/test'

// Nombres que acepta el panel: minúsculas, números y guiones.
const slug = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 60)

export const test = base.extend<{ paso: (nombre: string) => Promise<void> }>({
  page: async ({ page }, use, info) => {
    const errores: string[] = []
    page.on('console', (m) => { if (m.type() === 'error') errores.push(m.text().slice(0, 500)) })
    page.on('pageerror', (e) => errores.push(`pageerror: ${e.message.slice(0, 500)}`))
    await use(page)
    writeFileSync(info.outputPath('console.json'), JSON.stringify({ flujo: info.title, errores: errores.slice(0, 50) }, null, 2))
  },
  paso: async ({ page }, use, info) => {
    let n = 0
    await use(async (nombre) => {
      n++
      // Que la captura muestre la página cargada (fotos incluidas): si no, la IA vería una galería vacía como un error.
      await page.waitForLoadState('networkidle', { timeout: 10_000 }).catch(() => {})
      // Imágenes visibles cargadas. Una rota nunca termina: a los 10 s se saca igual (y la rota se ve en la captura).
      await page.waitForFunction(() => [...document.images]
        .filter((i) => { const r = i.getBoundingClientRect(); return r.height > 0 && r.bottom > 0 && r.top < innerHeight })
        .every((i) => i.complete && i.naturalWidth > 0), null, { timeout: 10_000 }).catch(() => {})
      await page.screenshot({ path: info.outputPath(`${slug(info.title)}--${String(n).padStart(2, '0')}-${slug(nombre)}.png`) })
    })
  },
})
