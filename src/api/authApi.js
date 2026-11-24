/** Llamadas de autenticación y perfil a ms-usuarios (puerto 8081). */
import { apiUsuarios } from './http.js';
import { perfilAApi, registroAApi, usuarioDesdeApi } from './adaptadores.js';

export async function iniciarSesion(correo, password) {
  const { data } = await apiUsuarios.post('/api/v1/auth/login', { correo: String(correo).trim(), password });
  return { usuario: usuarioDesdeApi(data.usuario), accessToken: data.accessToken, refreshToken: data.refreshToken };
}

/** Crea una cuenta de Cliente. El servidor también devuelve tokens, pero aquí se pide iniciar sesión aparte. */
export async function registrarCuenta(datos) {
  const { data } = await apiUsuarios.post('/api/v1/auth/registro', registroAApi(datos));
  return usuarioDesdeApi(data.usuario);
}

/** Quién es el dueño del token guardado. Se usa al recargar la página para recuperar la sesión. */
export async function obtenerSesion() {
  const { data } = await apiUsuarios.get('/api/v1/auth/me');
  return usuarioDesdeApi(data);
}

export async function guardarPerfil(datos) {
  const { data } = await apiUsuarios.put('/api/v1/perfil', perfilAApi(datos));
  return usuarioDesdeApi(data);
}
