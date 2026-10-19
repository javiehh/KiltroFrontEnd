import { fireEvent, render, screen } from '@testing-library/react';
import LoginForm from './LoginForm.jsx';

describe('Estado (state)', () => {
  it('el estado de LoginForm cambia correctamente cuando el usuario escribe', () => {
    render(<LoginForm onSubmit={() => {}} />);
    const correo = screen.getByLabelText('Correo electrónico');
    const clave = screen.getByLabelText('Contraseña');

    fireEvent.change(correo, { target: { value: 'ana@gmail.com' } });
    fireEvent.change(clave, { target: { value: 'clave1' } });

    expect(correo.value).toBe('ana@gmail.com');
    expect(clave.value).toBe('clave1');
  });
});
