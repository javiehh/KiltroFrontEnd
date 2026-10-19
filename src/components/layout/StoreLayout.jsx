import { Outlet } from 'react-router-dom';
import Navbar from './Navbar.jsx';
import Footer from './Footer.jsx';

/** Estructura común de todas las páginas públicas: navbar arriba, contenido en medio, footer abajo. */
export default function StoreLayout() {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />
      <main className="flex-grow-1"><Outlet /></main>
      <Footer />
    </div>
  );
}
