import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { invalidarCatalogo } from '../../api/catalogo.js';
import { mensajeDeError } from '../../api/errores.js';
import { eliminarProducto, obtenerProducto } from '../../api/productosApi.js';
import { esCritico, estaEnOferta, precioFinal } from '../../data/productos.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { PERMISOS } from '../../permisos.js';
import { useApi } from '../../hooks/useApi.js';
import { formatoCLP } from '../../utils/format.js';
import Button from '../../components/common/Button.jsx';
import { Cargando } from '../../components/common/ConEstado.jsx';
import EmptyState from '../../components/common/EmptyState.jsx';
import PageHeader from '../../components/common/PageHeader.jsx';
import ProductMedia from '../../components/common/ProductMedia.jsx';

export default function AdminProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { puede } = useAuth();
  const consulta = useApi(() => obtenerProducto(id), [id]);
  const [error, setError] = useState('');
  const producto = consulta.datos;

  if (consulta.cargando && !producto) return <Cargando />;
  if (!producto) return <EmptyState mensaje={consulta.error || 'No encontramos ese producto.'}><Link to="/admin/productos" className="btn btn-primary">Volver</Link></EmptyState>;

  const gestiona = puede(PERMISOS.PRODUCTOS_GESTIONAR);
  const eliminar = async () => {
    if (!window.confirm(`¿Eliminar "${producto.nombre}"?`)) return;
    try {
      await eliminarProducto(producto.id);
      invalidarCatalogo();
      navigate('/admin/productos');
    } catch (e) {
      setError(mensajeDeError(e));
    }
  };

  return (
    <>
      <PageHeader titulo={producto.nombre} subtitulo={`Código ${producto.codigo}`}>
        {gestiona && <Link to={`/admin/productos/${producto.id}/editar`} className="btn btn-primary">Editar producto</Link>}
        {gestiona && <Button variant="danger" onClick={eliminar}>Eliminar</Button>}
        <Link to="/admin/productos" className="btn btn-outline-secondary">← Productos</Link>
      </PageHeader>
      {error && <div className="alert alert-danger" role="alert">{error}</div>}
      <div className="row g-4">
        <div className="col-md-4"><div className="rounded overflow-hidden shadow-sm"><ProductMedia producto={producto} /></div></div>
        <div className="col-md-8">
          <dl className="row">
            <dt className="col-sm-4">Categoría</dt><dd className="col-sm-8">{producto.categoriaNombre}</dd>
            <dt className="col-sm-4">Descripción</dt><dd className="col-sm-8">{producto.descripcion || '—'}</dd>
            <dt className="col-sm-4">Precio</dt><dd className="col-sm-8">{formatoCLP(producto.precio)}{estaEnOferta(producto) && <> → <strong>{formatoCLP(precioFinal(producto))}</strong> <span className="badge bg-danger">-{producto.descuento}%</span></>}</dd>
            <dt className="col-sm-4">Stock</dt><dd className="col-sm-8">{producto.stock} {esCritico(producto) && <span className="badge text-bg-warning">Stock crítico (≤ {producto.stockCritico})</span>}</dd>
          </dl>
        </div>
      </div>
    </>
  );
}
