/** Cálculos para el dashboard y los reportes (funciones puras: reciben los datos, devuelven números). */
import { ESTADOS_ORDEN, ROLES } from './constantes.js';

const pagadas = (ordenes) => ordenes.filter((o) => o.estado === ESTADOS_ORDEN.PAGADA);

export function resumenVentas(ordenes) {
  const ok = pagadas(ordenes);
  const total = ok.reduce((acc, o) => acc + o.total, 0);
  return {
    ordenesPagadas: ok.length,
    ordenesRechazadas: ordenes.filter((o) => o.estado === ESTADOS_ORDEN.RECHAZADA).length,
    ventasTotales: total,
    ticketPromedio: ok.length ? Math.round(total / ok.length) : 0
  };
}

/** Unidades e ingresos por producto, de mayor a menor cantidad vendida. */
export function topProductos(ordenes, limite = 5) {
  const mapa = new Map();
  pagadas(ordenes).forEach((o) =>
    o.items.forEach((i) => {
      const actual = mapa.get(i.productoId) || { productoId: i.productoId, nombre: i.nombre, unidades: 0, ingresos: 0 };
      actual.unidades += i.cantidad;
      actual.ingresos += i.subtotal;
      mapa.set(i.productoId, actual);
    })
  );
  return [...mapa.values()].sort((a, b) => b.unidades - a.unidades).slice(0, limite);
}

export function ventasPorCategoria(ordenes, productos, categorias) {
  const porProducto = new Map(productos.map((p) => [p.id, p.categoriaId]));
  return categorias.map((c) => ({
    categoria: c.nombre,
    ingresos: pagadas(ordenes)
      .flatMap((o) => o.items)
      .filter((i) => porProducto.get(i.productoId) === c.id)
      .reduce((acc, i) => acc + i.subtotal, 0)
  }));
}

export const usuariosPorRol = (usuarios) =>
  Object.values(ROLES).map((rol) => ({ rol, cantidad: usuarios.filter((u) => u.tipo === rol).length }));

export const valorInventario = (productos) => productos.reduce((acc, p) => acc + p.precio * p.stock, 0);
export const unidadesInventario = (productos) => productos.reduce((acc, p) => acc + p.stock, 0);
