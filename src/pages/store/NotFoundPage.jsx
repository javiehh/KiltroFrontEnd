import { Link } from 'react-router-dom';
import EmptyState from '../../components/common/EmptyState.jsx';

export default function NotFoundPage() {
  return (
    <div className="container py-5">
      <EmptyState mensaje="Esta página no existe (error 404).">
        <Link to="/" className="btn btn-primary">Volver al inicio</Link>
      </EmptyState>
    </div>
  );
}
