import { useState } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { PERMISOS } from '../../permisos.js';
import Logo from './Logo.jsx';

/** Opciones del menú lateral y el permiso que exige cada una (ver permisos.js: el Vendedor solo ve productos y órdenes). */
export const MENU_ADMIN = [
  { ruta: '/admin', texto: 'Dashboard', icono: 'bi-speedometer2', permiso: PERMISOS.REPORTES_VER, fin: true },
  { ruta: '/admin/ordenes', texto: 'Órdenes', icono: 'bi-receipt', permiso: PERMISOS.ORDENES_VER },
  { ruta: '/admin/productos', texto: 'Productos', icono: 'bi-box-seam', permiso: PERMISOS.PRODUCTOS_VER },
  { ruta: '/admin/categorias', texto: 'Categorías', icono: 'bi-tags', permiso: PERMISOS.CATEGORIAS_GESTIONAR },
  { ruta: '/admin/usuarios', texto: 'Usuarios', icono: 'bi-people', permiso: PERMISOS.USUARIOS_GESTIONAR },
  { ruta: '/admin/reportes', texto: 'Reportes', icono: 'bi-bar-chart', permiso: PERMISOS.REPORTES_VER },
  { ruta: '/admin/perfil', texto: 'Perfil', icono: 'bi-person-circle', permiso: PERMISOS.PERFIL_PROPIO }
];

export default function AdminLayout() {
  const { usuario, logout, puede } = useAuth();
  const navigate = useNavigate();
  const [abierto, setAbierto] = useState(false);
  const opciones = MENU_ADMIN.filter((o) => puede(o.permiso));

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
