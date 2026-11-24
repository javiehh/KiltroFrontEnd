import { Link } from 'react-router-dom';
import { listarCriticos } from '../../api/productosApi.js';
import { useApi } from '../../hooks/useApi.js';
import { ConConsulta } from '../../components/common/ConEstado.jsx';
import EmptyState from '../../components/common/EmptyState.jsx';
import PageHeader from '../../components/common/PageHeader.jsx';

/** Productos críticos (GET /productos/criticos, solo ADMIN): los que tienen stock igual o inferior a su stock crítico. */
export default function CriticalProductsPage() {
  const consulta = useApi(listarCriticos);
  return (
    <>
      <PageHeader titulo="Productos críticos" subtitulo="Stock igual o inferior al nivel crítico definido para cada producto.">
        <Link to="/admin/productos" className="btn btn-outline-secondary">← Productos</Link>
      </PageHeader>
      <ConConsulta consulta={consulta}>
        {(criticos) => criticos.length === 0 ? <EmptyState mensaje="¡Todo bien! No hay productos con stock crítico." /> : (
          <div className="table-responsive"><table className="table table-hover align-middle">
            <thead><tr><th>Código</th><th>Nombre</th><th>Stock actual</th><th>Stock crítico</th><th /></tr></thead>
            <tbody>
              {criticos.map((p) => (
                <tr key={p.id} className={p.stock === 0 ? 'table-danger' : 'table-warning'}>
                  <td>{p.codigo}</td><td>{p.nombre}</td><td><strong>{p.stock}</strong></td><td>{p.stockCritico}</td>
                  <td className="text-end"><Link to={`/admin/productos/${p.id}/editar`} className="btn btn-outline-primary btn-sm">Reponer / editar</Link></td>
                </tr>
              ))}
            </tbody>
          </table></div>
        )}
      </ConConsulta>
    </>
  );
}
