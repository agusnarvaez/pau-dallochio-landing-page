# Plan de Implementacion Integral (Refactor, Calidad, CI y Operacion)

## 1. Objetivo General

Estandarizar este tipo de landing Angular para que quede:

- estable en CI/CD,
- segura en manejo de secretos,
- consistente en SEO y runtime integrations,
- con cobertura de tests >= 80% global,
- y con una UX de navegacion mas robusta y mantenible.

Este documento esta pensado para reutilizarse en repos similares.

---

## 2. Alcance del Plan

Incluye mejoras ya implementadas y lineamientos para repetir el enfoque:

- UX y navegacion.
- Servicios transversales de experiencia (toast, scroll).
- Integraciones runtime (Google Maps loader, Email service, API de propiedades).
- SEO tecnico y metadata por ruta.
- Arquitectura de environments (dev/prod) y secretos en CI.
- Workflows de build/test en GitHub Actions.
- Estrategia de tests y cobertura minima.
- Gobernanza de merge y proteccion de rama.

---

## 3. Fase UX y Navegacion

### 3.1 Navegacion y comportamiento de pagina

1. Unificar comportamiento de scroll entre rutas y anclas.
2. Asegurar restauracion o reseteo controlado de posicion al navegar.
3. Eliminar saltos visuales y condiciones race al cargar secciones.
4. Cubrir con tests unitarios los casos de navegacion principales.

### 3.2 Feedback de usuario con Toast

1. Mantener un `ToastService` centralizado para mensajes de exito/error/info.
2. Evitar toasts ad hoc por componente; usar contrato unico del servicio.
3. Acompanarlo con `ToastContainerComponent` para rendering desacoplado.
4. Cubrir con tests:
   - alta y baja de mensajes,
   - expiracion/limpieza,
   - casos de borde (duplicados, IDs, estados vacios).

### 3.3 Resultado esperado

- Navegacion predecible.
- Feedback consistente en toda la app.
- Menor acoplamiento entre logica de UI y componentes de pagina.

---

## 4. Fase Integraciones Runtime

### 4.1 Maps Loader (Google Maps)

1. Consolidar carga del SDK en `MapsLoaderService`.
2. Garantizar idempotencia: si ya esta cargado, no volver a inyectar script.
3. Manejar estados de carga y errores de red/script.
4. Agregar tests de ramas:
   - script existente,
   - carga exitosa,
   - error de carga,
   - disponibilidad de objeto global.

### 4.2 Email Service

1. Centralizar endpoints/keys en environment (sin hardcode).
2. Validar payload y errores de transporte/API.
3. Definir respuesta uniforme para UI (exito/fracaso con mensaje util).
4. Agregar tests para:
   - request correcto,
   - respuesta OK,
   - fallback ante error,
   - mapeo de errores esperables.

### 4.3 Product/API Service

1. Asegurar lectura de configuracion desde environment.
2. Estandarizar manejo de errores y defaults para listas/detalles.
3. Mantener tests de transformacion de datos y branches de error.

---

## 5. Fase SEO y Discoverability

1. Mantener metadata por ruta (title, description, robots, canonical).
2. Centralizar actualizacion de meta tags en `SeoService`.
3. Mantener JSON-LD en paginas clave (Organization, Product, FAQ segun aplique).
4. Sostener generacion de sitemap con rutas estaticas + dinamicas.
5. Tolerar ausencia de key en entorno local sin romper build.

---

## 6. Fase Environments y Seguridad

### 6.1 Estructura de entornos

Usar estructura Angular estandar en `src/environments/`:

- `environment.ts` (base template versionado).
- `environment.prod.ts` (template prod versionado con placeholders).

### 6.2 Secretos

1. No commitear credenciales reales.
2. Guardar solo placeholders en archivos versionados.
3. Inyectar valores reales en CI desde GitHub Secrets (idealmente environment `prod`).

### 6.3 Git ignore seguro

1. No ignorar de forma amplia `src/environments/environment.*`.
2. Ignorar solo overrides locales (ejemplo: `environment.local.ts`, `environment.prod.local.ts`).
3. Garantizar que el environment base siempre exista para compilacion y tests.

---

## 7. Fase CI/CD (Build y Test separados)

### 7.1 Build workflow

1. Checkout + Node + install dependencias.
2. Generar `environment.prod.ts` desde secrets antes de lint/build.
3. Ejecutar lint.
4. Ejecutar build de produccion.
5. Publicar artefactos/reportes si corresponde.

### 7.2 Test workflow

1. Checkout + Node + install dependencias.
2. Generar `environment.prod.ts` desde secrets.
3. Ejecutar test suite con cobertura.
4. Enviar cobertura a Codecov.
5. Fijar threshold global minimo de cobertura.

### 7.3 Criterio de calidad

- Bloquear merge si falla lint/build/tests.
- Bloquear merge si cobertura global cae por debajo de 80%.

---

## 8. Fase Testing y Cobertura

### 8.1 Objetivo

Mantener cobertura global minima:

- Statements >= 80%
- Branches >= 80%
- Functions >= 80%
- Lines >= 80%

### 8.2 Prioridad de tests

1. Servicios con integraciones externas:
   - PDF service,
   - Maps loader,
   - Email service,
   - Product/API service.
2. Servicios UX transversales:
   - Scroll service,
   - Toast service.
3. Componentes de alto trafico:
   - Header,
   - Footer,
   - Home banner,
   - Product detail (carrousel y main info),
   - contenedor de toast.

### 8.3 Regla operativa

Cada bug fix o feature en servicios/componentes criticos debe venir con test de regresion asociado.

---

## 9. Gobernanza de Merge y Branch Protection

1. Verificar que `main` no este en estado `Lock branch` durante ventana de merge.
2. Mantener protecciones utiles:
   - required checks,
   - required reviews,
   - restricciones de force-push.
3. Si se usa lock temporal por release freeze, definir procedimiento explicito de desbloqueo y relock.

---

## 10. Checklist de Replicacion Rapida (Para otro repo)

1. Migrar a `src/environments` y file replacements correctos.
2. Sanitizar environments (placeholders) y mover secretos a CI.
3. Ajustar `.gitignore` para no excluir el environment base.
4. Separar workflows build/test y generar env prod en ambos.
5. Fortalecer `MapsLoaderService` y `EmailService` con tests de ramas.
6. Consolidar `ToastService`/container y `ScrollService` con tests.
7. Expandir tests de componentes clave y servicios de negocio.
8. Verificar cobertura >= 80% en 4 metricas.
9. Validar branch protection para evitar bloqueos de merge no deseados.
10. Ejecutar smoke final local + PR con checks verdes.

---

## 11. KPIs de Exito

- Build estable en CI.
- Test suite verde en CI.
- Cobertura global >= 80% sostenida.
- Cero secretos reales en git.
- Menos incidencias por navegacion/feedback UX.
- Menos fallos runtime por SDKs externos.
- Flujo de merge sin bloqueos administrativos inesperados.

---

## 12. Mantenimiento Continuo

1. Revisar coverage report en cada PR importante.
2. Auditar dependencias y workflows de forma trimestral.
3. Revisar naming de variables de entorno para evitar drift.
4. Mantener este plan como documento vivo y actualizarlo ante nuevos patrones.
