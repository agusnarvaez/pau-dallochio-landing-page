# Landing Page - Paula Dallochio

[![Build](https://github.com/agusnarvaez/pau-dallochio-landing-page/actions/workflows/build.yml/badge.svg)](https://github.com/agusnarvaez/pau-dallochio-landing-page/actions/workflows/build.yml)
[![Tests](https://github.com/agusnarvaez/pau-dallochio-landing-page/actions/workflows/test.yml/badge.svg)](https://github.com/agusnarvaez/pau-dallochio-landing-page/actions/workflows/test.yml)
[![Coverage](https://codecov.io/gh/agusnarvaez/pau-dallochio-landing-page/graph/badge.svg)](https://codecov.io/gh/agusnarvaez/pau-dallochio-landing-page)

<!-- ![Coverage](./badges/pau-dallochio-landing-page/coverage.svg) -->

Este proyecto será la landing page de Paula Dallochio, una corredora inmobiliaria, la cual se encuentra en desarrollo.

Para el desarrollo del frontend de la página, se utilizó Angular, un marco de trabajo de JavaScript para la construcción de aplicaciones web de una sola página. Angular es conocido por su eficiencia y capacidad para crear aplicaciones web rápidas y eficientes. Además, se utilizó TypeScript, un superconjunto de JavaScript que añade tipos estáticos y objetos orientados a la programación. TypeScript ayuda a hacer el código más legible y menos propenso a errores.

TokkoBrokers, por otro lado, es un CRM para desarrolladores inmobiilarios.

Por lo tanto, la pila de tecnología para la página de Paula Dallochio incluye Angular, TypeScript y TokkoBrokers.

## Manejo de credenciales

Los archivos de entorno versionados en el repo son solo plantillas sin secretos reales:

- `src/environments/environment.ts`
- `src/environments/environment.prod.ts`

En CI (GitHub Actions), esos valores se inyectan antes de compilar usando Secrets del repositorio.

Secrets requeridos:

- `TOKKO_BROKER_KEY`
- `SANITY_KEY`
- `MAPS_KEY`
- `MAIL_API_PROD`

Los overrides locales con credenciales reales no se deben commitear:

- `src/environments/environment.local.ts`
- `src/environments/environment.prod.local.ts`
