/**
 * db.js — "Base de datos" simulada de Kiltro.
 *
 * Cumple el requisito de la Evaluación 2: un archivo JavaScript que actúa como fuente
 * de datos y expone operaciones CRUD (Crear, Leer, Actualizar, Eliminar) por colección.
 *
 *  - Persistencia: todo se guarda en localStorage (clave STORAGE_KEY).
 *  - Datos en tiempo real: cada cambio notifica a los suscriptores; los componentes de
 *    React se suscriben con el hook useCollection (useSyncExternalStore) y se re-renderizan.
 *  - DB_VERSION: si cambia, se vuelve a cargar la semilla (evita datos viejos en el navegador).
 */
import { SEED } from './seed.js';

export const STORAGE_KEY = 'kiltro_react_db';
export const DB_VERSION = 1;

const clonar = (x) => JSON.parse(JSON.stringify(x));
const estadoInicial = () => ({ version: DB_VERSION, ...clonar(SEED) });

function cargar() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const datos = JSON.parse(raw);
      if (datos.version === DB_VERSION) return datos;
    }
  } catch (e) {
    console.warn('No se pudo leer la base de datos guardada, se usa la semilla:', e);
  }
  return estadoInicial();
}

let estado = cargar();
const suscriptores = new Set();

function persistir() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(estado));
  } catch (e) {
    console.warn('No se pudo guardar en localStorage:', e);
  }
}

function emitir() {
  persistir();
  suscriptores.forEach((fn) => fn());
}

/** Permite que React (o cualquiera) se entere de cada cambio. Devuelve la función para cancelar. */
export function suscribir(fn) {
  suscriptores.add(fn);
  return () => suscriptores.delete(fn);
}

/** Vuelve a los datos de ejemplo (útil en pruebas y para "reiniciar" la demo). */
export function reiniciarDb() {
  estado = estadoInicial();
  emitir();
}

/**
 * Crea un repositorio CRUD para una colección.
 * @param {string} coleccion nombre de la colección dentro del estado
 * @param {string} campoId   propiedad que identifica cada registro ('id', 'run', 'numero'...)
 */
export function crearRepositorio(coleccion, campoId = 'id') {
  const leer = () => estado[coleccion];
  const escribir = (lista) => {
    estado = { ...estado, [coleccion]: lista };
    emitir();
  };

  return {
    coleccion,
    campoId,
    /** READ: todos los registros (mismo arreglo mientras no haya cambios → compatible con React) */
    listar: leer,
    /** READ: un registro por su identificador */
    obtener: (id) => leer().find((r) => String(r[campoId]) === String(id)),
    /** CREATE: agrega un registro. Si el id es numérico y no viene, se autogenera. */
    crear(datos) {
      let registro = { ...datos };
      if (registro[campoId] === undefined) {
        registro[campoId] = leer().reduce((max, r) => Math.max(max, Number(r[campoId]) || 0), 0) + 1;
      }
      if (leer().some((r) => String(r[campoId]) === String(registro[campoId]))) {
        throw new Error(`Ya existe un registro con ${campoId} = ${registro[campoId]} en ${coleccion}`);
      }
      escribir([...leer(), registro]);
      return registro;
    },
    /** UPDATE: mezcla los cambios sobre el registro existente */
    actualizar(id, cambios) {
      const existente = this.obtener(id);
      if (!existente) throw new Error(`No existe ${coleccion} con ${campoId} = ${id}`);
      const actualizado = { ...existente, ...cambios, [campoId]: existente[campoId] };
      escribir(leer().map((r) => (r === existente ? actualizado : r)));
      return actualizado;
    },
    /** DELETE: elimina el registro; devuelve true si existía */
    eliminar(id) {
      const existe = Boolean(this.obtener(id));
      if (existe) escribir(leer().filter((r) => String(r[campoId]) !== String(id)));
      return existe;
    }
  };
}

export const categoriasRepo = crearRepositorio('categorias', 'id');
export const productosRepo = crearRepositorio('productos', 'id');
export const usuariosRepo = crearRepositorio('usuarios', 'run');
export const ordenesRepo = crearRepositorio('ordenes', 'numero');
export const mensajesRepo = crearRepositorio('mensajes', 'id');
