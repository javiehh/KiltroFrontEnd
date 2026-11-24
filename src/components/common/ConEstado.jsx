/** Indicador de carga. */
export function Cargando({ texto = 'Cargando…' }) {
  return (
    <div className="text-center py-5" role="status" data-testid="cargando">
      <div className="spinner-border text-primary" aria-hidden="true" />
      <p className="mt-3 text-secondary mb-0">{texto}</p>
    </div>
  );
}

/** Mensaje de error con botón para reintentar. */
export function ErrorCarga({ mensaje, onReintentar }) {
  return (
    <div className="alert alert-danger text-center my-4" role="alert" data-testid="error-carga">
      <p className="mb-2">{mensaje}</p>
      {onReintentar && <button type="button" className="btn btn-outline-danger btn-sm" onClick={onReintentar}>Reintentar</button>}
    </div>
  );
}

/**
 * Las tres situaciones de una pantalla que pide datos al servidor: cargando, error o datos listos.
 * `listo` indica que ya hay datos para mostrar; los hijos pueden ser una función, que solo se ejecuta cuando hay datos.
 */
export default function ConEstado({ listo, cargando, error, onReintentar, children }) {
  if (!listo && cargando) return <Cargando />;
  if (!listo && error) return <ErrorCarga mensaje={error} onReintentar={onReintentar} />;
  if (!listo) return null;
  return typeof children === 'function' ? children() : children;
}

/** Atajo para pantallas que usan useApi: muestra cargando / error y, cuando hay datos, llama a children(datos). */
export function ConConsulta({ consulta, children }) {
  return (
    <ConEstado listo={consulta.datos !== null} cargando={consulta.cargando} error={consulta.error} onReintentar={consulta.recargar}>
      {() => children(consulta.datos)}
    </ConEstado>
  );
}
