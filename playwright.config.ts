import { defineConfig, devices } from '@playwright/test'

// e2e contra testing (bapps-workflows e2e.yml pasa BASE_URL). Capturas y console.json en test-results/: los lee la
// verificación con IA de bapps-console.
export default defineConfig({
  testDir: 'e2e',
  outputDir: 'test-results',
  retries: 1,
  reporter: [['list'], ['json', { outputFile: 'test-results/report.json' }]],
  use: { baseURL: process.env.BASE_URL ?? 'https://pau-dallochio-testing.bapps.com.ar', screenshot: 'only-on-failure', trace: 'off' },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
})
