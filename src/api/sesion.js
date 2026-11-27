const ACCESS = 'kiltro_access_token';
const REFRESH = 'kiltro_refresh_token';
const oyentes = new Set();

function leerPayload(token) {
  try {
    const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(atob(base64));
  } catch (e) {
    return null;
  }
}

export const sesion = {
  obtenerAcceso: () => localStorage.getItem(ACCESS),
  obtenerRefresh: () => localStorage.getItem(REFRESH),

  guardar(acceso, refresh) {
    localStorage.setItem(ACCESS, acceso);
    localStorage.setItem(REFRESH, refresh);
  },

  limpiar() {
    localStorage.removeItem(ACCESS);
    localStorage.removeItem(REFRESH);
  },

  hayTokens: () => Boolean(localStorage.getItem(ACCESS) || localStorage.getItem(REFRESH)),

  estaPorVencer(token, margenSegundos = 30) {
    const payload = leerPayload(token);
    if (!payload || !payload.exp) return false;
    return payload.exp * 1000 - Date.now() < margenSegundos * 1000;
  },

  alExpirar(fn) {
    oyentes.add(fn);
    return () => oyentes.delete(fn);
  },

  expirar() {
    sesion.limpiar();
    oyentes.forEach((fn) => fn());
  }
};
