# Plan Tecnico Detallado (Checklist Operativo)

## 0. Alcance

Aplicable a repos Angular con secciones, servicios de integracion externa, CI en GitHub Actions y cobertura con Karma/Jasmine.

## 1. Environments y Seguridad

### 1.1 Estructura

- [ ] Crear/validar `src/environments/environment.ts` (template base).
- [ ] Crear/validar `src/environments/environment.prod.ts` (template prod).
- [ ] Verificar `fileReplacements` de produccion en `angular.json`.

### 1.2 Secretos

- [ ] Confirmar que ambos environments versionados tengan placeholders, no valores reales.
- [ ] Definir secrets en GitHub (`environment: prod` recomendado).
- [ ] Generar `environment.prod.ts` en runtime de CI antes de build/tests.

### 1.3 Git Ignore

- [ ] Evitar patrones amplios como `src/environments/environment.*`.
- [ ] Ignorar solo overrides locales (`environment.local.ts`, `environment.prod.local.ts`).
- [ ] Confirmar que `environment.ts` nunca quede fuera del repo.

## 2. CI/CD

### 2.1 Build Workflow

- [ ] Paso de checkout.
- [ ] Setup Node (version pinneada).
- [ ] `npm ci`.
- [ ] Generacion de env prod desde secrets.
- [ ] `npm run lint`.
- [ ] `npm run build`.

### 2.2 Test Workflow

- [ ] Paso de checkout.
- [ ] Setup Node.
- [ ] `npm ci`.
- [ ] Generacion de env prod desde secrets.
- [ ] `npm run test:prod` o equivalente.
- [ ] Upload de cobertura a Codecov.

### 2.3 Gates

- [ ] Requerir checks de build y test para merge.
- [ ] Configurar threshold global de cobertura >= 80%.

## 3. UX y Navegacion

### 3.1 Scroll/Navegacion

- [ ] Unificar comportamiento scroll entre rutas/anclas.
- [ ] Controlar reset/restauracion de posicion al navegar.
- [ ] Evitar race conditions en carga de secciones.
- [ ] Cubrir con pruebas unitarias.

### 3.2 Toast Service

- [ ] Mantener `ToastService` centralizado.
- [ ] Evitar mensajes embebidos en componentes aislados.
- [ ] Renderizar via contenedor desacoplado.
- [ ] Testear alta/baja, expiracion y casos de borde.

## 4. Integraciones Runtime

### 4.1 Maps Loader

- [ ] Centralizar carga en `MapsLoaderService`.
- [ ] Implementar idempotencia de script.
- [ ] Manejar estados y errores de carga.
- [ ] Testear ramas: script existente, load ok, load error, global disponible/no disponible.

### 4.2 Email Service

- [ ] Consumir keys/endpoints desde environment.
- [ ] Estandarizar errores de transporte/API.
- [ ] Devolver contrato uniforme para la UI.
- [ ] Testear request, exito, error y fallback.

### 4.3 Product/API Service

- [ ] Configuracion por environment.
- [ ] Manejo robusto de listas/detalles ante error.
- [ ] Testear transformaciones y ramas no felices.

## 5. SEO

- [ ] Mantener metadata por ruta (title, description, canonical, robots).
- [ ] Centralizar en `SeoService`.
- [ ] Sostener JSON-LD en paginas clave.
- [ ] Mantener generacion de sitemap dinamico con fallback local.

## 6. Testing y Cobertura

### 6.1 Objetivos Minimos

- [ ] Statements >= 80%
- [ ] Branches >= 80%
- [ ] Functions >= 80%
- [ ] Lines >= 80%

### 6.2 Priorizacion

- [ ] Servicios transversales e integraciones primero.
- [ ] Componentes de alto trafico despues.
- [ ] Todo fix critico con test de regresion.

## 7. Branch Governance

- [ ] Confirmar que `main` no este locked en ventana de merge.
- [ ] Mantener required checks y required reviews.
- [ ] Documentar procedimiento de unlock/relock si hay freeze.

## 8. Validacion Final

- [ ] Build local OK.
- [ ] Test local OK con coverage >= 80%.
- [ ] Build CI OK.
- [ ] Test CI OK.
- [ ] PR mergeable sin bloqueos administrativos.

## 9. Runbook de Incidentes Frecuentes

1. Error "Cannot resolve .../environments/environment"

- Verificar que `src/environments/environment.ts` exista y este versionado.
- Revisar `.gitignore` por patrones sobre-amplios.

2. PR en verde pero "Unable to merge"

- Revisar branch protection: `Lock branch`, required checks/reviews, restricciones de push.

3. Build rompe en sitemap por key faltante

- Confirmar generacion de env prod en CI.
- Mantener fallback local para no bloquear developer experience.

## 10. Plantilla de Cierre de Implementacion

- Estado CI: [OK/NO]
- Estado tests: [OK/NO]
- Coverage global: [S/B/F/L]
- Secretos en repo: [NO]
- Riesgos abiertos: [lista corta]
- Acciones pendientes: [lista corta]
