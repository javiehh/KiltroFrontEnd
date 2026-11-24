/**
 * Guarda y consulta los tokens JWT de la sesión.
 *
 * Se usa localStorage: sobrevive a recargar la página (F5) y es simple en una SPA que envía el token en el
 * encabezado Authorization. Su desventaja es que un ataque XSS podría leerlo; la alternativa (cookie HttpOnly)
 * evita eso, pero exige proteger la API contra CSRF y configurar CORS con credenciales.
 */
const ACCESS = 'kiltro_access_token';
const REFRESH = 'kiltro_refresh_token';
const oyentes = new Set();

/** Lee los datos del token (sin verificar la firma: eso solo lo puede hacer el servidor). */
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

  /** true si el token ya venció o vence en menos de `margenSegundos`. */
  estaPorVencer(token, margenSegundos = 30) {
    const payload = leerPayload(token);
    if (!payload || !payload.exp) return false;
    return payload.exp * 1000 - Date.now() < margenSegundos * 1000;
  },

  /** Avisa a la aplicación cuando la sesión se pierde sola (la renovación del token falló). */
  alExpirar(fn) {
    oyentes.add(fn);
    return () => oyentes.delete(fn);
  },

  expirar() {
    sesion.limpiar();
    oyentes.forEach((fn) => fn());
  }
};
