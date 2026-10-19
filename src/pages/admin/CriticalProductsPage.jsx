import { Link } from 'react-router-dom';
import { productosRepo } from '../../data/db.js';
import { productosCriticos } from '../../data/productos.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { useCollection } from '../../hooks/useCollection.js';
import EmptyState from '../../components/common/EmptyState.jsx';
import PageHeader from '../../components/common/PageHeader.jsx';

/** Listado de productos críticos: los que tienen stock igual o inferior a su stock crítico. */
export default function CriticalProductsPage() {
  const criticos = productosCriticos(useCollection(productosRepo));
  const { esAdmin } = useAuth();
  return (
    <>
      <PageHeader titulo="Productos críticos" subtitulo="Stock igual o inferior al nivel crítico definido para cada producto.">
        <Link to="/admin/productos" className="btn btn-outline-secondary">← Productos</Link>
      </PageHeader>
      {criticos.length === 0 ? <EmptyState mensaje="¡Todo bien! No hay productos con stock crítico." /> : (
        <div className="table-responsive"><table className="table table-hover align-middle">
          <thead><tr><th>Código</th><th>Nombre</th><th>Stock actual</th><th>Stock crítico</th><th /></tr></thead>
          <tbody>
            {criticos.map((p) => (
              <tr key={p.id} className={p.stock === 0 ? 'table-danger' : 'table-warning'}>
                <td>{p.codigo}</td><td>{p.nombre}</td><td><strong>{p.stock}</strong></td><td>{p.stockCritico}</td>
                <td className="text-end"><Link to={esAdmin ? `/admin/productos/${p.id}/editar` : `/admin/productos/${p.id}`} className="btn btn-outline-primary btn-sm">{esAdmin ? 'Reponer / editar' : 'Ver'}</Link></td>
              </tr>
            ))}
          </tbody>
        </table></div>
      )}
    </>
  );
}
