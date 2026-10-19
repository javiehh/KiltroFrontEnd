import { Link } from 'react-router-dom';
import { formatoCLP, formatoFecha } from '../../utils/format.js';

const COLOR_ESTADO = { pagada: 'success', rechazada: 'danger', pendiente: 'warning' };

/** Tabla de órdenes. `baseRuta` define a dónde lleva "Ver boleta" (ej: /admin/ordenes). */
export default function OrdersTable({ ordenes, baseRuta = '/admin/ordenes' }) {
  if (ordenes.length === 0) return <p className="text-secondary">No hay órdenes para mostrar.</p>;
  return (
    <div className="table-responsive">
      <table className="table table-hover align-middle">
        <thead><tr><th>N° orden</th><th>Fecha</th><th>Cliente</th><th>Estado</th><th className="text-end">Total</th><th /></tr></thead>
        <tbody>
          {ordenes.map((o) => (
            <tr key={o.numero}>
              <td>#{o.numero}</td>
              <td>{formatoFecha(o.fecha)}</td>
              <td>{o.cliente.nombre} {o.cliente.apellidos}</td>
              <td><span className={`badge text-bg-${COLOR_ESTADO[o.estado]}`}>{o.estado}</span></td>
              <td className="text-end">{formatoCLP(o.total)}</td>
              <td className="text-end"><Link className="btn btn-outline-primary btn-sm" to={`${baseRuta}/${o.numero}`}>Ver boleta</Link></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
