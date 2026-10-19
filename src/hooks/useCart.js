import { useMemo, useSyncExternalStore } from 'react';
import { carritoStore, detalleCarrito, totalCarrito, cantidadItems } from '../data/carrito.js';
import { productosRepo } from '../data/db.js';
import { useCollection } from './useCollection.js';

/** Estado derivado del carrito: líneas con datos del producto, total y cantidad de unidades. */
export function useCart() {
  const lineas = useSyncExternalStore(carritoStore.suscribir, carritoStore.obtener);
  const productos = useCollection(productosRepo);
  return useMemo(() => {
    const detalle = detalleCarrito(lineas, productos);
    return { lineas, detalle, total: totalCarrito(detalle), cantidad: cantidadItems(lineas) };
  }, [lineas, productos]);
}
