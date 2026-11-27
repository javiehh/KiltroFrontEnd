import { ICONOS } from '../../data/iconos.js';

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
