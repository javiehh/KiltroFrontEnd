export function mensajeDeError(error, porDefecto = 'Ocurrió un error inesperado. Intenta nuevamente.') {
  if (!error?.response) {
    return 'No se pudo conectar con el servidor. Revisa tu conexión e intenta nuevamente.';
  }
  const { mensaje, errores } = error.response.data || {};
  const detalle = errores ? Object.values(errores).join(' ') : '';
  return [mensaje, detalle].filter(Boolean).join(' ') || porDefecto;
}
