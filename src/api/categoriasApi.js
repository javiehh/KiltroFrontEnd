/** Llamadas a ms-productos (puerto 8082): categorías. Cada una trae cantidadProductos. */
import { apiProductos } from './http.js';

const RUTA = '/api/v1/categorias';

export const listarCategorias = async () => (await apiProductos.get(RUTA)).data;
export const obtenerCategoria = async (id) => (await apiProductos.get(`${RUTA}/${id}`)).data;
export const crearCategoria = async (datos) => (await apiProductos.post(RUTA, datos)).data;
export const actualizarCategoria = async (id, datos) => (await apiProductos.put(`${RUTA}/${id}`, datos)).data;
export const eliminarCategoria = async (id) => { await apiProductos.delete(`${RUTA}/${id}`); };
