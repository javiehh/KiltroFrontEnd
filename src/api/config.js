/**
 * Direcciones de los tres microservicios. Se pueden cambiar con variables de entorno de Vite
 * (archivo .env: VITE_API_USUARIOS, VITE_API_PRODUCTOS, VITE_API_VENTAS); si no existen, se usan los puertos locales.
 */
const env = import.meta.env || {};

export const URLS = {
  usuarios: env.VITE_API_USUARIOS || 'http://localhost:8081',
  productos: env.VITE_API_PRODUCTOS || 'http://localhost:8082',
  ventas: env.VITE_API_VENTAS || 'http://localhost:8083'
};
