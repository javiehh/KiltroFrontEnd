/** Encabezado de página: título, subtítulo opcional y acciones (botones) a la derecha. */
export default function PageHeader({ titulo, subtitulo, children, oscuro = false }) {
  return (
    <div className={oscuro ? 'kiltro-page-header py-5 mb-4' : 'mb-4'}>
      <div className={oscuro ? 'container' : ''}>
        <div className="d-flex flex-wrap justify-content-between align-items-center gap-2">
          <div>
            <h1 className="h2 kiltro-heading mb-1">{titulo}</h1>
            {subtitulo && <p className={`mb-0 ${oscuro ? '' : 'text-secondary'}`}>{subtitulo}</p>}
          </div>
          {children && <div className="d-flex gap-2">{children}</div>}
        </div>
      </div>
    </div>
  );
}
