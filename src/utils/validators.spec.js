import { correoValido, runValido } from './validators.js';

describe('Validaciones de formularios', () => {
  it('valida el RUN chileno (módulo 11) y el dominio del correo', () => {
    expect(runValido('123456785').valid).toBeTrue();
    expect(runValido('123456780').valid).toBeFalse(); // dígito verificador incorrecto
    expect(correoValido('ana@gmail.com').valid).toBeTrue();
    expect(correoValido('ana@hotmail.com').valid).toBeFalse(); // dominio no permitido
  });
});
