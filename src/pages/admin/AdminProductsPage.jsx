import { useState } from 'react';
import { Link } from 'react-router-dom';
import { categoriasRepo, productosRepo } from '../../data/db.js';
import { esCritico, estaEnOferta, filtrarProductos, precioFinal } from '../../data/productos.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { useCollection } from '../../hooks/useCollection.js';
import { formatoCLP } from '../../utils/format.js';
import Button from '../../components/common/Button.jsx';
import PageHeader from '../../components/common/PageHeader.jsx';

/** Listado de productos del panel. Todos pueden verlo; solo el Administrador crea, edita o elimina. */
export default function AdminProductsPage() {
  const productos = useCollection(productosRepo);
  const categorias = useCollection(categoriasRepo);
  const { esAdmin } = useAuth();
  const [texto, setTexto] = useState('');
  const visibles = filtrarProductos(productos, { texto });

  const eliminar = (p) => {
    if (window.confirm(`¿Eliminar "${p.nombre}"? Esta acción no se puede deshacer.`)) productosRepo.eliminar(p.id);
  };

  return (
    <>
      <PageHeader titulo="Productos" subtitulo={`${productos.length} productos en el catálogo`}>
        <Link to="/admin/productos/criticos" className="btn btn-outline-warning">Productos críticos</Link>
        {esAdmin && <Link to="/admin/productos/reportes" className="btn btn-outline-primary">Reportes</Link>}
        {esAdmin && <Link to="/admin/productos/nuevo" className="btn btn-primary">+ Nuevo producto</Link>}
      </PageHeader>
      <input type="search" className="form-control mb-3" placeholder="Buscar por nombre, descripción o código" aria-label="Buscar producto" value={texto} onChange={(e) => setTexto(e.target.value)} />
      <div className="table-responsive">
        <table className="table table-hover align-middle">
          <thead><tr><th>Código</th><th>Nombre</th><th>Categoría</th><th>Precio</th><th>Stock</th><th /></tr></thead>
          <tbody>
            {visibles.map((p) => (
              <tr key={p.id}>
                <td>{p.codigo}</td>
                <td>{p.nombre} {estaEnOferta(p) && <span className="badge bg-danger">-{p.descuento}%</span>}</td>
                <td>{categorias.find((c) => c.id === p.categoriaId)?.nombre}</td>
                <td>{formatoCLP(precioFinal(p))}</td>
                <td>{p.stock} {esCritico(p) && <span className="badge text-bg-warning">Stock bajo</span>}</td>
                <td className="text-end text-nowrap">
                  <Link to={`/admin/productos/${p.id}`} className="btn btn-outline-secondary btn-sm me-1">Ver</Link>
                  {esAdmin && <Link to={`/admin/productos/${p.id}/editar`} className="btn btn-outline-primary btn-sm me-1">Editar</Link>}
                  {esAdmin && <Button variant="danger" size="sm" onClick={() => eliminar(p)} aria-label={`Eliminar ${p.nombre}`}>Eliminar</Button>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {visibles.length === 0 && <p className="text-secondary">No hay productos que coincidan.</p>}
      </div>
    </>
  );
}
