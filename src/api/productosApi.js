/** Llamadas a ms-productos (puerto 8082): catálogo, ofertas, stock crítico y CRUD del administrador. */
import { apiProductos } from './http.js';
import { productoAApi } from './adaptadores.js';

const RUTA = '/api/v1/productos';

export const listarProductos = async () => (await apiProductos.get(RUTA)).data;
export const obtenerProducto = async (id) => (await apiProductos.get(`${RUTA}/${id}`)).data;
export const listarOfertas = async () => (await apiProductos.get(`${RUTA}/ofertas`)).data;
/** Solo ADMIN (el servidor responde 403 a otros roles). */
export const listarCriticos = async () => (await apiProductos.get(`${RUTA}/criticos`)).data;

export const crearProducto = async (datos) => (await apiProductos.post(RUTA, productoAApi(datos))).data;
export const actualizarProducto = async (id, datos) => (await apiProductos.put(`${RUTA}/${id}`, productoAApi(datos))).data;
export const eliminarProducto = async (id) => { await apiProductos.delete(`${RUTA}/${id}`); };
