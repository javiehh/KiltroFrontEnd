import { fireEvent, render, screen } from '@testing-library/react';
import Button from './Button.jsx';

describe('Propiedades (props)', () => {
  it('Button recibe correctamente la etiqueta y la función onClick', () => {
    const alHacerClic = jasmine.createSpy('onClick');
    render(<Button label="Guardar" onClick={alHacerClic} />);
    const boton = screen.getByRole('button', { name: 'Guardar' }); // la etiqueta llegó por props
    fireEvent.click(boton);
    expect(alHacerClic).toHaveBeenCalledTimes(1); // la función llegó por props y se ejecuta
  });
});
