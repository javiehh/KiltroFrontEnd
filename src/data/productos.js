/** Reglas de negocio sobre productos (funciones puras, fáciles de probar). */

/** Precio que realmente paga el cliente: aplica el descuento si el producto está en oferta. */
export function precioFinal(producto) {
  if (producto.oferta && producto.descuento > 0) {
    return Math.round((producto.precio * (100 - producto.descuento)) / 100);
  }
  return producto.precio;
}

export const estaEnOferta = (producto) => Boolean(producto.oferta && producto.descuento > 0);

/** Un producto es "crítico" cuando su stock es igual o inferior al stock crítico definido. */
export const esCritico = (producto) => producto.stock <= (producto.stockCritico ?? 0);

export const productosEnOferta = (productos) => productos.filter(estaEnOferta);
export const productosCriticos = (productos) => productos.filter(esCritico);

/** Filtros combinables del catálogo: texto, categoría, solo ofertas y orden. */
export function filtrarProductos(productos, { texto = '', categoriaId = '', soloOfertas = false, orden = 'nombre' } = {}) {
  const t = texto.trim().toLowerCase();
  let resultado = productos.filter((p) => {
    if (categoriaId && String(p.categoriaId) !== String(categoriaId)) return false;
    if (soloOfertas && !estaEnOferta(p)) return false;
    if (t && !`${p.nombre} ${p.descripcion} ${p.codigo}`.toLowerCase().includes(t)) return false;
    return true;
  });
  const orden_ = {
    nombre: (a, b) => a.nombre.localeCompare(b.nombre),
    'precio-asc': (a, b) => precioFinal(a) - precioFinal(b),
    'precio-desc': (a, b) => precioFinal(b) - precioFinal(a)
  }[orden] || (() => 0);
  return [...resultado].sort(orden_);
}

/**
 * Convierte la URL de imagen del formulario en el "media" del producto:
 * con URL → foto; sin URL → se conserva el ícono actual o se usa el de por defecto.
 */
export function mediaDesdeFormulario(imagenUrl, nombre, mediaActual) {
  if (imagenUrl) return { tipo: 'foto', url: imagenUrl, alt: nombre };
  if (mediaActual && mediaActual.tipo === 'icono') return mediaActual;
  return { tipo: 'icono', icono: 'huellas', tile: '#D9A441' };
}

/** Datos de un producto convertidos a los valores (texto) que espera ProductForm. */
export function productoAFormulario(p) {
  return {
    codigo: p.codigo, categoriaId: String(p.categoriaId), nombre: p.nombre, descripcion: p.descripcion || '',
    precio: String(p.precio), stock: String(p.stock), stockCritico: String(p.stockCritico ?? ''),
    oferta: Boolean(p.oferta), descuento: p.descuento ? String(p.descuento) : '',
    imagenUrl: p.media?.tipo === 'foto' ? p.media.url : ''
  };
}
