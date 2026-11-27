import { AxiosError } from 'axios';
import { screen, waitFor } from '@testing-library/react';
import App from './App.jsx';
import { catalogo } from './api/catalogo.js';
import { apiProductos, apiUsuarios, apiVentas } from './api/http.js';
import { agregarAlCarrito } from './data/carrito.js';
import { CATEGORIAS_PRUEBA, PRODUCTOS_PRUEBA, renderConApp, reiniciarTodo, RUN } from './test-utils.jsx';

const BOLETA = {
  id: 7, codigo: 'ORDER10007', fecha: '2026-11-18T22:15:30.123', estado: 'PAGADA', total: 59484, usuarioId: 3,
  cliente: { nombre: 'Pedro', apellidos: 'Pérez', correo: 'pedro@gmail.com' },
  direccion: { calle: 'Los Crisantemos 123', departamento: '', region: 'Región Metropolitana de Santiago', comuna: 'Ñuñoa', indicaciones: '' },
  items: [{ productoId: 1, nombre: 'Alimento premium adulto 15kg', precio: 29742, cantidad: 2, subtotal: 59484 }]
};
const USUARIO_API = (id, rol) => ({
  id, run: `${id}${id}${id}${id}${id}${id}${id}${id}${id}`, nombre: `Usuario${id}`, apellidos: 'Prueba', correo: `u${id}@gmail.com`, rol,
  region: 'Región Metropolitana de Santiago', comuna: 'Ñuñoa', direccion: 'Calle 1', fechaNacimiento: null
});
const USUARIOS = [USUARIO_API(1, 'ADMIN'), USUARIO_API(2, 'VENDEDOR'), USUARIO_API(3, 'CLIENTE')];
const RESUMEN = { cantidadOrdenes: 1, totalVentas: 59484, ticketPromedio: 59484, masVendidos: [{ nombre: 'Alimento premium adulto 15kg', cantidad: 2 }] };

function responder(config, datos) {
  const respuesta = { data: datos, status: datos === undefined ? 404 : 200, statusText: '', headers: {}, config };
  if (datos !== undefined) return Promise.resolve(respuesta);
  respuesta.data = { status: 404, mensaje: 'No existe' };
  return Promise.reject(new AxiosError('HTTP 404', AxiosError.ERR_BAD_REQUEST, config, null, respuesta));
}
const idDe = (url) => Number(url.split('/').filter(Boolean).pop());

const servidorProductos = (config) => {
  const url = config.url;
  if (url.endsWith('/productos/ofertas')) return responder(config, PRODUCTOS_PRUEBA.filter((p) => p.oferta));
  if (url.endsWith('/productos/criticos')) return responder(config, [PRODUCTOS_PRUEBA[3]]);
  if (/\/productos\/\d+$/.test(url)) return responder(config, PRODUCTOS_PRUEBA.find((p) => p.id === idDe(url)));
  if (url.endsWith('/productos')) return responder(config, PRODUCTOS_PRUEBA);
  if (/\/categorias\/\d+$/.test(url)) return responder(config, CATEGORIAS_PRUEBA.find((c) => c.id === idDe(url)));
  if (url.endsWith('/categorias')) return responder(config, CATEGORIAS_PRUEBA);
  return responder(config, undefined);
};
const servidorUsuarios = (config) => {
  const url = config.url;
  if (/\/usuarios\/\d+$/.test(url)) return responder(config, USUARIOS.find((u) => u.id === idDe(url)));
  if (url.endsWith('/usuarios')) return responder(config, USUARIOS);
  return responder(config, undefined);
};
const servidorVentas = (config) => {
  const url = config.url;
  if (url.endsWith('/reportes/resumen')) return responder(config, RESUMEN);
  if (url.includes('/boletas/usuario/')) return responder(config, [BOLETA]);
  if (/\/boletas\/\d+$/.test(url)) return responder(config, BOLETA);
  if (url.endsWith('/boletas/mias') || url.endsWith('/boletas')) return responder(config, [BOLETA]);
  return responder(config, undefined);
};

