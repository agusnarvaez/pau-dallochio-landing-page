# paula-dallochio-landing-page

[![QA](https://github.com/agusnarvaez/pau-dallochio-landing-page/actions/workflows/build.yml/badge.svg)](https://github.com/agusnarvaez/pau-dallochio-landing-page/actions/workflows/build.yml)
[![Node.js](https://img.shields.io/badge/Node.js-22%2B-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![Angular](https://img.shields.io/badge/Angular-17-DD0031?logo=angular&logoColor=white)](https://angular.dev/)

Angular landing page for Paula Dallochio, focused on real estate catalog browsing, lead capture, and corporate presentation.

Landing page en Angular para Paula Dallochio, enfocada en la exploracion del catalogo inmobiliario, la captura de consultas y la presentacion institucional.

## Overview

### ES

La aplicacion ofrece home, catalogo, detalle de propiedad, contacto, secciones informativas y sitemap generado en build. Consume datos desde TokkoBroker y Sanity, con cobertura automatizada sobre componentes, paginas y servicios.

### EN

The application includes a home page, catalog, property detail, contact flow, informational sections, and sitemap generation during builds. It consumes data from TokkoBroker and Sanity, with automated coverage across components, pages, and services.

## Stack

- Angular 17
- TypeScript
- RxJS
- TokkoBroker
- Sanity
- Karma + Jasmine
- ESLint
- GitHub Actions

## Getting Started

```bash
npm install
npm run dev
```

## Main Commands

```bash
npm run dev
npm run lint
npm run build
npm run build:prod
npm run test:ci
```

## Environment Files

Versioned environment files are safe templates without real secrets:

- `src/environments/environment.ts`
- `src/environments/environment.example.ts`

Ignored local overrides for real credentials:

- `src/environments/environment.prod.ts`
- `src/environments/environment.local.ts`
- `src/environments/environment.prod.local.ts`
- `enviroment.prod.ts` (legacy local file, root-level)

## Important Paths

- `src/app/app.routes.ts` route definitions
- `src/app/pages/` route-level views
- `src/app/sections/` page sections
- `src/app/services/` TokkoBroker, Sanity, email, SEO, and utility services
- `scripts/generate-sitemap.mjs` sitemap generation after build
- `.github/workflows/build.yml` QA workflow

## Quality

- ESLint validates the TypeScript source tree.
- Production build completes without requiring local secrets.
- CI runs lint, build, and headless tests with coverage.

## Deploy y operación

Sigue el estándar de bapps (manifiesto [`bapps.yml`](bapps.yml); detalle en `bapps-console/docs/estandar/`).

- **Testing:** merge a `main` → `deploy-testing.yml` → https://pau-dallochio-testing.bapps.com.ar (el `health` de `bapps.yml` muestra el sha).
- **Prod:** release-please abre el PR `chore(main): release x.y.z` → **Aprobar en el panel** (o, desde la oficina, mergearlo en
  GitHub) → `release.yml` crea el tag `v*` y dispara `deploy-prod.yml` → https://pauladallochio.com.ar.
- **Volver atrás:** `gh workflow run deploy-prod.yml -R agusnarvaez/pau-dallochio-landing-page --ref v<anterior>`. Desde una rama falla a propósito.
- Claves del build: secret `BUILD_ENV` (líneas `NOMBRE=valor`) con `TOKKOBROKER_KEY`, `SANITY_KEY`, `MAPS_KEY`, `PLACE_ID` (opcionales `MAIL_API_PROD`, `REVIEWS_API_PROD`); el deploy falla si falta una. Valores en Bitwarden; nunca en el repo.
- Los checks corren en el pre-push local (el `ci.yml` de GitHub está apagado); operar desde la oficina:
  `bapps-console/docs/operar/desde-la-oficina.md`.
