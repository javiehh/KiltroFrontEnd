import { useSyncExternalStore } from 'react';
import { suscribir } from '../data/db.js';

/**
 * Conecta una colección de db.js con React: el componente se vuelve a dibujar
 * automáticamente cada vez que alguien crea, actualiza o elimina registros.
 */
export function useCollection(repositorio) {
  return useSyncExternalStore(suscribir, repositorio.listar);
}
