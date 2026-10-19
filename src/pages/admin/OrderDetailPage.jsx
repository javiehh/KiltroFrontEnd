import { Link, useParams } from 'react-router-dom';
import { ordenesRepo } from '../../data/db.js';
import { useCollection } from '../../hooks/useCollection.js';
import Boleta from '../../components/common/Boleta.jsx';
import Button from '../../components/common/Button.jsx';
import EmptyState from '../../components/common/EmptyState.jsx';
import PageHeader from '../../components/common/PageHeader.jsx';

export default function OrderDetailPage() {
  const { numero } = useParams();
  const orden = useCollection(ordenesRepo).find((o) => o.numero === numero);
  if (!orden) return <EmptyState mensaje="No encontramos esa orden."><Link to="/admin/ordenes" className="btn btn-primary">Volver a órdenes</Link></EmptyState>;
  return (
    <>
      <PageHeader titulo={`Boleta #${orden.numero}`} subtitulo={`Estado: ${orden.estado}${orden.motivoRechazo ? ` — ${orden.motivoRechazo}` : ''}`}>
        <Button variant="outline-secondary" onClick={() => window.print()}>Imprimir</Button>
        <Link to="/admin/ordenes" className="btn btn-outline-primary">← Órdenes</Link>
      </PageHeader>
      <div className="card shadow-sm"><div className="card-body"><Boleta orden={orden} /></div></div>
    </>
  );
}
