import { listarCategorias } from './categoriasApi.js';
import { listarProductos } from './productosApi.js';
import { mensajeDeError } from './errores.js';

export function crearCatalogo({ cargarProductos, cargarCategorias, vigenciaMs = 30000, ahora = () => Date.now() }) {
  let estado = { productos: [], categorias: [], cargado: false, cargando: false, error: '', cargadoEn: 0 };
  let enCurso = null;
  const oyentes = new Set();

  const publicar = (cambios) => {
    estado = { ...estado, ...cambios };
    oyentes.forEach((fn) => fn());
  };

  function cargar({ forzar = false } = {}) {
    if (enCurso) return enCurso;
    if (!forzar && estado.cargado && ahora() - estado.cargadoEn < vigenciaMs) return Promise.resolve();
    publicar({ cargando: true, error: '' });
    enCurso = Promise.all([cargarProductos(), cargarCategorias()])
      .then(([productos, categorias]) =>
        publicar({ productos, categorias, cargado: true, cargando: false, error: '', cargadoEn: ahora() }))
      .catch((error) => publicar({ cargando: false, error: mensajeDeError(error, 'No se pudo cargar el catálogo.') }))
      .finally(() => {
        enCurso = null;
      });
    return enCurso;
  }

  return {
    obtener: () => estado,
    suscribir(fn) {
      oyentes.add(fn);
      return () => oyentes.delete(fn);
    },
    cargar,
    invalidar: () => cargar({ forzar: true })
  };
}

export const catalogo = crearCatalogo({ cargarProductos: listarProductos, cargarCategorias: listarCategorias });

export const invalidarCatalogo = () => catalogo.invalidar();
