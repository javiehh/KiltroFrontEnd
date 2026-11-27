import { listarBoletas, obtenerResumenVentas } from '../../api/boletasApi.js';
import { listarCategorias } from '../../api/categoriasApi.js';
import { listarProductos } from '../../api/productosApi.js';
import { listarUsuarios } from '../../api/usuariosApi.js';
import { cantidadAnuladas, topProductos, usuariosPorRol, ventasPorCategoria } from '../../data/reportes.js';
import { listarMensajes } from '../../data/mensajes.js';
import { useApi } from '../../hooks/useApi.js';
import { formatoCLP, formatoFecha } from '../../utils/format.js';
import { ConConsulta } from '../../components/common/ConEstado.jsx';
import PageHeader from '../../components/common/PageHeader.jsx';
import StatCard from '../../components/common/StatCard.jsx';

export default function ReportsPage() {
  const consulta = useApi(() => Promise.all([obtenerResumenVentas(), listarBoletas(), listarProductos(), listarCategorias(), listarUsuarios()]));
  const mensajes = listarMensajes();
  return (
    <>
      <PageHeader titulo="Reportes" subtitulo="Informes de las operaciones de la tienda." />
      <ConConsulta consulta={consulta}>
        {([resumen, boletas, productos, categorias, usuarios]) => {
          const porCategoria = ventasPorCategoria(boletas, productos, categorias);
          const maximo = Math.max(1, ...porCategoria.map((c) => c.ingresos));
          return (
            <>
              <div className="row g-3 mb-4">
                <div className="col-6 col-lg-3"><StatCard color="primary" titulo="Ventas totales" valor={formatoCLP(resumen.totalVentas)} /></div>
                <div className="col-6 col-lg-3"><StatCard color="success" titulo="Órdenes vigentes" valor={resumen.cantidadOrdenes} /></div>
                <div className="col-6 col-lg-3"><StatCard color="danger" titulo="Órdenes anuladas" valor={cantidadAnuladas(boletas)} /></div>
                <div className="col-6 col-lg-3"><StatCard color="warning" titulo="Ticket promedio" valor={formatoCLP(resumen.ticketPromedio)} /></div>
              </div>
              <div className="row g-4">
                <div className="col-lg-6">
                  <h2 className="h5">Ventas por categoría</h2>
                  {porCategoria.map((c) => (
                    <div key={c.categoria} className="mb-2">
                      <div className="d-flex justify-content-between small"><span>{c.categoria}</span><span>{formatoCLP(c.ingresos)}</span></div>
                      <div className="progress" role="progressbar" aria-label={`Ventas de ${c.categoria}`} aria-valuenow={c.ingresos} aria-valuemin="0" aria-valuemax={maximo}>
                        <div className="progress-bar" style={{ width: `${(c.ingresos / maximo) * 100}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="col-lg-6">
                  <h2 className="h5">Usuarios por rol</h2>
                  <ul className="list-group">{usuariosPorRol(usuarios).map((r) => <li key={r.rol} className="list-group-item d-flex justify-content-between">{r.rol}<span className="badge text-bg-primary">{r.cantidad}</span></li>)}</ul>
                </div>
                <div className="col-lg-6">
                  <h2 className="h5">Productos más vendidos</h2>
                  <table className="table table-sm"><thead><tr><th>Producto</th><th>Unid.</th><th className="text-end">Ingresos</th></tr></thead>
                    <tbody>{topProductos(boletas, 5).map((t) => <tr key={t.productoId}><td>{t.nombre}</td><td>{t.unidades}</td><td className="text-end">{formatoCLP(t.ingresos)}</td></tr>)}</tbody></table>
                </div>
                <div className="col-lg-6">
                  <h2 className="h5">Mensajes de contacto ({mensajes.length})</h2>
                  {mensajes.length === 0 ? <p className="text-secondary">Aún no hay mensajes.</p> : (
                    <ul className="list-group">{[...mensajes].reverse().slice(0, 5).map((m) => <li key={m.id} className="list-group-item"><strong>{m.nombre}</strong> <span className="text-secondary small">({formatoFecha(m.fecha)})</span><br />{m.mensaje}</li>)}</ul>
                  )}
                </div>
              </div>
            </>
          );
        }}
      </ConConsulta>
    </>
  );
}
