import { useSearchParams } from 'react-router-dom';
import { categoriasRepo, productosRepo } from '../../data/db.js';
import { filtrarProductos } from '../../data/productos.js';
import { useCollection } from '../../hooks/useCollection.js';
import PageHeader from '../../components/common/PageHeader.jsx';
import ProductGrid from '../../components/common/ProductGrid.jsx';

/** Catálogo completo con filtros combinables: texto (también desde el buscador del navbar), categoría, ofertas y orden. */
export default function ProductsPage() {
  const productos = useCollection(productosRepo);
  const categorias = useCollection(categoriasRepo);
  const [params, setParams] = useSearchParams();

  const texto = params.get('q') || '';
  const categoriaId = params.get('categoria') || '';
  const soloOfertas = params.get('ofertas') === '1';
  const orden = params.get('orden') || 'nombre';

  const cambiar = (clave, valor) => {
    const nuevo = new URLSearchParams(params);
    if (valor) nuevo.set(clave, valor); else nuevo.delete(clave);
    setParams(nuevo, { replace: true });
  };

  const resultado = filtrarProductos(productos, { texto, categoriaId, soloOfertas, orden });

  return (
    <>
      <PageHeader oscuro titulo="Catálogo completo" subtitulo="Todo lo que tenemos disponible ahora mismo." />
      <div className="container">
        <div className="row g-2 align-items-end mb-4" role="search" aria-label="Filtros del catálogo">
          <div className="col-md-4">
            <label htmlFor="filtro-texto" className="form-label small mb-1">Buscar</label>
            <input id="filtro-texto" type="search" className="form-control" placeholder="Nombre, descripción o código" value={texto} onChange={(e) => cambiar('q', e.target.value)} />
          </div>
          <div className="col-md-3">
            <label htmlFor="filtro-categoria" className="form-label small mb-1">Categoría</label>
            <select id="filtro-categoria" className="form-select" value={categoriaId} onChange={(e) => cambiar('categoria', e.target.value)}>
              <option value="">Todas</option>
              {categorias.map((c) => <option key={c.id} value={c.id}>{c.nombre}</option>)}
            </select>
          </div>
          <div className="col-md-3">
            <label htmlFor="filtro-orden" className="form-label small mb-1">Ordenar por</label>
            <select id="filtro-orden" className="form-select" value={orden} onChange={(e) => cambiar('orden', e.target.value)}>
              <option value="nombre">Nombre</option>
              <option value="precio-asc">Precio: menor a mayor</option>
              <option value="precio-desc">Precio: mayor a menor</option>
            </select>
          </div>
          <div className="col-md-2">
            <div className="form-check">
              <input id="filtro-ofertas" type="checkbox" className="form-check-input" checked={soloOfertas} onChange={(e) => cambiar('ofertas', e.target.checked ? '1' : '')} />
              <label htmlFor="filtro-ofertas" className="form-check-label">Solo ofertas</label>
            </div>
          </div>
        </div>
        <p className="text-secondary small" aria-live="polite" data-testid="resultados">{resultado.length} producto(s) encontrados</p>
        <ProductGrid productos={resultado} mensajeVacio="No encontramos productos con esos filtros." />
      </div>
    </>
  );
}
