/**
 * Clientes HTTP (axios) de los tres microservicios, con dos interceptores:
 *
 *  1) de PETICIÓN: agrega "Authorization: Bearer <token>" y, si el access token está por vencer, lo renueva
 *     ANTES de enviar. Así una compra nunca viaja con un token vencido (el servidor la trataría como compra sin cuenta).
 *  2) de RESPUESTA: si el servidor responde 401, renueva los tokens con el refresh token y repite la petición
 *     UNA sola vez. Si la renovación también falla, cierra la sesión.
 */
import axios from 'axios';
import { URLS } from './config.js';
import { sesion } from './sesion.js';

const RUTAS_DE_AUTENTICACION = ['/auth/login', '/auth/registro', '/auth/refresh'];
const esRutaDeAutenticacion = (url = '') => RUTAS_DE_AUTENTICACION.some((ruta) => url.includes(ruta));

let renovacionEnCurso = null;

/** Pide un par de tokens nuevo. Usa axios "pelado" (sin interceptores) para no entrar en un bucle. */
async function pedirTokensNuevos() {
  const refreshToken = sesion.obtenerRefresh();
  if (!refreshToken) throw new Error('No hay refresh token');
  const { data } = await axios.post(`${URLS.usuarios}/api/v1/auth/refresh`, { refreshToken }, { timeout: 10000 });
  sesion.guardar(data.accessToken, data.refreshToken);
  return data.accessToken;
}

/**
 * Renueva la sesión UNA sola vez aunque la pidan varias peticiones a la vez: las demás esperan la misma
 * promesa. Sin esto, cinco peticiones con el token vencido gastarían cinco veces el refresh token.
 * Si falla, la sesión se cierra y se avisa a la aplicación.
 */
export function renovarSesion(pedir = pedirTokensNuevos) {
  if (!renovacionEnCurso) {
    renovacionEnCurso = pedir()
      .catch((error) => {
        sesion.expirar();
        throw error;
      })
      .finally(() => {
        renovacionEnCurso = null;
      });
  }
  return renovacionEnCurso;
}

export function crearCliente(baseURL, pedirTokens = pedirTokensNuevos) {
  const cliente = axios.create({ baseURL, timeout: 10000 });

  cliente.interceptors.request.use(async (config) => {
    if (esRutaDeAutenticacion(config.url)) return config;
    let token = sesion.obtenerAcceso();
    if (token && sesion.obtenerRefresh() && sesion.estaPorVencer(token)) {
      try {
        token = await renovarSesion(pedirTokens);
      } catch (e) {
        token = null; // la sesión ya se cerró; la petición sigue como anónima
      }
    }
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  });

  cliente.interceptors.response.use(
    (respuesta) => respuesta,
    async (error) => {
      const original = error.config;
      const sinPermisoDeReintento =
        error.response?.status !== 401 || !original || original._reintentado ||
        esRutaDeAutenticacion(original.url) || !sesion.obtenerRefresh();
      if (sinPermisoDeReintento) return Promise.reject(error);

      original._reintentado = true; // evita reintentar en bucle
      try {
        const tokenNuevo = await renovarSesion(pedirTokens);
        original.headers.Authorization = `Bearer ${tokenNuevo}`;
        return cliente(original);
      } catch (e) {
        return Promise.reject(error);
      }
    }
  );
  return cliente;
}

export const apiUsuarios = crearCliente(URLS.usuarios);
export const apiProductos = crearCliente(URLS.productos);
export const apiVentas = crearCliente(URLS.ventas);
