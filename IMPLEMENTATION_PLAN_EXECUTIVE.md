# Plan Ejecutivo (1 pagina)

## Objetivo

Estandarizar landings Angular para lograr estabilidad operativa, calidad de codigo y seguridad de configuracion sin friccion de merge.

## Resultados Esperados

- CI/CD estable (build y tests consistentes).
- Cobertura global sostenida >= 80%.
- Cero credenciales reales en git.
- Mejor UX en navegacion y feedback al usuario.
- Menor tasa de fallos en integraciones runtime (Maps, Email, APIs).
- Flujo de PR/merge predecible sin bloqueos administrativos inesperados.

## Frentes de Trabajo

1. UX y Navegacion

- Comportamiento de scroll y transiciones de ruta consistente.
- Feedback uniforme con servicio centralizado de toasts.

2. Integraciones Runtime

- Endurecer `MapsLoaderService` (idempotencia, errores de carga, estado listo).
- Estandarizar `EmailService` (config por environment, manejo de errores, contrato de respuesta).
- Mantener robustez de servicios de negocio (API de propiedades).

3. SEO y Discoverability

- Metadata por ruta centralizada en `SeoService`.
- JSON-LD en paginas clave.
- Sitemap estatico + dinamico sin romper build local si falta key.

4. Seguridad de Configuracion

- Environments versionados como templates con placeholders.
- Secrets reales inyectados solo en CI desde GitHub Secrets.
- `.gitignore` ajustado para no excluir el environment base requerido.

5. CI/CD y Gobierno de Calidad

- Workflows separados de build y test.
- Gate de merge por lint/build/tests y cobertura minima.
- Reglas de branch protection claras (evitar lock involuntario durante merge).

## Indicadores Clave (KPIs)

- Build success rate CI.
- Test pass rate CI.
- Coverage global (Statements/Branches/Functions/Lines) >= 80%.
- Incidentes por secretos expuestos: 0.
- Incidentes de navegacion/runtime post-release en descenso.

## Riesgos y Mitigaciones

- Riesgo: drift de nombres de variables de entorno.
- Mitigacion: naming canonico + validaciones en CI.

- Riesgo: bloqueos de merge no tecnicos.
- Mitigacion: revisiones periodicas de branch protection y runbook de unlock/relock.

- Riesgo: regresiones al tocar servicios transversales.
- Mitigacion: tests de regresion obligatorios por cambio.

## Roadmap Recomendado

1. Semana 1: Environments/CI/secretos y branch governance.
2. Semana 2: UX (scroll/toast) + integraciones runtime (maps/email).
3. Semana 3: Cobertura focalizada y cierre de gaps.
4. Semana 4: estabilizacion, monitoreo y ajustes menores.

## Criterio de Cierre

Proyecto listo cuando:

- pipelines estan verdes de forma sostenida,
- cobertura global >= 80% estable,
- no hay secretos en repositorio,
- y los PR se integran sin bloqueos de configuracion.
