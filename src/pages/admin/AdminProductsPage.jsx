import { useState } from 'react';
import { Link } from 'react-router-dom';
import { invalidarCatalogo } from '../../api/catalogo.js';
import { mensajeDeError } from '../../api/errores.js';
import { eliminarProducto, listarProductos } from '../../api/productosApi.js';
import { esCritico, estaEnOferta, filtrarProductos, precioFinal } from '../../data/productos.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { PERMISOS } from '../../permisos.js';
import { useApi } from '../../hooks/useApi.js';
import { formatoCLP } from '../../utils/format.js';
import Button from '../../components/common/Button.jsx';
import { ConConsulta } from '../../components/common/ConEstado.jsx';
import PageHeader from '../../components/common/PageHeader.jsx';

/** Listado de productos del panel. Todos los del panel lo ven; solo quien tiene el permiso crea, edita o elimina. */
export default function AdminProductsPage() {
  const consulta = useApi(listarProductos);
  const { puede } = useAuth();
  const [texto, setTexto] = useState('');
  const [error, setError] = useState('');

  const eliminar = async (p) => {
    if (!window.confirm(`¿Eliminar "${p.nombre}"? Esta acción no se puede deshacer.`)) return;
    try {
      await eliminarProducto(p.id);
      setError('');
      invalidarCatalogo();
      consulta.recargar();
    } catch (e) {
      setError(mensajeDeError(e));
    }
  };

  return (
    <ConConsulta consulta={consulta}>
      {(productos) => {
        const visibles = filtrarProductos(productos, { texto });
        const gestiona = puede(PERMISOS.PRODUCTOS_GESTIONAR);
        return (
          <>
            <PageHeader titulo="Productos" subtitulo={`${productos.length} productos en el catálogo`}>
              {gestiona && <Link to="/admin/productos/criticos" className="btn btn-outline-warning">Productos críticos</Link>}
              {puede(PERMISOS.REPORTES_VER) && <Link to="/admin/productos/reportes" className="btn btn-outline-primary">Reportes</Link>}
              {gestiona && <Link to="/admin/productos/nuevo" className="btn btn-primary">+ Nuevo producto</Link>}
            </PageHeader>
            {error && <div className="alert alert-danger" role="alert">{error}</div>}
            <input type="search" className="form-control mb-3" placeholder="Buscar por nombre, descripción o código" aria-label="Buscar producto" value={texto} onChange={(e) => setTexto(e.target.value)} />
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead><tr><th>Código</th><th>Nombre</th><th>Categoría</th><th>Precio</th><th>Stock</th><th /></tr></thead>
                <tbody>
                  {visibles.map((p) => (
                    <tr key={p.id}>
                      <td>{p.codigo}</td>
                      <td>{p.nombre} {estaEnOferta(p) && <span className="badge bg-danger">-{p.descuento}%</span>}</td>
                      <td>{p.categoriaNombre}</td>
                      <td>{formatoCLP(precioFinal(p))}</td>
                      <td>{p.stock} {esCritico(p) && <span className="badge text-bg-warning">Stock bajo</span>}</td>
                      <td className="text-end text-nowrap">
                        <Link to={`/admin/productos/${p.id}`} className="btn btn-outline-secondary btn-sm me-1">Ver</Link>
                        {gestiona && <Link to={`/admin/productos/${p.id}/editar`} className="btn btn-outline-primary btn-sm me-1">Editar</Link>}
                        {gestiona && <Button variant="danger" size="sm" onClick={() => eliminar(p)} aria-label={`Eliminar ${p.nombre}`}>Eliminar</Button>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {visibles.length === 0 && <p className="text-secondary">No hay productos que coincidan.</p>}
            </div>
          </>
        );
      }}
    </ConConsulta>
  );
}
