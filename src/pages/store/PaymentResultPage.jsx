import { useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { obtenerBoleta } from '../../api/boletasApi.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { useApi } from '../../hooks/useApi.js';
import Boleta from '../../components/common/Boleta.jsx';
import Button from '../../components/common/Button.jsx';
import { Cargando } from '../../components/common/ConEstado.jsx';
import EmptyState from '../../components/common/EmptyState.jsx';

export default function PaymentResultPage({ exito }) {
  const { id } = useParams();
  const { state } = useLocation();
  const { usuario } = useAuth();
  const navigate = useNavigate();
  const [correoEnviado, setCorreoEnviado] = useState(false);

  const guardada = state?.orden ?? null;
  const consulta = useApi(
    () => (exito && !guardada && usuario ? obtenerBoleta(id) : Promise.resolve(null)),
    [id, exito, usuario?.id]
  );

  if (!exito) {
    return (
      <div className="container py-4" style={{ maxWidth: 860 }}>
        <div className="card shadow-sm"><div className="card-body text-center py-5">
          <h1 className="h4 kiltro-heading text-danger"><i className="bi bi-x-circle me-2" aria-hidden="true" />No se pudo realizar la compra</h1>
          <p className="text-danger mt-3" data-testid="motivo">{state?.motivo || 'Ocurrió un problema al procesar tu compra.'}</p>
          <p className="text-secondary">No se te cobró nada y tu carrito sigue intacto. Revisa las cantidades y vuelve a intentarlo.</p>
          <div className="d-flex justify-content-center gap-2 flex-wrap">
            <Button variant="success" onClick={() => navigate('/carrito')}>Volver al carrito</Button>
            <Button variant="outline-primary" onClick={() => navigate('/checkout')}>Reintentar el pago</Button>
          </div>
        </div></div>
      </div>
    );
  }

  const orden = guardada ?? consulta.datos;
  if (!orden && consulta.cargando) return <div className="container py-5"><Cargando /></div>;
  if (!orden) {
    return <div className="container py-5"><EmptyState mensaje="No encontramos esa compra."><Link to="/" className="btn btn-primary">Volver al inicio</Link></EmptyState></div>;
  }

  return (
    <div className="container py-4" style={{ maxWidth: 860 }}>
      <div className="card shadow-sm"><div className="card-body">
        <div className="d-flex justify-content-between flex-wrap gap-2 mb-3">
          <h1 className="h4 kiltro-heading text-success"><i className="bi bi-check-circle me-2" aria-hidden="true" />Se ha realizado la compra. nro #{orden.id}</h1>
          <small className="text-secondary">Código orden: {orden.codigo}</small>
        </div>
        <Boleta orden={orden} />
        <div className="d-flex justify-content-center gap-2 mt-3 flex-wrap">
          <Button variant="danger" size="sm" onClick={() => window.print()}>Imprimir boleta en PDF</Button>
          <Button variant="success" size="sm" onClick={() => setCorreoEnviado(true)}>Enviar boleta por email</Button>
        </div>
        {correoEnviado && <div className="alert alert-success mt-3 mb-0" role="status">Boleta enviada a {orden.cliente.correo} (envío simulado).</div>}
      </div></div>
      <div className="text-center mt-3"><Link to="/productos">Seguir comprando</Link></div>
    </div>
  );
}
