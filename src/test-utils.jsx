import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AuthContext, construirValor } from './context/AuthContext.jsx';
import { ROLES } from './data/constantes.js';
import { vaciarCarrito } from './data/carrito.js';

export function reiniciarTodo() {
  localStorage.clear();
  vaciarCarrito();
}

export const RUN = { ADMIN: '111111111', VENDEDOR: '222222222', CLIENTE: '123456785' };

export const USUARIOS_PRUEBA = {
  [RUN.ADMIN]: { id: 1, run: RUN.ADMIN, nombre: 'Javier', apellidos: 'Herrera', correo: 'javier@gmail.com', tipo: ROLES.ADMIN },
  [RUN.VENDEDOR]: { id: 2, run: RUN.VENDEDOR, nombre: 'Camila', apellidos: 'Soto', correo: 'camila@gmail.com', tipo: ROLES.VENDEDOR },
  [RUN.CLIENTE]: {
    id: 3, run: RUN.CLIENTE, nombre: 'Pedro', apellidos: 'Pérez', correo: 'pedro@gmail.com', tipo: ROLES.CLIENTE,
    region: 'Región Metropolitana de Santiago', comuna: 'Ñuñoa', direccion: 'Los Crisantemos 123'
  }
};

const ICONO = { tipo: 'icono', icono: 'huellas', tile: '#D9A441' };

export const PRODUCTOS_PRUEBA = [
  { id: 1, codigo: 'PER-001', nombre: 'Alimento premium adulto 15kg', descripcion: 'Alimento seco.', precio: 34990, descuento: 15, oferta: true, stock: 24, stockCritico: 5, categoriaId: 1, categoriaNombre: 'Perros', media: ICONO },
  { id: 2, codigo: 'PER-002', nombre: 'Correa y collar de cuero', descripcion: 'Resistente.', precio: 12500, descuento: 0, oferta: false, stock: 15, stockCritico: 3, categoriaId: 1, categoriaNombre: 'Perros', media: ICONO },
  { id: 3, codigo: 'GAT-001', nombre: 'Rascador de 3 niveles', descripcion: 'Para gatos.', precio: 18900, descuento: 0, oferta: false, stock: 8, stockCritico: 2, categoriaId: 2, categoriaNombre: 'Gatos', media: ICONO },
  { id: 6, codigo: 'AVE-001', nombre: 'Jaula mediana', descripcion: 'Para aves.', precio: 25000, descuento: 0, oferta: false, stock: 3, stockCritico: 1, categoriaId: 3, categoriaNombre: 'Aves', media: ICONO }
];
export const CATEGORIAS_PRUEBA = [
  { id: 1, nombre: 'Perros', descripcion: 'Todo para perros', icono: 'huellas', tile: '#D9A441', cantidadProductos: 2 },
  { id: 2, nombre: 'Gatos', descripcion: 'Todo para gatos', icono: 'huellas', tile: '#D9A441', cantidadProductos: 1 },
  { id: 3, nombre: 'Aves', descripcion: 'Todo para aves', icono: 'huellas', tile: '#D9A441', cantidadProductos: 1 }
];

export function renderConApp(ui, { ruta = '/', usuarioRun = null, cargando = false } = {}) {
  const usuario = usuarioRun ? USUARIOS_PRUEBA[usuarioRun] : null;
  return render(
    <MemoryRouter initialEntries={[ruta]}>
      <AuthContext.Provider value={construirValor({ usuario, cargando })}>{ui}</AuthContext.Provider>
    </MemoryRouter>
  );
}
