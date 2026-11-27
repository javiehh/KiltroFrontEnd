import { useEffect, useSyncExternalStore } from 'react';
import { catalogo } from '../api/catalogo.js';

export function useCatalogo() {
  const estado = useSyncExternalStore(catalogo.suscribir, catalogo.obtener);
  useEffect(() => {
    catalogo.cargar();
  }, []);
  return { ...estado, recargar: () => catalogo.invalidar() };
}
