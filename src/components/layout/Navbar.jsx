import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Container, Nav, NavDropdown, Navbar as BsNavbar } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext.jsx';
import { useCart } from '../../hooks/useCart.js';
import { useCatalogo } from '../../hooks/useCatalogo.js';
import { formatoCLP } from '../../utils/format.js';
import Logo from './Logo.jsx';

/* Barra de navegación de la tienda */
export default function Navbar() {
  const [busqueda, setBusqueda] = useState('');
  const navigate = useNavigate();
  const { categorias } = useCatalogo();
  const { usuario, logout, puedeEntrarAlPanel } = useAuth();
  const { total, cantidad } = useCart();

  const buscar = (e) => {
    e.preventDefault();
    navigate(`/productos?q=${encodeURIComponent(busqueda.trim())}`);
  };

  return (
    <BsNavbar expand="lg" className="kiltro-navbar" variant="dark" sticky="top">
      <Container>
        <BsNavbar.Brand as="span"><Logo className="text-white" /></BsNavbar.Brand>
        <BsNavbar.Toggle aria-controls="menu-principal" />
        <BsNavbar.Collapse id="menu-principal">
          <Nav className="me-auto">
            <Nav.Link as={NavLink} to="/" end>Home</Nav.Link>
            <NavDropdown title="Categorías" id="menu-categorias">
              <NavDropdown.Item as={Link} to="/categorias">Todas las categorías</NavDropdown.Item>
              <NavDropdown.Divider />
              {categorias.map((c) => (
                <NavDropdown.Item key={c.id} as={Link} to={`/categorias/${c.id}`}>{c.nombre}</NavDropdown.Item>
              ))}
            </NavDropdown>
            <Nav.Link as={NavLink} to="/productos">Productos</Nav.Link>
            <Nav.Link as={NavLink} to="/ofertas">Ofertas</Nav.Link>
            <Nav.Link as={NavLink} to="/nosotros">Nosotros</Nav.Link>
            <Nav.Link as={NavLink} to="/blog">Blog</Nav.Link>
            <Nav.Link as={NavLink} to="/contacto">Contacto</Nav.Link>
            {puedeEntrarAlPanel && (
              <Nav.Link as={NavLink} to="/admin" className="fw-semibold" data-testid="enlace-panel-admin">
                <i className="bi bi-shield-lock me-1" aria-hidden="true" />Panel de admin
              </Nav.Link>
            )}
          </Nav>

          <form className="d-flex me-lg-3 my-2 my-lg-0" role="search" onSubmit={buscar}>
            <input className="form-control form-control-sm me-2" type="search" placeholder="Buscar" aria-label="Buscar productos"
              value={busqueda} onChange={(e) => setBusqueda(e.target.value)} />
            <button className="btn btn-outline-light btn-sm" type="submit">Buscar</button>
          </form>

          <Link to="/carrito" className="btn btn-success btn-sm me-lg-3 my-2 my-lg-0" aria-label="Ver carrito">
            <i className="bi bi-cart3 me-1" aria-hidden="true" />
            Carrito <span data-testid="carrito-total">{formatoCLP(total)}</span>
            {cantidad > 0 && <span className="badge text-bg-light ms-2" data-testid="carrito-cantidad">{cantidad}</span>}
          </Link>

          {usuario ? (
            <NavDropdown title={`Hola, ${usuario.nombre}`} id="menu-usuario" align="end">
              {puedeEntrarAlPanel && <NavDropdown.Item as={Link} to="/admin">Panel de administración</NavDropdown.Item>}
              <NavDropdown.Item as="button" onClick={() => { logout(); navigate('/'); }}>Cerrar sesión</NavDropdown.Item>
            </NavDropdown>
          ) : (
            <div className="d-flex gap-2">
              <Link to="/login" className="btn btn-outline-light btn-sm">Iniciar sesión</Link>
              <Link to="/registro" className="btn btn-primary btn-sm">Crear cuenta</Link>
            </div>
          )}
        </BsNavbar.Collapse>
      </Container>
    </BsNavbar>
  );
}
