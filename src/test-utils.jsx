/**
 * Utilidades compartidas por las pruebas (Jasmine + Karma).
 *  - reiniciarTodo(): deja la "base de datos", el carrito y la sesión como recién instalados
 *  - renderConApp(): dibuja un componente con Router (en memoria) y AuthProvider, como en la app real
 */
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider, SESION_KEY } from './context/AuthContext.jsx';
import { reiniciarDb } from './data/db.js';
import { vaciarCarrito } from './data/carrito.js';

export function reiniciarTodo() {
  localStorage.clear();
  reiniciarDb();
  vaciarCarrito();
}

/** Cuentas de ejemplo de la semilla (ver data/seed.js) */
export const RUN = { ADMIN: '111111111', VENDEDOR: '222222222', CLIENTE: '123456785' };

export function renderConApp(ui, { ruta = '/', usuarioRun = null } = {}) { // ruta: texto o { pathname, state }
  if (usuarioRun) localStorage.setItem(SESION_KEY, usuarioRun);
  return render(
    <MemoryRouter initialEntries={[ruta]}>
      <AuthProvider>{ui}</AuthProvider>
    </MemoryRouter>
  );
}
