import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ordenesRepo } from '../../data/db.js';
import { useCollection } from '../../hooks/useCollection.js';
import Boleta from '../../components/common/Boleta.jsx';
import Button from '../../components/common/Button.jsx';
import EmptyState from '../../components/common/EmptyState.jsx';

/**
 * Resultado de la compra. Una sola página para las dos vistas del diagrama (pago correcto / pago con error):
 * `exito` decide cuál se muestra. Si la orden no corresponde al resultado, se avisa.
 */
export default function PaymentResultPage({ exito }) {
  const { numero } = useParams();
  const ordenes = useCollection(ordenesRepo);
  const navigate = useNavigate();
  const [correoEnviado, setCorreoEnviado] = useState(false);

  const orden = ordenes.find((o) => o.numero === numero);
  if (!orden || (orden.estado === 'pagada') !== exito) {
    return <div className="container py-5"><EmptyState mensaje="No encontramos esa compra."><Link to="/" className="btn btn-primary">Volver al inicio</Link></EmptyState></div>;
  }

  return (
    <div className="container py-4" style={{ maxWidth: 860 }}>
      <div className="card shadow-sm"><div className="card-body">
        <div className="d-flex justify-content-between flex-wrap gap-2 mb-3">
          {exito ? (
            <h1 className="h4 kiltro-heading text-success"><i className="bi bi-check-circle me-2" aria-hidden="true" />Se ha realizado la compra. nro #{orden.numero}</h1>
          ) : (
            <h1 className="h4 kiltro-heading text-danger"><i className="bi bi-x-circle me-2" aria-hidden="true" />No se pudo realizar el pago. nro #{orden.numero}</h1>
          )}
          <small className="text-secondary">Código orden: {orden.codigo}</small>
        </div>
        {!exito && (
          <div className="mb-3">
            <p className="text-danger mb-2">Motivo: {orden.motivoRechazo || 'El pago no fue aprobado.'}</p>
            <Button variant="success" onClick={() => navigate('/checkout', { state: { reintento: orden.numero } })}>VOLVER A REALIZAR EL PAGO</Button>
          </div>
        )}
        <Boleta orden={orden} />
        {exito && (
          <div className="d-flex justify-content-center gap-2 mt-3 flex-wrap">
            <Button variant="danger" size="sm" onClick={() => window.print()}>Imprimir boleta en PDF</Button>
            <Button variant="success" size="sm" onClick={() => setCorreoEnviado(true)}>Enviar boleta por email</Button>
          </div>
        )}
        {correoEnviado && <div className="alert alert-success mt-3 mb-0" role="status">Boleta enviada a {orden.cliente.correo} (envío simulado).</div>}
      </div></div>
      <div className="text-center mt-3"><Link to="/productos">Seguir comprando</Link></div>
    </div>
  );
}
