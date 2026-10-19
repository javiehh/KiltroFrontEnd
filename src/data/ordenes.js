/** Compras: crear la orden, simular el pago y consultar historial. */
import { ordenesRepo, productosRepo } from './db.js';
import { ESTADOS_ORDEN } from './constantes.js';

/** Número de orden con formato AAAAMMDD + correlativo del día (ej: 2026101601). */
export function generarNumeroOrden(fecha = new Date()) {
  const base = fecha.toISOString().slice(0, 10).replace(/-/g, '');
  const delDia = ordenesRepo.listar().filter((o) => o.numero.startsWith(base)).length;
  return base + String(delDia + 1).padStart(2, '0');
}

const generarCodigo = () => 'ORDER' + String(10000 + ordenesRepo.listar().length + 1);

/** Revisa que haya stock para cada línea. Devuelve la lista de problemas (vacía si todo está bien). */
export function validarStock(lineas) {
  return lineas
    .filter((l) => {
      const p = productosRepo.obtener(l.producto?.id ?? l.productoId);
      return !p || l.cantidad > p.stock;
    })
    .map((l) => `No hay stock suficiente de "${l.producto?.nombre ?? l.nombre}".`);
}

/** Copia (snapshot) de precios y nombres al momento de comprar: la boleta no cambia si luego cambia el catálogo. */
export function armarItems(lineas) {
  return lineas.map((l) => ({
    productoId: l.producto.id,
    nombre: l.producto.nombre,
    precio: l.precio,
    cantidad: l.cantidad,
    subtotal: l.subtotal
  }));
}

/** Crea una orden en estado "pendiente". */
export function crearOrden({ cliente, direccion, lineas, usuarioRun = null }) {
  const items = armarItems(lineas);
  return ordenesRepo.crear({
    numero: generarNumeroOrden(),
    codigo: generarCodigo(),
    fecha: new Date().toISOString(),
    estado: ESTADOS_ORDEN.PENDIENTE,
    usuarioRun,
    cliente,
    direccion,
    items,
    total: items.reduce((acc, i) => acc + i.subtotal, 0)
  });
}

/** "Volver a realizar el pago": reutiliza la MISMA orden (mismo número) con los datos actuales del carrito. */
export function reintentarOrden(numero, { cliente, direccion, lineas }) {
  const items = armarItems(lineas);
  return ordenesRepo.actualizar(numero, {
    cliente,
    direccion,
    items,
    total: items.reduce((acc, i) => acc + i.subtotal, 0),
    fecha: new Date().toISOString(),
    estado: ESTADOS_ORDEN.PENDIENTE,
    motivoRechazo: undefined
  });
}

/**
 * Simula la respuesta de la pasarela de pago.
 *  - aprobado: descuenta el stock y deja la orden "pagada" (si de pronto no hay stock, se rechaza).
 *  - rechazado: deja la orden "rechazada" y NO toca el stock.
 */
export function procesarPago(numero, aprobado) {
  const orden = ordenesRepo.obtener(numero);
  if (!orden) throw new Error(`La orden ${numero} no existe`);

  if (aprobado) {
    const sinStock = orden.items.filter((i) => {
      const p = productosRepo.obtener(i.productoId);
      return !p || i.cantidad > p.stock;
    });
    if (sinStock.length === 0) {
      orden.items.forEach((i) => {
        const p = productosRepo.obtener(i.productoId);
        productosRepo.actualizar(p.id, { stock: p.stock - i.cantidad });
      });
      return ordenesRepo.actualizar(numero, { estado: ESTADOS_ORDEN.PAGADA, motivoRechazo: undefined });
    }
    return ordenesRepo.actualizar(numero, { estado: ESTADOS_ORDEN.RECHAZADA, motivoRechazo: 'Stock insuficiente' });
  }
  return ordenesRepo.actualizar(numero, { estado: ESTADOS_ORDEN.RECHAZADA, motivoRechazo: 'Pago rechazado por el emisor' });
}

export const ordenesDeUsuario = (ordenes, run) => ordenes.filter((o) => o.usuarioRun === run);
