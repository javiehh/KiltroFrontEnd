import { screen } from '@testing-library/react';
import { Route, Routes } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute.jsx';
import { ROLES } from '../../data/constantes.js';
import { renderConApp, reiniciarTodo, RUN } from '../../test-utils.jsx';

const Rutas = () => (
  <Routes>
    <Route path="/login" element={<div>PÁGINA LOGIN</div>} />
    <Route path="/admin" element={<ProtectedRoute roles={[ROLES.ADMIN]}><div>PANEL</div></ProtectedRoute>} />
  </Routes>
);

describe('Rutas protegidas', () => {
  beforeEach(reiniciarTodo);

  it('sin sesión redirige al login, con rol incorrecto deniega y con el rol correcto muestra el panel', () => {
    const sinSesion = renderConApp(<Rutas />, { ruta: '/admin' });
    expect(screen.getByText('PÁGINA LOGIN')).toBeTruthy();
    sinSesion.unmount();

    const cliente = renderConApp(<Rutas />, { ruta: '/admin', usuarioRun: RUN.CLIENTE });
    expect(screen.getByTestId('acceso-denegado')).toBeTruthy();
    cliente.unmount();

    renderConApp(<Rutas />, { ruta: '/admin', usuarioRun: RUN.ADMIN });
    expect(screen.getByText('PANEL')).toBeTruthy();
  });
});
