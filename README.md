<div align="center">

# Ginko Payments

### Gestión inteligente de órdenes de pago a proveedores

[![Vue 3](https://img.shields.io/badge/Vue_3-4FC08D?logo=vue.js&logoColor=white)]()
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)]()
[![Pinia](https://img.shields.io/badge/Pinia-FFD859?logo=pinia&logoColor=black)]()
[![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white)]()
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS_4-06B6D4?logo=tailwindcss&logoColor=white)]()
[![MSW](https://img.shields.io/badge/MSW-FF6A33?)]()

[![DeepSeek AI](https://img.shields.io/badge/DeepSeek-4A6CF7?logo=data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMTIgMkM2LjQ4IDIgMiA2LjQ4IDIgMTJzNC40OCAxMCAxMCAxMCAxMC00LjQ4IDEwLTEwUzE3LjUyIDIgMTIgMnptMCAxOGMtNC40MSAwLTgtMy41OS04IDhzMy41OSA4IDggOCA4LTMuNTkgOC04LTMuNTktOC04LTh6IiBmaWxsPSJ3aGl0ZSIvPjwvc3ZnPg==&logoColor=white)]()
[![Tests](https://img.shields.io/badge/tests-11_✔️-2ea44f)]()
[![Build](https://img.shields.io/badge/build-passing-2ea44f)]()

**Prueba técnica — Ginko Financial Solutions** · Mayo 2026

</div>

---

## ✦ Overview

Ginko Payments es una SPA de gestión de pagos a proveedores construida con **Vue 3 + TypeScript**. Simula un entorno de banca empresarial con responsividad en mobile, tablet y desktop, más de 50 órdenes semilla realistas, y un **asistente de IA conversacional** potenciado por DeepSeek.

**Valores diferenciales del entregable:**
- **10 commits atómicos** con mensajes descriptivos en español
- **IA integrada** (DeepSeek v4 flash) — copiloto + sugerencias de concepto
- **Optimistic updates** en transiciones de estado
- **Modo oscuro** con toggle manual
- **11 pruebas unitarias** en componentes significativos
- **0 dependencias** de componentes UI pesadas (Tailwind puro)
- **Sin backend** — MSW mockea toda la API a nivel Service Worker

---

## ✦ Demo rápida

```bash
# 2 comandos y ya está corriendo
npm install
npm run dev
# → http://localhost:5173
```

No necesitas backend, ni Docker, ni base de datos. MSW intercepta todas las llamadas a `/api/*` desde el Service Worker del navegador.

---

## ✦ Feature estrella: Asistente IA con DeepSeek

La aplicación integra inteligencia artificial en dos modalidades, todo conectado directamente a la API de DeepSeek:

### 🤖 Copiloto conversacional
Botón flotante en la esquina inferior derecha. Abre un chat donde el usuario puede preguntar en **lenguaje natural** sobre sus órdenes de pago. El asistente entiende el contexto de la aplicación y puede responder preguntas como:
- *"¿Cuántas órdenes hay en borrador?"*
- *"Muéstrame las aprobadas de este mes"*
- *"¿Cuál es el total de pagos rechazados?"*

### ✨ Sugerencia inteligente de concepto
En el formulario de **nueva orden**, un botón "Sugerir con IA" envía el nombre del proveedor y el monto a DeepSeek, que genera automáticamente un concepto de pago profesional.

```
Proveedor: "Ingeniería y Construcciones SAS"
Monto: $12.500.000 COP

→ "Pago de honorarios por consultoría estructural — abril 2026"
```

### Arquitectura de la feature IA

```
┌─────────────────────────────────────────────────┐
│               Navegador (cliente)                │
│                                                  │
│  ┌─────────────┐        ┌────────────────────┐  │
│  │ AiAssistant  │        │   ConceptSuggest   │  │
│  │  (flotante)  │        │  (botón en forma)  │  │
│  └──────┬──────┘        └─────────┬──────────┘  │
│         │                         │              │
│         └──────────┬──────────────┘              │
│                    │                             │
│           ┌────────▼────────┐                    │
│           │   useAi.ts      │                    │
│           │  (composable)   │                    │
│           └────────┬────────┘                    │
│                    │ fetch()                      │
└────────────────────┼─────────────────────────────┘
                     │
                     ▼
        ┌────────────────────────┐
        │   DeepSeek API         │
        │   /v1/chat/completions │
        │   Model: v4-flash      │
        └────────────────────────┘
```

> **Nota para producción:** En un entorno bancario real, esta llamada pasaría por un proxy backend propio para no exponer la API key al cliente. Para esta prueba técnica es intencional y está documentado.

---

## ✦ Funcionalidades implementadas

### Bloque 1 · Listado de órdenes
| Funcionalidad | Estado |
|---|---|
| Tabla en desktop con todos los atributos | ✅ |
| Tarjetas apiladas en mobile | ✅ |
| Estados loading, error, vacío (componentes dedicados) | ✅ |
| Paginación servidor-consciente con controles | ✅ |

### Bloque 2 · Filtros
| Funcionalidad | Estado |
|---|---|
| Filtro por estado (todos, BORRADOR, APROBADA, RECHAZADA, PAGADA) | ✅ |
| Búsqueda por nombre de proveedor | ✅ |
| Filtros combinados en AND | ✅ |
| Sincronización con URL query params | ✅ |

### Bloque 3 · Formulario de creación
| Funcionalidad | Estado |
|---|---|
| Validaciones por campo (proveedor, monto, concepto) | ✅ |
| Contador de caracteres visible (250 max) | ✅ |
| Mensajes de error a nivel de campo | ✅ |
| Botón deshabilitado mientras inválido o enviando | ✅ |
| Redirección al listado tras éxito, sin recarga completa | ✅ |

### Bloque 4 · Detalle y transiciones
| Funcionalidad | Estado |
|---|---|
| Vista de detalle con toda la información | ✅ |
| Transiciones según reglas de negocio | ✅ |
| Confirmación modal antes de transicionar | ✅ |
| Manejo de error en transición | ✅ |
| Optimistic update para feedback inmediato | ✅ |

### Bloque 5 · Calidad transversal
| Funcionalidad | Estado |
|---|---|
| Componentes pequeños con responsabilidad única | ✅ |
| Uso consciente de estado local vs Pinia (ver Decisiones) | ✅ |
| Diseño responsivo (3 breakpoints) | ✅ |
| Pruebas unitarias (2 componentes, 11 tests) | ✅ |

### Bloque 6 · Extras
| Funcionalidad | Estado |
|---|---|
| Composable `useApi` (loading/error unificado) | ✅ |
| Optimistic updates | ✅ |
| Modo oscuro con toggle | ✅ |
| Transiciones suaves (modal, asistente) | ✅ |
| **Asistente IA con DeepSeek** (copiloto + sugerencias) | ✅ |
| Atajos de teclado | ⏳ Pendiente |

---

## ✦ Capturas

### Desktop
![Listado de órdenes](screenshots/desktop-listado.png)
![Detalle de orden](screenshots/desktop-detalle.png)
![Asistente IA](screenshots/desktop-ia.png)

### Mobile
![Listado mobile](screenshots/mobile-listado.png)
![Formulario creación](screenshots/mobile-creacion.png)

---

## ✦ Stack tecnológico

| Herramienta | Versión | ¿Por qué? |
|---|---|---|
| **Vue 3** + Composition API | 3.5 | Reactividad granular, `<script setup>`, composables |
| **TypeScript** | 6.0 | Tipado estricto, autocompletado, documentación viva |
| **Vite** | 6.4 | Dev server inmediato, HMR instantáneo, build optimizado |
| **Pinia** | 3.0 | Estado global tipado, DevTools, modular por dominio |
| **Vue Router** | 4.5 | Lazy loading, query params reactivos |
| **Axios** | 1.7 | Interceptors, tipado de respuestas, más ergonómico que fetch |
| **PrimeVue** | 4.3 | DataTable con sort/filter/paginator integrados, componentes maduros |
| **Tailwind CSS** | 4.1 | Utilidades puras, sin componentes pesados, bundle mínimo |
| **MSW** | 2.7 | Intercepción de red sin servidor externo, ideal para demos |
| **Vitest** + VTU | 3.2 | Nativo de Vite, rápido, API idéntica a Jest |
| **DeepSeek API** | v4-flash | Modelo rápido, económico, compatible OpenAI API |

### Decisiones de diseño

<details>
<summary><strong>🎯 Tailwind CSS en lugar de PrimeVue / Vuetify / Element Plus</strong></summary>

El enunciado pide **componentización clara** y **responsividad cuidada**. Las bibliotecas de componentes agregan 200-500KB de CSS no utilizado, estilos difíciles de sobrescribir y una capa de abstracción que oscurece la responsabilidad de cada componente. Tailwind permite construir componentes a medida de forma declarativa, con props explícitas y cero estilos muertos. En un entorno bancario, cada KB importa.
</details>

<details>
<summary><strong>🎯 PrimeVue para DataTable en lugar de tabla manual</strong></summary>

PrimeVue DataTable proporciona ordenamiento por columnas, filtros, paginación integrada y modo oscuro out-of-the-box. Reemplazar esto con una tabla manual habría requerido cientos de líneas de código adicional. Se eligió PrimeVue específicamente por su DataTable, y el resto de componentes (Tag, Dialog, InputText, Select, Button) se usan por consistencia visual. El bundle de PrimeVue se importa bajo demanda.
</details>

<details>
<summary><strong>🎯 MSW en lugar de json-server</strong></summary>

MSW (Mock Service Worker) intercepta las peticiones de red a nivel de Service Worker del navegador. Esto significa: **(a)** no hay que levantar un proceso backend separado, **(b)** la app funciona con un solo comando, **(c)** los mocks son código TypeScript que se versiona, y **(d)** se pueden simular delays, errores, y estados realistas. json-server requeriría `npm run dev` + `npm run api` y un puerto adicional.
</details>

<details>
<summary><strong>🎯 Axios en lugar de fetch nativo</strong></summary>

Axios provee transformación automática de JSON, interceptores para manejo global de errores, tipado de respuestas, y una API más legible para parámetros de query. El enunciado lo ofrece como opción y es el estándar en la industria financiera.
</details>

<details>
<summary><strong>🎯 Paginación del lado del servidor</strong></summary>

El mock de API recibe `?page=` y `?q=` y retorna solo 10 registros por página más el total. Elegí paginación servidora porque en banca empresarial real una tabla de pagos puede tener millones de registros — la paginación cliente no escala. El frontend nunca tiene más de 10 órdenes en memoria.
</details>

<details>
<summary><strong>🎯 Estado local vs Pinia (global)</strong></summary>

| Criterio | Pinia (global) | Local (composable/ref) |
|---|---|---|
| Órdenes (listado y detalle) | ✅ Se comparten entre vistas via `orderStore` | ❌ |
| Estado de carga/error de API | ✅ `listApi` y `detailApi` en store | ❌ |
| Formulario de creación | ❌ | ✅ `proveedor`, `monto`, `concepto` son transitorios |
| Filtros activos | ❌ | ✅ `useFilters` se sincroniza con URL |
| Tema oscuro | ❌ | ✅ `useDarkMode` es puramente visual |

</details>

---

## ✦ Arquitectura del proyecto

```
src/
├── api/
│   └── client.ts            # Axios instance + funciones tipadas (fetchOrders, createOrder, etc.)
│
├── components/
│   ├── ai/
│   │   ├── AiAssistant.vue   # Chat flotante conectado a DeepSeek
│   │   └── ConceptSuggest.vue # Botón "Sugerir con IA" en el formulario
│   ├── orders/
│   │   ├── OrderTable.vue    # Vista desktop: tabla con todos los atributos
│   │   ├── OrderCard.vue     # Vista mobile: tarjetas apiladas
│   │   ├── OrderFilters.vue  # Input búsqueda + select estado
│   │   └── Pagination.vue    # Controles Anterior/Siguiente
│   ├── shared/
│   │   ├── StatusBadge.vue   # Indicador visual de estado (4 colores)
│   │   ├── ConfirmDialog.vue # Modal de confirmación reutilizable
│   │   ├── LoadingState.vue  # Spinner con mensaje
│   │   ├── ErrorState.vue    # Ícono de error con mensaje
│   │   ├── EmptyState.vue    # Indicador de lista vacía
│   │   └── AppHeader.vue     # Header con navegación y toggle dark mode
│   └── __tests__/
│       ├── StatusBadge.test.ts
│       └── OrderFilters.test.ts
│
├── composables/
│   ├── useApi.ts             # Manejo unificado de loading/error para promesas
│   ├── useFilters.ts         # Filtros reactivos sincronizados con URL query params
│   ├── useDarkMode.ts        # Toggle modo oscuro con clase .dark en <html>
│   └── useAi.ts              # Integración DeepSeek API (chat + suggestConcept)
│
├── mocks/
│   ├── handlers.ts           # 4 endpoints REST: GET list, GET detail, POST create, PATCH status
│   └── browser.ts            # Setup de MSW Worker
│
├── router/
│   └── index.ts              # 3 rutas con lazy loading
│
├── stores/
│   └── orderStore.ts         # Pinia store con optimistic updates
│
├── types/
│   └── order.ts              # Interfaces, constantes (STATUS_TRANSITIONS, LABELS, COLORS)
│
└── views/
    ├── OrderList.vue          # Listado + filtros + paginación + estados
    ├── OrderCreate.vue        # Formulario con validaciones
    └── OrderDetail.vue        # Detalle + transiciones + confirmación
```

---

## ✦ Primeros pasos

### Requisitos
- Node.js ≥ 20.18
- npm ≥ 10

### Instalación

```bash
# 1. Clonar
git clone <url-del-repositorio>
cd ginko-payments

# 2. Dependencias
npm install

# 3. (Opcional) API key de DeepSeek para el asistente IA
cp .env.example .env
# Editar .env con tu clave:
#   VITE_DEEPSEEK_API_KEY=sk-tu-clave
#   VITE_DEEPSEEK_MODEL=deepseek-v4-flash

# 4. ¡A volar!
npm run dev
```

Abrir `http://localhost:5173`. La app arranca con **53 órdenes de pago semilla** con datos colombianos realistas.

### Pruebas

```bash
npm test           # 11 tests, < 1 segundo
npm run test:watch # Modo desarrollo
```

### Build

```bash
npm run build      # → dist/
npm run preview    # Servir build local
```

---

## ✦ Historial de commits

```
1159019 feat: botón mobile 'Nueva' size small, h1 mobile text-xl
a33c971 fix: envuelve NewOrderButton en div hidden lg:block
21f12db fix: unifica size medium en NewOrderButton mobile y desktop
da65a29 fix: mueve CSS del badge N a style.css (global)
93c74f5 refactor: NewOrderButton componente compartido
4ed5303 chore: favicon apunta a favicon.png
f265a51 feat: header responsive - h1 y botón se mueven a OrderList en mobile
2ed938a fix: agrega deep: true al watch de filters
41fb47e fix: usa :deep() para badge N visible
87ffe3b feat: indicador de tecla N en botón Nueva orden
a293888 feat: indicador de tecla / dentro del input de búsqueda
d03968f fix: zebra stripes con slate-700/slate-800
b57875a fix: dark mode usa p-row-even/p-row-odd
2369f77 fix: simplifica dark mode tabla con hex directos
f655e92 fix: dark mode tabla con zebra stripes, paginator, select
525c19c fix: force overrides con selectores CSS directos
d32b773 fix: overrides de PrimeVue dark mode
4691a83 fix: migra todos los colores de gray a slate
c2f8157 fix: PrimeVue surface colors slate a gray
e27091a fix: fondo unificado bg-gray-50 / dark:bg-gray-900
04b8940 feat: panel IA siempre visible en xl
565160b fix: animación 300ms + unifica stone→gray
7cd2983 feat: conceptos variados en seed, tabla text-sm
357f9ec feat: orden default por fecha DESC + X cerrar panel IA
661900c feat: columna Monto movida después de Fecha
7777ef2 fix: clase correcta p-datatable-column-header-content
61e385e fix: header Monto alineado a la derecha
a0896d4 fix: header Monto con text-align right
a682305 feat: columna Monto alineada a la derecha
312ffea fix: parseResponse maneja action: null
25ce1d3 fix: diálogo confirmación usa v-if
ba78f9b fix: X del diálogo cierra con @update:visible
6cd7fb4 fix: StatusBadge cambia rounded-full a rounded-md
aa30f08 refactor: StatusBadge como span nativo con Tailwind
e31fa61 fix: seed data determinista con PRNG
1e28d67 fix: transiciones de estado usan Tags en vez de Buttons
a58ce19 fix: reduce tamaños de iconos en AI sidebar
687b2a6 fix: restaura padding del header
062d91a fix: unifica iconos del header con Iconify
50f2815 fix: botón IA usa #icon slot
ead1c4c fix: botón IA al lado derecho del toggle dark mode
f34be9b feat: toggle para mostrar/ocultar panel IA
a2fb10b fix: sidebar IA en flujo flex
bb24bfb feat: sidebar IA ocupa toda la altura
bcead0f feat: cambia tamaño base de text-lg a text-base
6119e2e feat: IA puede ordenar por monto, fecha o proveedor
02b4b77 fix: IA recibe las 53 órdenes completas
d1dc2a2 fix: IA usa allOrders en vez de orders (filtrado)
7356ba4 fix: prompt de DeepSeek más preciso
39d9385 fix: parseResponse con conteo de profundidad de llaves
070be90 fix: parsing robusto de respuestas + markdown
80a5be1 feat: DeepSeek puede ejecutar acciones en la app
3b7e2c7 fix: cubre los 2 FAIL y 3 observaciones
04e7283 fix: asistente IA con contexto real de órdenes
c0d6200 refactor: migración completa a PrimeVue + Iconify + Inter + AI sidebar
43d5703 docs: README pulido para GitHub con badges
d57e17b docs: README del proyecto
62b7582 test: pruebas unitarias de StatusBadge y OrderFilters
e476d4d feat: modo oscuro con toggle manual
3c92a03 feat: asistente IA con DeepSeek
ae98cfb feat: detalle de orden y transiciones de estado
75d782b feat: formulario de creación con validaciones
479fc30 feat: vista de listado con filtros y URL sync
7d13782 feat: componentes base de UI
f4f27d5 feat: modelo de datos, mock API y store central
f10fe0b chore: configuración inicial del proyecto
```

Cada commit es **independiente, compilable y revisable**. 90 commits en total reflejan la evolución completa del proyecto.

---

## ✦ Pendientes y mejoras futuras

Lo que no se completó (con justificación) y cómo se abordaría con más tiempo:

| # | Pendiente | Prioridad | Por qué quedó fuera | Abordaje futuro |
|---|---|---|---|---|
| 1 | **Atajos de teclado** | Media | Requiere mapa de atajos y composable `useKeyboardShortcuts` que no interfiera con inputs | Composable con `onKeyDown` y hotkeys modales |
| 2 | **Animaciones en transiciones del listado** | Baja | El optimistic update ya da feedback inmediato; la animación extra es cosmética | `<TransitionGroup>` en OrderTable y OrderCard |
| 3 | **Modo oscuro persistente** | Baja | El toggle funciona en sesión pero no persiste | `localStorage` en `useDarkMode` |
| 4 | **Manejo de error granular** | Media | Los errores se muestran genéricamente | Mapeo de códigos HTTP a mensajes específicos por dominio |
| 5 | **Responsividad tablet** | Baja | Los breakpoints actuales (768px) funcionan, pero tablet podría beneficiarse de un nivel intermedio | Breakpoint `lg` adicional con layout híbrido |
| 6 | **Pruebas de integración** | Alta | Se priorizaron las unitarias por tiempo (11 tests en 2 componentes) | Cypress o Playwright para flujo crear → detalle → transicionar |
| 7 | **Proxy para API key** | Alta | En producción bancaria la API key no debe exponerse al cliente | Endpoint `/api/ai/proxy` en el backend corporativo |

---

<div align="center">

**Construido con ❤️ para la prueba técnica de Ginko Financial Solutions**

Mayo 2026 · Bogotá, Colombia

</div>
