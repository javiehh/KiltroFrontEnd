import { useMemo, useSyncExternalStore } from 'react';
import { carritoStore, detalleCarrito, totalCarrito, cantidadItems } from '../data/carrito.js';
import { useCatalogo } from './useCatalogo.js';

/** Estado derivado del carrito: líneas con datos del producto (precio y stock vigentes del servidor), total y cantidad de unidades. */
export function useCart() {
  const lineas = useSyncExternalStore(carritoStore.suscribir, carritoStore.obtener);
  const { productos } = useCatalogo();
  return useMemo(() => {
    const detalle = detalleCarrito(lineas, productos);
    return { lineas, detalle, total: totalCarrito(detalle), cantidad: cantidadItems(lineas) };
  }, [lineas, productos]);
}
