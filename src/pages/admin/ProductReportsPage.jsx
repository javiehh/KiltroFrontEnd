import { Link } from 'react-router-dom';
import { ordenesRepo, productosRepo } from '../../data/db.js';
import { productosCriticos, productosEnOferta } from '../../data/productos.js';
import { topProductos, unidadesInventario, valorInventario } from '../../data/reportes.js';
import { useCollection } from '../../hooks/useCollection.js';
import { formatoCLP } from '../../utils/format.js';
import PageHeader from '../../components/common/PageHeader.jsx';
import StatCard from '../../components/common/StatCard.jsx';

export default function ProductReportsPage() {
  const productos = useCollection(productosRepo);
  const ordenes = useCollection(ordenesRepo);
  const top = topProductos(ordenes, 5);
  const vendidos = new Set(top.map((t) => t.productoId));
  return (
    <>
      <PageHeader titulo="Reporte de productos" subtitulo="Inventario, ofertas y productos más vendidos.">
        <Link to="/admin/productos" className="btn btn-outline-secondary">← Productos</Link>
      </PageHeader>
      <div className="row g-3 mb-4">
        <div className="col-6 col-lg-3"><StatCard color="primary" titulo="Valor del inventario" valor={formatoCLP(valorInventario(productos))} /></div>
        <div className="col-6 col-lg-3"><StatCard color="success" titulo="Unidades en stock" valor={unidadesInventario(productos)} /></div>
        <div className="col-6 col-lg-3"><StatCard color="danger" titulo="En oferta" valor={productosEnOferta(productos).length} /></div>
        <div className="col-6 col-lg-3"><StatCard color="warning" titulo="Stock crítico" valor={productosCriticos(productos).length} /></div>
      </div>
      <h2 className="h5">Más vendidos</h2>
      <div className="table-responsive mb-4"><table className="table">
        <thead><tr><th>Producto</th><th>Unidades</th><th className="text-end">Ingresos</th></tr></thead>
        <tbody>{top.map((t) => <tr key={t.productoId}><td>{t.nombre}</td><td>{t.unidades}</td><td className="text-end">{formatoCLP(t.ingresos)}</td></tr>)}</tbody>
      </table>{top.length === 0 && <p className="text-secondary">Aún no hay ventas.</p>}</div>
      <h2 className="h5">Sin ventas en el top</h2>
      <p className="text-secondary">{productos.filter((p) => !vendidos.has(p.id)).map((p) => p.nombre).join(' · ') || 'Todos los productos están en el top.'}</p>
    </>
  );
}
