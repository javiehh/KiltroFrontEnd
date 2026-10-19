import { ICONOS } from '../../data/iconos.js';

/** Muestra la foto del producto o, si no tiene, un ícono SVG sobre un fondo de color. */
export default function ProductMedia({ producto, className = '' }) {
  const { media } = producto;
  if (media.tipo === 'foto') {
    return <img src={media.url} alt={media.alt || producto.nombre} className={`kiltro-media ${className}`} loading="lazy" />;
  }
  return (
    <div className={`kiltro-media kiltro-media--icono ${className}`} style={{ background: media.tile }} role="img" aria-label={producto.nombre}>
      <svg viewBox="0 0 64 64" width="56" height="56" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true"
        dangerouslySetInnerHTML={{ __html: ICONOS[media.icono] || '' }} />
    </div>
  );
}
