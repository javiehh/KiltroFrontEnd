import { ESTADOS_BOLETA, ROLES } from './constantes.js';

const vigentes = (boletas) => boletas.filter((b) => b.estado !== ESTADOS_BOLETA.ANULADA);

export const cantidadAnuladas = (boletas) => boletas.length - vigentes(boletas).length;

export function topProductos(boletas, limite = 5) {
  const mapa = new Map();
  vigentes(boletas).forEach((b) =>
    b.items.forEach((i) => {
      const actual = mapa.get(i.productoId) || { productoId: i.productoId, nombre: i.nombre, unidades: 0, ingresos: 0 };
      actual.unidades += i.cantidad;
      actual.ingresos += i.subtotal;
      mapa.set(i.productoId, actual);
    })
  );
  return [...mapa.values()].sort((a, b) => b.unidades - a.unidades).slice(0, limite);
}

export function ventasPorCategoria(boletas, productos, categorias) {
  const porProducto = new Map(productos.map((p) => [p.id, p.categoriaId]));
  const items = vigentes(boletas).flatMap((b) => b.items);
  return categorias.map((c) => ({
    categoria: c.nombre,
    ingresos: items.filter((i) => porProducto.get(i.productoId) === c.id).reduce((acc, i) => acc + i.subtotal, 0)
  }));
}

export const usuariosPorRol = (usuarios) =>
  Object.values(ROLES).map((rol) => ({ rol, cantidad: usuarios.filter((u) => u.tipo === rol).length }));

export const valorInventario = (productos) => productos.reduce((acc, p) => acc + p.precio * p.stock, 0);
export const unidadesInventario = (productos) => productos.reduce((acc, p) => acc + p.stock, 0);
