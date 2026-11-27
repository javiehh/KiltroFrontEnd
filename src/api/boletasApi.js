import { apiVentas } from './http.js';
import { compraAApi } from './adaptadores.js';

const RUTA = '/api/v1/boletas';

export const comprar = async (compra) => (await apiVentas.post(RUTA, compraAApi(compra))).data;

export const misCompras = async () => (await apiVentas.get(`${RUTA}/mias`)).data;
export const listarBoletas = async () => (await apiVentas.get(RUTA)).data;
export const obtenerBoleta = async (id) => (await apiVentas.get(`${RUTA}/${id}`)).data;
export const boletasDeUsuario = async (usuarioId) => (await apiVentas.get(`${RUTA}/usuario/${usuarioId}`)).data;
export const cambiarEstado = async (id, estado) => (await apiVentas.patch(`${RUTA}/${id}/estado`, { estado })).data;

export const obtenerResumenVentas = async () => (await apiVentas.get('/api/v1/reportes/resumen')).data;