const esperarCarga = () =>
  waitFor(() => {
    if (screen.queryByTestId('cargando') || screen.queryByTestId('verificando-sesion')) throw new Error('sigue cargando');
  });

const RUTAS_PUBLICAS = ['/', '/productos', '/productos/1', '/ofertas', '/categorias', '/categorias/1', '/carrito', '/checkout', '/contacto', '/compra/exitosa/7', '/compra/error'];
const RUTAS_ADMIN = [
  '/admin', '/admin/ordenes', '/admin/ordenes/7', '/admin/productos', '/admin/productos/1', '/admin/productos/1/editar', '/admin/productos/nuevo',
  '/admin/productos/criticos', '/admin/productos/reportes', '/admin/categorias', '/admin/categorias/nueva', '/admin/categorias/1/editar',
  '/admin/usuarios', '/admin/usuarios/2', '/admin/usuarios/2/editar', '/admin/usuarios/2/historial', '/admin/usuarios/nuevo', '/admin/reportes', '/admin/perfil'
];

describe('Prueba de humo de la aplicación completa', () => {
  beforeEach(async () => {
    reiniciarTodo();
    apiProductos.defaults.adapter = servidorProductos;
    apiUsuarios.defaults.adapter = servidorUsuarios;
    apiVentas.defaults.adapter = servidorVentas;
    await catalogo.invalidar();
    agregarAlCarrito(1, 1);
  });

  RUTAS_PUBLICAS.forEach((ruta) => {
    it(`tienda: ${ruta} carga sin errores (con sesión de Cliente)`, async () => {
      renderConApp(<App />, { ruta, usuarioRun: RUN.CLIENTE });
      await esperarCarga();
      expect(screen.queryByTestId('error-carga')).toBeNull();
      expect(document.body.textContent.length).toBeGreaterThan(80);
    });
  });

  RUTAS_ADMIN.forEach((ruta) => {
    it(`panel: ${ruta} carga sin errores (como Administrador)`, async () => {
      renderConApp(<App />, { ruta, usuarioRun: RUN.ADMIN });
      await esperarCarga();
      expect(screen.queryByTestId('error-carga')).toBeNull();
      expect(screen.queryByTestId('acceso-denegado')).toBeNull();
      expect(document.body.textContent.length).toBeGreaterThan(80);
    });
  });

  it('el Vendedor entra al panel por las órdenes y no ve botones de gestión de productos', async () => {
    renderConApp(<App />, { ruta: '/admin', usuarioRun: RUN.VENDEDOR });
    await screen.findByText('Órdenes y boletas');

    renderConApp(<App />, { ruta: '/admin/productos', usuarioRun: RUN.VENDEDOR });
    await screen.findAllByText('Alimento premium adulto 15kg');
    expect(screen.queryByText('+ Nuevo producto')).toBeNull();
    expect(screen.queryByText('Productos críticos')).toBeNull();
    expect(screen.queryAllByRole('button', { name: /Eliminar/ }).length).toBe(0);
  });

  it('el Vendedor no puede abrir las pantallas del Administrador', async () => {
    renderConApp(<App />, { ruta: '/admin/usuarios', usuarioRun: RUN.VENDEDOR });
    expect(await screen.findByTestId('acceso-denegado')).toBeTruthy();
  });

  it('el Administrador sí ve los botones de gestión de productos', async () => {
    renderConApp(<App />, { ruta: '/admin/productos', usuarioRun: RUN.ADMIN });
    expect(await screen.findByText('+ Nuevo producto')).toBeTruthy();
    expect(screen.getAllByRole('button', { name: /Eliminar/ }).length).toBeGreaterThan(0);
  });

  it('un Cliente no entra al panel', async () => {
    renderConApp(<App />, { ruta: '/admin', usuarioRun: RUN.CLIENTE });
    expect(await screen.findByTestId('acceso-denegado')).toBeTruthy();
  });
});
