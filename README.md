# Ginko Payments

Aplicación web para gestión de órdenes de pago a proveedores, desarrollada como parte del proceso técnico de **Ginko Financial Solutions**.

---

## Stack tecnológico

| Herramienta | Versión | Propósito |
|---|---|---|
| Vue 3 (Composition API) | 3.5 | Framework frontend |
| TypeScript | 6.0 | Tipado estático |
| Vite | 6.4 | Bundler y dev server |
| Pinia | 3.0 | Estado global |
| Vue Router | 4.5 | Enrutamiento |
| Axios | 1.7 | Cliente HTTP |
| Tailwind CSS | 4.1 | Estilos utilitarios |
| MSW | 2.7 | Mock de API (intercepción de red) |
| Vitest | 3.2 | Framework de pruebas |
| Vue Test Utils | 2.4 | Utilidades para pruebas de componentes |
| DeepSeek API | v4 flash | Asistente IA |

### Decisiones técnicas

**¿Por qué Tailwind CSS y no una librería de componentes (PrimeVue, Vuetify, etc.)?**
El enunciado pide componentización clara y responsividad cuidada. Tailwind permite construir componentes a medida sin arrastrar el peso de bibliotecas completas. Los componentes son más pequeños, las props/responsabilidades más explícitas, y el bundle final es significativamente menor. No hay estilos no utilizados.

**¿Por qué MSW y no json-server?**
MSW intercepta peticiones a nivel de Service Worker, lo que elimina la necesidad de un proceso de backend separado. La app se levanta con un solo comando (`npm run dev`) y los mocks conviven con el frontend. json-server requeriría un segundo proceso.

**¿Por qué Axios y no Fetch nativo?**
Axios provee una API más ergonómica para transformación de respuestas, manejo de errores y tipado de datos. Es un estándar en la industria y el enunciado lo ofrece como opción.

**¿Paginación del lado del cliente o servidor?**
Mixta. El mock de API recibe `page` y `limit` y retorna una respuesta paginada. El frontend respeta la paginación del servidor sin cargar todos los registros en memoria. Toqué la servidor-paginada porque es lo que ocurre en banca real: millones de registros no caben en el cliente.

**¿Estado local vs Pinia?**
- **Pinia (global)**: datos de órdenes que se comparten entre vistas (listado ↔ detalle). También el estado de carga/error del listado y detalle, porque se consultan desde distintos componentes.
- **Local**: estado de formularios (proveedor, monto, concepto) porque es transitorio y no interesa fuera de la vista de creación. También filtros activos, que viven en el composable `useFilters` y se sincronizan con la URL.

---

## Requisitos previos

- Node.js 20.18+ (o 22+)
- npm 10+
- _(Opcional)_ Clave de API de DeepSeek para el asistente IA

## Instalación y ejecución

```bash
# 1. Clonar el repositorio
git clone <url-del-repositorio>
cd ginko-payments

# 2. Instalar dependencias
npm install

# 3. (Opcional) Configurar DeepSeek API
cp .env.example .env
# Editar .env con tu clave de API:
# VITE_DEEPSEEK_API_KEY=sk-tu-clave-aqui
# VITE_DEEPSEEK_MODEL=deepseek-v4-flash

# 4. Iniciar entorno de desarrollo
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`. No requiere backend externo — MSW intercepta todas las llamadas a `/api/*`.

## Ejecutar pruebas

```bash
# Una vez
npm test

# En modo watch (para desarrollo)
npm run test:watch
```

## Build de producción

```bash
npm run build
npm run preview   # Servir el build localmente
```

---

## Funcionalidades implementadas

### Bloque 1 — Listado de órdenes
- Tabla en desktop con todos los atributos
- Tarjetas apiladas en mobile
- Estados loading, error y vacío con componentes dedicados
- Paginación servidor-consciente con controles Anterior/Siguiente

### Bloque 2 — Filtros
- Filtro por estado (todos, BORRADOR, APROBADA, RECHAZADA, PAGADA)
- Búsqueda por nombre de proveedor
- Filtros combinados en AND
- Sincronización con URL query params (se conservan al recargar)

### Bloque 3 — Formulario de creación
- Validación por campo con mensajes específicos
- Contador de caracteres en concepto (máx. 250)
- Botón deshabilitado mientras el formulario es inválido
- Redirección al listado tras crear exitosamente

