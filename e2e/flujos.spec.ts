// Un test por critical_flow de bapps.yml (el título es el flujo). Datos reales de testing (catálogo de Tokko): nada de
// ids fijos. El formulario de contacto no se manda.
import { test, expect } from './bapps.fixture'

test('home → catálogo → ficha', async ({ page, paso }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  await paso('home')

  await page.getByRole('main').getByRole('button', { name: 'Comprar' }).click()
  await expect(page).toHaveURL(/\/catalogo/)
  await expect(page.getByRole('heading', { level: 1, name: /opciones/ })).toBeVisible()
  await paso('catalogo')

  await page.getByRole('list', { name: 'Resultados de propiedades' }).getByRole('link').first().click()
  await expect(page).toHaveURL(/\/catalogo\/\d+$/)
  await expect(page.getByRole('heading', { name: /USD|\$|consultar/i }).first()).toBeVisible()
  await paso('ficha')
})

test('home → cómo trabajamos → contacto', async ({ page, paso }) => {
  await page.goto('/')
  await page.getByRole('navigation').getByRole('link', { name: 'Cómo trabajamos' }).click()
  await expect(page).toHaveURL(/\/como-trabajamos$/)
  await expect(page.getByRole('heading').first()).toBeVisible()
  await paso('como-trabajamos')

  await page.getByRole('navigation').getByRole('link', { name: 'Contacto' }).click()
  await expect(page).toHaveURL(/\/contacto$/)
  await expect(page.getByRole('main').getByRole('textbox').first()).toBeVisible()
  await paso('contacto')
})
