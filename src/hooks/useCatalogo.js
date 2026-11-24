import { useEffect, useSyncExternalStore } from 'react';
import { catalogo } from '../api/catalogo.js';

/** Catálogo compartido { productos, categorias, cargado, cargando, error, recargar }. Pide los datos al montar (si no están vigentes). */
export function useCatalogo() {
  const estado = useSyncExternalStore(catalogo.suscribir, catalogo.obtener);
  useEffect(() => {
    catalogo.cargar();
  }, []);
  return { ...estado, recargar: () => catalogo.invalidar() };
}
