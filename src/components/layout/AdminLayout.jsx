import { useState } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { ROLES } from '../../data/constantes.js';
import Logo from './Logo.jsx';

const TODOS = [ROLES.ADMIN, ROLES.VENDEDOR];
const SOLO_ADMIN = [ROLES.ADMIN];

/** Opciones del menú lateral y qué roles las pueden ver (el Vendedor solo ve productos y órdenes). */
export const MENU_ADMIN = [
  { ruta: '/admin', texto: 'Dashboard', icono: 'bi-speedometer2', roles: TODOS, fin: true },
  { ruta: '/admin/ordenes', texto: 'Órdenes', icono: 'bi-receipt', roles: TODOS },
  { ruta: '/admin/productos', texto: 'Productos', icono: 'bi-box-seam', roles: TODOS },
  { ruta: '/admin/categorias', texto: 'Categorías', icono: 'bi-tags', roles: SOLO_ADMIN },
  { ruta: '/admin/usuarios', texto: 'Usuarios', icono: 'bi-people', roles: SOLO_ADMIN },
  { ruta: '/admin/reportes', texto: 'Reportes', icono: 'bi-bar-chart', roles: SOLO_ADMIN },
  { ruta: '/admin/perfil', texto: 'Perfil', icono: 'bi-person-circle', roles: TODOS }
];

export default function AdminLayout() {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();
  const [abierto, setAbierto] = useState(false);
  const opciones = MENU_ADMIN.filter((o) => o.roles.includes(usuario.tipo));

  return (
    <div className="d-flex flex-column min-vh-100">
      <header className="kiltro-navbar px-3 py-2 d-flex justify-content-between align-items-center">
        <Logo to="/admin" className="text-white" />
        <div className="d-flex align-items-center gap-3 text-white small">
          <span className="d-none d-sm-inline">{usuario.nombre} · {usuario.tipo}</span>
          <button className="btn btn-outline-light btn-sm d-lg-none" onClick={() => setAbierto(!abierto)} aria-expanded={abierto} aria-controls="menu-admin">
            <i className="bi bi-list" aria-hidden="true" /> Menú
          </button>
        </div>
      </header>
      <div className="d-flex flex-column flex-lg-row flex-grow-1">
        <aside id="menu-admin" className={`kiltro-sidebar p-3 ${abierto ? '' : 'd-none'} d-lg-flex flex-column`}>
          <nav aria-label="Menú del panel" className="nav nav-pills flex-column gap-1 mb-auto">
            {opciones.map((o) => (
              <NavLink key={o.ruta} to={o.ruta} end={o.fin} className="nav-link" onClick={() => setAbierto(false)}>
                <i className={`bi ${o.icono} me-2`} aria-hidden="true" />{o.texto}
              </NavLink>
            ))}
          </nav>
          <hr />
          <Link to="/" className="btn btn-dark w-100 mb-2"><i className="bi bi-shop me-2" aria-hidden="true" />Tienda</Link>
          <button className="btn btn-danger w-100" onClick={() => { logout(); navigate('/'); }}>
            <i className="bi bi-box-arrow-right me-2" aria-hidden="true" />Cerrar sesión
          </button>
        </aside>
        <main className="flex-grow-1 p-3 p-lg-4 kiltro-admin-main"><Outlet /></main>
      </div>
    </div>
  );
}
