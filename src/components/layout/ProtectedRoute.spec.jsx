import { screen } from '@testing-library/react';
import { Route, Routes } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute.jsx';
import { PERMISOS } from '../../permisos.js';
import { renderConApp, reiniciarTodo, RUN } from '../../test-utils.jsx';

const Rutas = ({ permiso }) => (
  <Routes>
    <Route path="/login" element={<div>PÁGINA LOGIN</div>} />
    <Route path="/zona" element={<ProtectedRoute permiso={permiso}><div>CONTENIDO</div></ProtectedRoute>} />
  </Routes>
);

describe('Rutas protegidas', () => {
  beforeEach(reiniciarTodo);

  it('sin sesión redirige al login, con un rol sin el permiso deniega y con el permiso muestra el contenido', () => {
    const sinSesion = renderConApp(<Rutas permiso={PERMISOS.PANEL} />, { ruta: '/zona' });
    expect(screen.getByText('PÁGINA LOGIN')).toBeTruthy();
    sinSesion.unmount();

    const cliente = renderConApp(<Rutas permiso={PERMISOS.PANEL} />, { ruta: '/zona', usuarioRun: RUN.CLIENTE });
    expect(screen.getByTestId('acceso-denegado')).toBeTruthy();
    cliente.unmount();

    renderConApp(<Rutas permiso={PERMISOS.PANEL} />, { ruta: '/zona', usuarioRun: RUN.ADMIN });
    expect(screen.getByText('CONTENIDO')).toBeTruthy();
  });

  it('el Vendedor entra al panel y a las órdenes, pero no a la gestión de usuarios', () => {
    const panel = renderConApp(<Rutas permiso={PERMISOS.PANEL} />, { ruta: '/zona', usuarioRun: RUN.VENDEDOR });
    expect(screen.getByText('CONTENIDO')).toBeTruthy();
    panel.unmount();

    const usuarios = renderConApp(<Rutas permiso={PERMISOS.USUARIOS_GESTIONAR} />, { ruta: '/zona', usuarioRun: RUN.VENDEDOR });
    expect(screen.getByTestId('acceso-denegado')).toBeTruthy();
    usuarios.unmount();

    renderConApp(<Rutas permiso={PERMISOS.USUARIOS_GESTIONAR} />, { ruta: '/zona', usuarioRun: RUN.ADMIN });
    expect(screen.getByText('CONTENIDO')).toBeTruthy();
  });

  it('mientras se verifica la sesión muestra un indicador y NO redirige al login', () => {
    renderConApp(<Rutas permiso={PERMISOS.PANEL} />, { ruta: '/zona', cargando: true });

    expect(screen.getByTestId('verificando-sesion')).toBeTruthy();
    expect(screen.queryByText('PÁGINA LOGIN')).toBeNull();
  });
});
