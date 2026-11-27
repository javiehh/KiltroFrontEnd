import { formatoCLP, formatoFecha } from '../../utils/format.js';

export default function Boleta({ orden }) {
  const { cliente, direccion } = orden;
  return (
    <div data-testid="boleta">
      <div className="row g-3 mb-3">
        <div className="col-md-4"><label className="form-label small text-secondary">Nombre</label><input className="form-control" value={cliente.nombre} readOnly /></div>
        <div className="col-md-4"><label className="form-label small text-secondary">Apellidos</label><input className="form-control" value={cliente.apellidos} readOnly /></div>
        <div className="col-md-4"><label className="form-label small text-secondary">Correo</label><input className="form-control" value={cliente.correo} readOnly /></div>
      </div>
      <h2 className="h6 fw-bold">Dirección de entrega de los productos</h2>
      <div className="row g-3 mb-3">
        <div className="col-md-6"><label className="form-label small text-secondary">Calle</label><input className="form-control" value={direccion.calle} readOnly /></div>
        <div className="col-md-6"><label className="form-label small text-secondary">Departamento</label><input className="form-control" value={direccion.departamento || '—'} readOnly /></div>
        <div className="col-md-6"><label className="form-label small text-secondary">Región</label><input className="form-control" value={direccion.region} readOnly /></div>
        <div className="col-md-6"><label className="form-label small text-secondary">Comuna</label><input className="form-control" value={direccion.comuna} readOnly /></div>
        <div className="col-12"><label className="form-label small text-secondary">Indicaciones para la entrega</label><textarea className="form-control" rows={2} value={direccion.indicaciones || '—'} readOnly /></div>
      </div>
      <div className="table-responsive">
        <table className="table table-sm align-middle">
          <thead><tr><th>Nombre</th><th className="text-end">Precio</th><th className="text-center">Cantidad</th><th className="text-end">Subtotal</th></tr></thead>
          <tbody>
            {orden.items.map((i) => (
              <tr key={i.productoId}><td>{i.nombre}</td><td className="text-end">{formatoCLP(i.precio)}</td><td className="text-center">{i.cantidad}</td><td className="text-end">{formatoCLP(i.subtotal)}</td></tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="bg-body-tertiary rounded p-3 text-center fs-5 fw-bold">
        {orden.estado === 'ANULADA' ? 'Total anulado' : 'Total pagado'}: {formatoCLP(orden.total)}
      </div>
      <p className="small text-secondary text-end mt-2 mb-0">Orden {orden.codigo} · {formatoFecha(orden.fecha)}</p>
    </div>
  );
}
