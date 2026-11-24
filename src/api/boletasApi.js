/** Llamadas a ms-ventas (puerto 8083): compras, boletas y reportes. */
import { apiVentas } from './http.js';
import { compraAApi } from './adaptadores.js';

const RUTA = '/api/v1/boletas';

/** Registra una compra (201) o falla con 409 (sin stock) / 503 (ms-productos caído). Funciona con o sin sesión. */
export const comprar = async (compra) => (await apiVentas.post(RUTA, compraAApi(compra))).data;

export const misCompras = async () => (await apiVentas.get(`${RUTA}/mias`)).data;
/** ADMIN y VENDEDOR. */
export const listarBoletas = async () => (await apiVentas.get(RUTA)).data;
export const obtenerBoleta = async (id) => (await apiVentas.get(`${RUTA}/${id}`)).data;
/** Solo ADMIN. */
export const boletasDeUsuario = async (usuarioId) => (await apiVentas.get(`${RUTA}/usuario/${usuarioId}`)).data;
/** Solo ADMIN. Al pasar a ANULADA el servidor devuelve el stock al inventario. */
export const cambiarEstado = async (id, estado) => (await apiVentas.patch(`${RUTA}/${id}/estado`, { estado })).data;

/** Solo ADMIN: total vendido, cantidad de boletas, ticket promedio y productos más vendidos. */
export const obtenerResumenVentas = async () => (await apiVentas.get('/api/v1/reportes/resumen')).data;
