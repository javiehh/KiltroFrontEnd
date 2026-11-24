import { Link, useParams } from 'react-router-dom';
import { useCatalogo } from '../../hooks/useCatalogo.js';
import ConEstado from '../../components/common/ConEstado.jsx';
import PageHeader from '../../components/common/PageHeader.jsx';
import ProductGrid from '../../components/common/ProductGrid.jsx';
import { ICONOS } from '../../data/iconos.js';

/** Vista de categorías: tarjetas para elegir una categoría y, debajo, los productos de la categoría elegida. */
export default function CategoriesPage() {
  const { id } = useParams();
  const { productos, categorias, cargado, cargando, error, recargar } = useCatalogo();

  const activa = categorias.find((c) => String(c.id) === id) || categorias[0];
  const deLaCategoria = activa ? productos.filter((p) => p.categoriaId === activa.id) : [];

  return (
    <>
      <PageHeader oscuro titulo="Categorías" subtitulo="Encuentra lo que necesitas según el tipo de mascota." />
      <div className="container">
        <ConEstado listo={cargado} cargando={cargando} error={error} onReintentar={recargar}>
          {() => (
            <>
        <div className="row g-3 row-cols-2 row-cols-md-4 mb-5" role="tablist" aria-label="Categorías">
          {categorias.map((c) => (
            <div className="col" key={c.id}>
              <Link to={`/categorias/${c.id}`} role="tab" aria-selected={activa?.id === c.id}
                className={`card h-100 text-center text-decoration-none kiltro-card shadow-sm ${activa?.id === c.id ? 'border-primary border-2' : ''}`}>
                <div className="kiltro-media kiltro-media--icono kiltro-media--corta card-img-top" style={{ background: c.tile }}>
                  <svg viewBox="0 0 64 64" width="40" height="40" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true" dangerouslySetInnerHTML={{ __html: ICONOS[c.icono] || '' }} />
                </div>
                <div className="card-body py-2"><strong>{c.nombre}</strong></div>
              </Link>
            </div>
          ))}
        </div>
        {activa && (
          <section aria-labelledby="titulo-categoria-activa">
            <h2 id="titulo-categoria-activa" className="kiltro-heading mb-1">{activa.nombre}</h2>
            <p className="text-secondary">{activa.descripcion}</p>
            <ProductGrid productos={deLaCategoria} categorias={categorias} mensajeVacio="Esta categoría aún no tiene productos." />
          </section>
        )}
            </>
          )}
        </ConEstado>
      </div>
    </>
  );
}
