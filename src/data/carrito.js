/**
 * Carrito de compras: se guarda en localStorage (como pide el Anexo) y notifica cambios
 * para que la interfaz (React) se actualice al instante.
 * Solo se guarda { id, cantidad }: el precio y el nombre se calculan siempre desde el catálogo.
 */
import { precioFinal } from './productos.js';

export const CARRITO_KEY = 'kiltro_react_carrito';
const suscriptores = new Set();

function leer() {
  try {
    return JSON.parse(localStorage.getItem(CARRITO_KEY)) || [];
  } catch (e) {
    return [];
  }
}

let items = leer();

function emitir() {
  try {
    localStorage.setItem(CARRITO_KEY, JSON.stringify(items));
  } catch (e) {
    console.warn('No se pudo guardar el carrito:', e);
  }
  suscriptores.forEach((fn) => fn());
}

export const carritoStore = {
  suscribir(fn) {
    suscriptores.add(fn);
    return () => suscriptores.delete(fn);
  },
  /** Mismo arreglo mientras no haya cambios (requisito de useSyncExternalStore) */
  obtener: () => items
};

/** Agrega unidades; nunca deja la cantidad por encima del stock disponible. */
export function agregarAlCarrito(id, cantidad = 1, stockMaximo = Infinity) {
  const existente = items.find((i) => i.id === id);
  const nueva = Math.min((existente ? existente.cantidad : 0) + cantidad, stockMaximo);
  if (nueva <= 0) return;
  items = existente ? items.map((i) => (i.id === id ? { ...i, cantidad: nueva } : i)) : [...items, { id, cantidad: nueva }];
  emitir();
}

export function cambiarCantidad(id, cantidad) {
  items = cantidad <= 0 ? items.filter((i) => i.id !== id) : items.map((i) => (i.id === id ? { ...i, cantidad } : i));
  emitir();
}

export const quitarDelCarrito = (id) => cambiarCantidad(id, 0);

export function vaciarCarrito() {
  items = [];
  emitir();
}

/** Combina las líneas del carrito con los datos actuales del catálogo. */
export function detalleCarrito(lineas, productos) {
  return lineas
    .map((linea) => {
      const producto = productos.find((p) => p.id === linea.id);
      if (!producto) return null;
      const precio = precioFinal(producto);
      return { producto, cantidad: linea.cantidad, precio, subtotal: precio * linea.cantidad };
    })
    .filter(Boolean);
}

export const totalCarrito = (detalle) => detalle.reduce((acc, l) => acc + l.subtotal, 0);
export const cantidadItems = (lineas) => lineas.reduce((acc, l) => acc + l.cantidad, 0);
