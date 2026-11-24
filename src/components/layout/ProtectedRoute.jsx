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

function VerificandoSesion() {
  return (
    <div className="container py-5 text-center" role="status" data-testid="verificando-sesion">
      <div className="spinner-border text-primary" aria-hidden="true" />
      <p className="mt-3 text-secondary">Verificando sesión…</p>
    </div>
  );
}

/**
 * Protege una ruta según un PERMISO (ver permisos.js), no según el nombre del rol.
 *  - mientras se confirma la sesión con el servidor muestra un indicador: así recargar con F5 no te manda al login;
 *  - sin sesión redirige al login (y recuerda a dónde querías ir);
 *  - con sesión pero sin el permiso, muestra "Acceso denegado".
 */
export default function ProtectedRoute({ permiso, children }) {
  const { usuario, cargando, puede } = useAuth();
  const location = useLocation();
  if (cargando) return <VerificandoSesion />;
  if (!usuario) return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  if (permiso && !puede(permiso)) return <AccesoDenegado />;
  return children;
}