### Bloque 4 — Detalle y transiciones de estado
- Vista de detalle con toda la información de la orden
- Botones de transición según reglas de negocio
- Confirmación modal antes de cambiar estado
- Manejo de error si la transición falla
- Optimistic update para feedback inmediato

### Bloque 5 — Calidad transversal
- Componentes pequeños con responsabilidad única
- Decisiones de estado local vs Pinia documentadas
- Diseño responsivo: mobile (< 768px), tablet (768-1024px), desktop (> 1024px)
- Pruebas unitarias (11 tests en 2 componentes)

### Bloque 6 — Funcionalidades adicionales
- Composable `useApi` con manejo unificado de loading/error
- Optimistic updates en transiciones de estado
- Modo oscuro con toggle manual
- Transiciones suaves en confirm dialog y asistente IA
- **Asistente IA con DeepSeek API** (chat copiloto + sugerencia de concepto en formulario)

---

## Feature IA: Asistente con DeepSeek

La aplicación integra un **asistente inteligente** potenciado por la API de DeepSeek (modelo `deepseek-v4-flash`).

### Funcionalidades

1. **Chat copiloto**: botón flotante en la esquina inferior derecha que abre un chat. El usuario puede preguntar en lenguaje natural sobre el contexto de la aplicación.

2. **Sugerencia de concepto**: en el formulario de creación, un botón "✨ Sugerir con IA" envía el nombre del proveedor y el monto a DeepSeek, que genera automáticamente un concepto de pago profesional.

### Arquitectura

No requiere backend propio. La comunicación es directa desde el frontend a la API de DeepSeek usando `fetch`. La clave se configura via `VITE_DEEPSEEK_API_KEY` en `.env`.

> **Nota**: En producción bancaria real, esta llamada debería pasar por un proxy propio para no exponer la API key al cliente. Para efectos de esta prueba técnica es aceptable.

---

## Capturas

_(Sección opcional - agregar capturas aquí)_

---

## Pendientes

Lo que no se completó y por qué:

1. **Atajos de teclado**: No se implementaron. Se documenta como mejora futura. Requiere definir un mapa de atajos y un composable `useKeyboardShortcuts` que no interfiera con inputs de formularios.

2. **Animaciones en transiciones del listado**: Las transiciones de estado (cambio de estado en el listado) no tienen animación visual más allá del optimistic update. Para una animación completa habría que agregar un `<TransitionGroup>` en OrderTable y OrderCard.

3. **Modo oscuro persistente**: El toggle de modo oscuro funciona en sesión pero no persiste la preferencia. Se podría agregar `localStorage` en el composable `useDarkMode` para recordar la elección.

4. **Manejo de error granular en transiciones**: Actualmente el error se muestra genéricamente. Se podría mapear códigos de error HTTP a mensajes específicos.

5. **Responsividad más fina**: Los breakpoints están en 768px (`md` de Tailwind). Funciona bien en mobile y desktop pero la transición tablet podría beneficiarse de un breakpoint intermedio adicional (ej. `lg` para la tabla).

6. **Pruebas de integración**: Solo hay pruebas unitarias. Faltan pruebas de integración sobre el flujo completo (crear → listar → detalle → transicionar). Se priorizaron las pruebas unitarias por tiempo.

7. **Historial de commits**: El historial está presente pero el primer commit debió ser más granular. Los commits 1-6 reflejan bien la progresión de features.

---

## Estructura del proyecto

```
src/
├── api/                # Cliente Axios con funciones tipadas
├── components/
│   ├── ai/             # AiAssistant (copiloto), ConceptSuggest (sugerencia)
│   ├── orders/         # OrderTable, OrderCard, OrderFilters, Pagination
│   ├── shared/         # StatusBadge, ConfirmDialog, LoadingState, ErrorState, EmptyState, AppHeader
│   └── __tests__/      # Pruebas unitarias
├── composables/        # useApi, useFilters, useDarkMode, useAi
├── mocks/              # MSW handlers + seed data (53 órdenes)
├── router/             # Configuración de rutas
├── stores/             # orderStore (Pinia)
├── types/              # Order, OrderStatus, constantes
└── views/              # OrderList, OrderCreate, OrderDetail
```
