import { useState } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import QuantitySelector from './QuantitySelector.jsx';

function Contenedor() {
  const [cantidad, setCantidad] = useState(1);
  return (<><QuantitySelector value={cantidad} onChange={setCantidad} min={1} max={5} /><output data-testid="estado">{cantidad}</output></>);
}

describe('Simulación de eventos', () => {
  it('un clic en el botón + cambia el estado del componente (y respeta el máximo)', () => {
    render(<Contenedor />);
    fireEvent.click(screen.getByLabelText('Aumentar'));
    expect(screen.getByTestId('estado').textContent).toBe('2');
    fireEvent.change(screen.getByRole('spinbutton'), { target: { value: '99' } });
    expect(screen.getByTestId('estado').textContent).toBe('5'); // no pasa del máximo
  });
});
