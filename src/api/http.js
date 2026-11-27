import axios from 'axios';
import { URLS } from './config.js';
import { sesion } from './sesion.js';

const RUTAS_DE_AUTENTICACION = ['/auth/login', '/auth/registro', '/auth/refresh'];
const esRutaDeAutenticacion = (url = '') => RUTAS_DE_AUTENTICACION.some((ruta) => url.includes(ruta));

let renovacionEnCurso = null;

async function pedirTokensNuevos() {
  const refreshToken = sesion.obtenerRefresh();
  if (!refreshToken) throw new Error('No hay refresh token');
  const { data } = await axios.post(`${URLS.usuarios}/api/v1/auth/refresh`, { refreshToken }, { timeout: 10000 });
  sesion.guardar(data.accessToken, data.refreshToken);
  return data.accessToken;
}

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
        token = null;
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

      original._reintentado = true;
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
