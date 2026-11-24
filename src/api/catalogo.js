/**
 * Almacén compartido del catálogo (productos y categorías), que es de lectura pública y cambia poco.
 *
 * Lo usan el menú, el carrito, el inicio, etc. Sin este almacén, cada componente pediría el catálogo por su cuenta
 * y una sola pantalla haría 5 o 6 peticiones iguales. Aquí:
 *  - peticiones simultáneas comparten UNA sola llamada al servidor;
 *  - el resultado se reutiliza durante `vigenciaMs` (30 s);
 *  - después de cambiar algo (crear un producto, comprar...) se llama a invalidar() para recargarlo.
 * Es una función "fábrica" para poder probarla con datos falsos, sin red.
 */
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
    /** Mismo objeto mientras no haya cambios (requisito de useSyncExternalStore). */
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

/** Hay que llamarla después de crear, editar o eliminar productos o categorías, y después de comprar o anular (cambia el stock). */
export const invalidarCatalogo = () => catalogo.invalidar();
