# CLAUDE.md

## Project Snapshot

`paula-dallochio-landing-page` is an Angular application for Paula Dallochio's public real estate site and property catalog.

## Stack

- Angular 17
- TypeScript
- RxJS
- TokkoBroker
- Sanity
- Karma + Jasmine
- ESLint
- GitHub Actions

## Important Paths

- `src/app/app.routes.ts` route definitions
- `src/app/pages/` page-level views
- `src/app/sections/` content sections for home, catalog, and detail flows
- `src/app/services/` product, email, SEO, maps, and utility services
- `src/environments/` tracked templates plus ignored local overrides
- `.github/workflows/build.yml` QA workflow

## Commands

```bash
npm install
npm run dev
npm run lint
npm run build
npm run build:prod
npm run test:ci
```

## Working Rules

- Prefer `npm run test:ci` for unattended verification and keep watch mode for explicit local debugging only.
- Keep TokkoBroker and Sanity integration contracts aligned with the environment templates.
- Treat `src/environments/environment.prod.ts` as a safe template and keep real credentials in ignored local override files.
