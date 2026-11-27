import { apiUsuarios } from './http.js';
import { perfilAApi, registroAApi, usuarioDesdeApi } from './adaptadores.js';

export async function iniciarSesion(correo, password) {
  const { data } = await apiUsuarios.post('/api/v1/auth/login', { correo: String(correo).trim(), password });
  return { usuario: usuarioDesdeApi(data.usuario), accessToken: data.accessToken, refreshToken: data.refreshToken };
}

export async function registrarCuenta(datos) {
  const { data } = await apiUsuarios.post('/api/v1/auth/registro', registroAApi(datos));
  return usuarioDesdeApi(data.usuario);
}

export async function obtenerSesion() {
  const { data } = await apiUsuarios.get('/api/v1/auth/me');
  return usuarioDesdeApi(data);
}

export async function guardarPerfil(datos) {
  const { data } = await apiUsuarios.put('/api/v1/perfil', perfilAApi(datos));
  return usuarioDesdeApi(data);
}
