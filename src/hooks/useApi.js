import { useCallback, useEffect, useState } from 'react';
import { mensajeDeError } from '../api/errores.js';

/**
 * Ejecuta una consulta a la API y entrega { datos, cargando, error, recargar }, para que la pantalla muestre
 * "cargando", los datos o el error. Se vuelve a ejecutar cuando cambia algo de `dependencias` (por ejemplo un id de la URL).
 *
 * recargar() repite la consulta CONSERVANDO los datos que ya había (la lista no parpadea); en cambio, si
 * cambian las dependencias, los datos anteriores se descartan (no se ve un instante el producto anterior).
 */
export function useApi(consulta, dependencias = []) {
  const clave = JSON.stringify(dependencias);
  const [estado, setEstado] = useState({ clave, datos: null, cargando: true, error: '' });
  const [intento, setIntento] = useState(0);

  useEffect(() => {
    let vigente = true;
    setEstado((previo) => ({ clave, datos: previo.clave === clave ? previo.datos : null, cargando: true, error: '' }));
    Promise.resolve()
      .then(consulta)
      .then((datos) => vigente && setEstado({ clave, datos, cargando: false, error: '' }))
      .catch((error) =>
        vigente && setEstado({ clave, datos: null, cargando: false, error: mensajeDeError(error, 'No se pudo cargar la información.') }));
    return () => {
      vigente = false; // si la pantalla cambió o se cerró, se ignora la respuesta tardía
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clave, intento]);

  const recargar = useCallback(() => setIntento((n) => n + 1), []);
  return { datos: estado.datos, cargando: estado.cargando, error: estado.error, recargar };
}
