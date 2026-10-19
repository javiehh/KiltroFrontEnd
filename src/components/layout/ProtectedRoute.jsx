import { Link, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';

export function AccesoDenegado() {
  return (
    <div className="container py-5 text-center" data-testid="acceso-denegado">
      <h1 className="h3 kiltro-heading">Acceso denegado</h1>
      <p className="text-secondary">Tu rol no tiene permiso para ver esta sección.</p>
      <Link to="/" className="btn btn-primary">Volver a la tienda</Link>
    </div>
  );
}

/**
 * Protege una ruta: sin sesión manda al login (recordando a dónde quería ir);
 * con sesión pero sin el rol necesario muestra "Acceso denegado".
 */
export default function ProtectedRoute({ roles, children }) {
  const { usuario } = useAuth();
  const location = useLocation();
  if (!usuario) return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  if (roles && !roles.includes(usuario.tipo)) return <AccesoDenegado />;
  return children;
}
