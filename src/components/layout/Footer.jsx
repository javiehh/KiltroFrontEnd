import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';

export default function Footer() {
  const { puedeEntrarAlPanel } = useAuth();
  return (
    <footer className="kiltro-footer py-4 mt-5">
      <div className="container d-flex flex-column flex-md-row justify-content-between gap-2 small">
        <span>© {new Date().getFullYear()} Kiltro. Tienda para animales.</span>
        <nav aria-label="Enlaces del pie de página" className="d-flex gap-3">
          <Link to="/nosotros">Nosotros</Link>
          <Link to="/contacto">Contacto</Link>
          <Link to="/blog">Blog</Link>
          {puedeEntrarAlPanel && <Link to="/admin">Panel de administración</Link>}
        </nav>
      </div>
    </footer>
  );
}
