import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { obtenerProducto } from '../../api/productosApi.js';
import { estaEnOferta, precioFinal } from '../../data/productos.js';
import { useApi } from '../../hooks/useApi.js';
import { useCatalogo } from '../../hooks/useCatalogo.js';
import { formatoCLP } from '../../utils/format.js';
import AddToCartButton from '../../components/common/AddToCartButton.jsx';
import { Cargando } from '../../components/common/ConEstado.jsx';
import EmptyState from '../../components/common/EmptyState.jsx';
import ProductGrid from '../../components/common/ProductGrid.jsx';
import ProductMedia from '../../components/common/ProductMedia.jsx';
import QuantitySelector from '../../components/common/QuantitySelector.jsx';

function DetalleProducto({ id }) {
  const consulta = useApi(() => obtenerProducto(id), [id]); // GET /productos/{id}: el stock mostrado es el real
  const { productos, categorias } = useCatalogo();
  const [cantidad, setCantidad] = useState(1);
  const producto = consulta.datos;

  if (consulta.cargando && !producto) return <div className="container py-5"><Cargando /></div>;
  if (!producto) {
    return (
      <div className="container py-5">
        <EmptyState mensaje={consulta.error || 'No encontramos ese producto.'}>
          <Link to="/productos" className="btn btn-primary">Volver al catálogo</Link>
        </EmptyState>
      </div>
    );
  }

  const categoria = categorias.find((c) => c.id === producto.categoriaId);
  const relacionados = productos.filter((p) => p.categoriaId === producto.categoriaId && p.id !== producto.id);
  const oferta = estaEnOferta(producto);

  return (
    <div className="container py-4">
      <nav aria-label="breadcrumb"><ol className="breadcrumb">
        <li className="breadcrumb-item"><Link to="/">Home</Link></li>
        <li className="breadcrumb-item"><Link to={`/categorias/${producto.categoriaId}`}>{producto.categoriaNombre}</Link></li>
        <li className="breadcrumb-item active" aria-current="page">{producto.nombre}</li>
      </ol></nav>

      <div className="row g-4 mb-5">
        <div className="col-md-6"><div className="rounded overflow-hidden shadow-sm"><ProductMedia producto={producto} className="kiltro-media--grande" /></div></div>
        <div className="col-md-6">
          <span className="kiltro-tag">{producto.categoriaNombre}</span>
          <h1 className="kiltro-heading h2 mt-1">{producto.nombre}</h1>
          <p className="text-secondary small mb-1">Código {producto.codigo}</p>
          <div className="mb-3">
            {oferta && <><span className="badge bg-danger me-2">-{producto.descuento}%</span><span className="text-decoration-line-through text-secondary me-2">{formatoCLP(producto.precio)}</span></>}
            <span className="fs-3 fw-bold kiltro-heading" data-testid="precio-final">{formatoCLP(precioFinal(producto))}</span>
          </div>
          <p>{producto.descripcion}</p>
          <p className={producto.stock > 0 ? 'text-success' : 'text-danger'}>{producto.stock > 0 ? `${producto.stock} unidades disponibles` : 'Sin stock por ahora'}</p>
          {producto.stock > 0 && (
            <div className="d-flex align-items-center gap-3 flex-wrap">
              <QuantitySelector value={cantidad} onChange={setCantidad} min={1} max={producto.stock} />
              <AddToCartButton producto={producto} cantidad={cantidad} size="lg">Añadir al carrito</AddToCartButton>
            </div>
          )}
        </div>
      </div>

      {relacionados.length > 0 && (<><h2 className="kiltro-heading h4 mb-3">También te puede interesar</h2><ProductGrid productos={relacionados} categorias={categorias} /></>)}
    </div>
  );
}

/** La "key" reinicia el componente al pasar de un producto a otro (la cantidad elegida no se arrastra). */
export default function ProductDetailPage() {
  const { id } = useParams();
  return <DetalleProducto key={id} id={id} />;
}
