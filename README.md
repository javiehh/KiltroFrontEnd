# Kiltro — Tienda online para mascotas (React + Bootstrap)

Evaluación Parcial 2 · DSY1104 Desarrollo Fullstack II · Duoc UC.
Migración del proyecto HTML/CSS/JS de la Evaluación 1 a **React**, con **Bootstrap**, una fuente de datos simulada con
**CRUD + persistencia**, nuevas vistas (categorías, checkout, ofertas, panel de administración ampliado) y pruebas con **Jasmine + Karma**.

## Cómo ejecutarlo

Requisitos: Node.js 18+ y Google Chrome (para las pruebas).

```bash
npm install            # instala dependencias
npm run dev            # servidor de desarrollo → http://localhost:5173
npm run build          # compila para producción (carpeta dist/)
npm test               # ejecuta las pruebas unitarias (Jasmine + Karma, Chrome headless)
npm run test:coverage  # pruebas + informe de cobertura (carpeta coverage/)
```

Si Karma no encuentra Chrome: `CHROME_BIN=/ruta/a/chrome npm test`.

## Cuentas de prueba

| Rol | Correo | Contraseña | Acceso |
|---|---|---|---|
| Administrador | javier@gmail.com | admin1 | Todo el panel |
| Vendedor | camila@gmail.com | vende1 | Productos y órdenes (solo lectura), perfil |
| Cliente | pedro@gmail.com | cliente1 | Solo la tienda |

## Mapa de navegación (Figuras 2, 3 y 10 del Anexo)

**Tienda:** Home · Productos · Detalle de producto · Categorías · Categoría #N · Ofertas · Carrito · Checkout · Compra exitosa · Pago con error · Iniciar sesión · Registro · Nosotros · Blog · Detalle de blog · Contacto.

**Panel (`/admin`):** Dashboard · Órdenes/Boletas · Mostrar boleta · Productos (listado, mostrar, nuevo, editar, **críticos**, **reportes**) · Categorías (listado, nueva, editar) · Usuarios (listado, mostrar, nuevo, editar, **historial de compras**) · Reportes · Perfil.

## Cómo se cumple cada requisito de la rúbrica

| Requisito | Dónde está |
|---|---|
| Migración de HTML a React (componentes reutilizables, estado y props) | `src/components`, `src/pages`, `src/hooks` |
| Archivo JS de datos simulado con CRUD | `src/data/db.js` (`crearRepositorio`: listar / obtener / crear / actualizar / eliminar) + `src/data/seed.js` |
| Persistencia conectada a React en tiempo real | `db.js` guarda en `localStorage` y avisa cambios; `src/hooks/useCollection.js` (`useSyncExternalStore`) redibuja la UI |
| Diseño responsivo con Bootstrap | `bootstrap` + `react-bootstrap` (Navbar, Carousel, grillas, tablas); tema en `src/styles/theme.css` |
| Vistas adicionales | Categorías, Ofertas, Checkout, Pago correcto/error, Órdenes/Boletas, Críticos, Reportes, Historial, Perfil |
| Interactividad mejorada | Filtros combinables y buscador (texto, categoría, ofertas, orden), formularios con validación en tiempo real, región→comuna dependientes, carrito en vivo |
| Configuración de Jasmine y Karma | `karma.conf.cjs`, `.babelrc.json`, `test/index.js` |
| Pruebas unitarias | `src/**/*.spec.js(x)` — 10 pruebas (render, render condicional, props, estado, eventos, lógica) |

## Estructura

```
src/
├── data/          db.js (CRUD + persistencia), seed.js, productos.js, carrito.js, ordenes.js, reportes.js
├── hooks/         useCollection, useCart, useForm
├── context/       AuthContext (sesión y roles)
├── utils/         validators.js (RUN módulo 11, correo, largos…), format.js
├── components/
│   ├── common/    Button, FormField, ProductCard, ProductGrid, QuantitySelector, Boleta, …
│   ├── forms/     LoginForm, UserForm (4 modos), ProductForm, CategoryForm, ContactForm
│   └── layout/    Navbar, Footer, StoreLayout, AdminLayout, ProtectedRoute
├── pages/store/   páginas públicas        pages/admin/   páginas del panel
└── App.jsx        rutas (React Router, HashRouter)
```

Principio de *Single Responsibility*: cada componente hace una sola cosa (p. ej. `Button` solo pinta un botón; `FormField` solo un campo con su error;
`useForm` solo maneja el estado/validación; las reglas de negocio viven en `src/data`, no en los componentes).

## Decisiones y limitaciones

- **Sin backend:** la "base de datos" es `db.js` sobre `localStorage`. Las contraseñas se guardan en texto plano **solo por ser una simulación**; con un backend real irían con hash.
- **Pasarela de pago simulada:** en el checkout hay un selector "Pago aprobado / rechazado" (modo demostración) para poder mostrar ambas vistas.
- **Roles:** Administrador (todo), Vendedor (productos y órdenes solo lectura), Cliente (solo tienda). Las rutas se protegen con `ProtectedRoute`.
- `DB_VERSION` (en `db.js`): si cambias los datos de `seed.js`, súbelo para que los navegadores recarguen la semilla.
- Correos: solo `@gmail.com` (regla definida en la evaluación anterior, `DOMINIOS_PERMITIDOS`).
