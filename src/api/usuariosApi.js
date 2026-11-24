/** Llamadas a ms-usuarios (puerto 8081): administración de usuarios (solo ADMIN). */
import { apiUsuarios } from './http.js';
import { usuarioAApi, usuarioDesdeApi } from './adaptadores.js';

const RUTA = '/api/v1/usuarios';

export const listarUsuarios = async () => (await apiUsuarios.get(RUTA)).data.map(usuarioDesdeApi);
export const obtenerUsuario = async (id) => usuarioDesdeApi((await apiUsuarios.get(`${RUTA}/${id}`)).data);
export const crearUsuario = async (datos) => usuarioDesdeApi((await apiUsuarios.post(RUTA, usuarioAApi(datos))).data);
export const actualizarUsuario = async (id, datos) => usuarioDesdeApi((await apiUsuarios.put(`${RUTA}/${id}`, usuarioAApi(datos))).data);
export const eliminarUsuario = async (id) => { await apiUsuarios.delete(`${RUTA}/${id}`); };
