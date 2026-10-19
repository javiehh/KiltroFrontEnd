import { render, screen } from '@testing-library/react';
import FormField from './FormField.jsx';

describe('Renderizado condicional', () => {
  it('FormField muestra el mensaje de error SOLO cuando hay un error presente', () => {
    const { rerender } = render(<FormField id="correo" label="Correo" defaultValue="" />);
    expect(screen.queryByRole('alert')).toBeNull(); // sin error: no se dibuja

    rerender(<FormField id="correo" label="Correo" error="Correo inválido" defaultValue="" />);
    expect(screen.getByRole('alert').textContent).toBe('Correo inválido'); // con error: sí
    expect(screen.getByLabelText('Correo').className).toContain('is-invalid');
  });
});
