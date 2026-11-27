const env = import.meta.env || {};

export const URLS = {
  usuarios: env.VITE_API_USUARIOS || 'http://localhost:8081',
  productos: env.VITE_API_PRODUCTOS || 'http://localhost:8082',
  ventas: env.VITE_API_VENTAS || 'http://localhost:8083'
};
