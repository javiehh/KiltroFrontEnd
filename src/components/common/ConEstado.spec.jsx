import { fireEvent, render, screen } from '@testing-library/react';
import ConEstado, { ConConsulta } from './ConEstado.jsx';

describe('ConEstado', () => {
  it('mientras carga muestra el indicador y no el contenido', () => {
    render(<ConEstado listo={false} cargando>{() => <p>CONTENIDO</p>}</ConEstado>);
    expect(screen.getByTestId('cargando')).toBeTruthy();
    expect(screen.queryByText('CONTENIDO')).toBeNull();
  });

  it('si falló muestra el error con un botón que permite reintentar', () => {
    const reintentar = jasmine.createSpy('reintentar');
    render(<ConEstado listo={false} cargando={false} error="No se pudo conectar" onReintentar={reintentar}>{() => <p>CONTENIDO</p>}</ConEstado>);

    expect(screen.getByTestId('error-carga').textContent).toContain('No se pudo conectar');
    fireEvent.click(screen.getByRole('button', { name: 'Reintentar' }));
    expect(reintentar).toHaveBeenCalledTimes(1);
  });

  it('con datos listos ejecuta los hijos (la función solo se llama cuando ya hay datos)', () => {
    const consulta = { datos: [1, 2], cargando: false, error: '', recargar: () => {} };
    render(<ConConsulta consulta={consulta}>{(datos) => <p>HAY {datos.length} DATOS</p>}</ConConsulta>);
    expect(screen.getByText('HAY 2 DATOS')).toBeTruthy();
  });
});
