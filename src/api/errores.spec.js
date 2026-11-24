import { mensajeDeError } from './errores.js';

describe('mensajeDeError', () => {
  it('sin respuesta del servidor avisa que no hay conexión', () => {
    expect(mensajeDeError(new Error('Network Error'))).toContain('No se pudo conectar');
    expect(mensajeDeError(undefined)).toContain('No se pudo conectar');
  });

  it('usa el mensaje que entrega la API', () => {
    const error = { response: { data: { status: 401, mensaje: 'Correo o contraseña incorrectos' } } };
    expect(mensajeDeError(error)).toBe('Correo o contraseña incorrectos');
  });

  it('agrega el detalle por campo de los errores de validación (400)', () => {
    const error = { response: { data: { mensaje: 'Datos inválidos', errores: { nombre: 'El nombre es obligatorio' } } } };
    expect(mensajeDeError(error)).toBe('Datos inválidos El nombre es obligatorio');
  });

  it('si la respuesta no trae mensaje usa el texto por defecto', () => {
    expect(mensajeDeError({ response: { data: {} } }, 'Algo falló')).toBe('Algo falló');
  });
});
