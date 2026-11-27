import { useCallback, useEffect, useState } from 'react';
import { mensajeDeError } from '../api/errores.js';

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
      vigente = false;
    };
  }, [clave, intento]);

  const recargar = useCallback(() => setIntento((n) => n + 1), []);
  return { datos: estado.datos, cargando: estado.cargando, error: estado.error, recargar };
}
