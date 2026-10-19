import { Link, useNavigate, useParams } from 'react-router-dom';
import { categoriasRepo, productosRepo } from '../../data/db.js';
import { esCritico, estaEnOferta, precioFinal } from '../../data/productos.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { useCollection } from '../../hooks/useCollection.js';
import { formatoCLP } from '../../utils/format.js';
import Button from '../../components/common/Button.jsx';
import EmptyState from '../../components/common/EmptyState.jsx';
import PageHeader from '../../components/common/PageHeader.jsx';
import ProductMedia from '../../components/common/ProductMedia.jsx';

/** "Mostrar producto": ficha completa de un producto con acceso a editarlo. */
export default function AdminProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { esAdmin } = useAuth();
  const producto = useCollection(productosRepo).find((p) => String(p.id) === id);
  const categoria = useCollection(categoriasRepo).find((c) => c.id === producto?.categoriaId);
  if (!producto) return <EmptyState mensaje="No encontramos ese producto."><Link to="/admin/productos" className="btn btn-primary">Volver</Link></EmptyState>;

  const eliminar = () => {
    if (window.confirm(`¿Eliminar "${producto.nombre}"?`)) { productosRepo.eliminar(producto.id); navigate('/admin/productos'); }
  };

  return (
    <>
      <PageHeader titulo={producto.nombre} subtitulo={`Código ${producto.codigo}`}>
        {esAdmin && <Link to={`/admin/productos/${producto.id}/editar`} className="btn btn-primary">Editar producto</Link>}
        {esAdmin && <Button variant="danger" onClick={eliminar}>Eliminar</Button>}
        <Link to="/admin/productos" className="btn btn-outline-secondary">← Productos</Link>
      </PageHeader>
      <div className="row g-4">
        <div className="col-md-4"><div className="rounded overflow-hidden shadow-sm"><ProductMedia producto={producto} /></div></div>
        <div className="col-md-8">
          <dl className="row">
            <dt className="col-sm-4">Categoría</dt><dd className="col-sm-8">{categoria?.nombre}</dd>
            <dt className="col-sm-4">Descripción</dt><dd className="col-sm-8">{producto.descripcion || '—'}</dd>
            <dt className="col-sm-4">Precio</dt><dd className="col-sm-8">{formatoCLP(producto.precio)}{estaEnOferta(producto) && <> → <strong>{formatoCLP(precioFinal(producto))}</strong> <span className="badge bg-danger">-{producto.descuento}%</span></>}</dd>
            <dt className="col-sm-4">Stock</dt><dd className="col-sm-8">{producto.stock} {esCritico(producto) && <span className="badge text-bg-warning">Stock crítico (≤ {producto.stockCritico})</span>}</dd>
          </dl>
        </div>
      </div>
    </>
  );
}
