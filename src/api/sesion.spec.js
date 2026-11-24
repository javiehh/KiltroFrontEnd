import { sesion } from './sesion.js';

/** Token con la forma de un JWT (encabezado.datos.firma); solo importa el "exp". */
function tokenFalso(segundosDeVida) {
  const codificar = (objeto) => btoa(JSON.stringify(objeto)).replace(/=+$/, '').replace(/\+/g, '-').replace(/\//g, '_');
  const exp = Math.floor(Date.now() / 1000) + segundosDeVida;
  return `${codificar({ alg: 'HS256' })}.${codificar({ exp })}.firma`;
}

describe('sesion (tokens)', () => {
  beforeEach(() => localStorage.clear());

  it('guarda, lee y limpia los tokens', () => {
    expect(sesion.hayTokens()).toBe(false);

    sesion.guardar('acceso-1', 'refresh-1');
    expect(sesion.obtenerAcceso()).toBe('acceso-1');
    expect(sesion.obtenerRefresh()).toBe('refresh-1');
    expect(sesion.hayTokens()).toBe(true);

    sesion.limpiar();
    expect(sesion.obtenerAcceso()).toBeNull();
    expect(sesion.hayTokens()).toBe(false);
  });

  it('estaPorVencer distingue un token vigente de uno por vencer o vencido', () => {
    expect(sesion.estaPorVencer(tokenFalso(600))).toBe(false);  // vence en 10 minutos
    expect(sesion.estaPorVencer(tokenFalso(10))).toBe(true);    // vence en 10 segundos (margen de 30)
    expect(sesion.estaPorVencer(tokenFalso(-60))).toBe(true);   // ya venció
  });

  it('un texto que no es un token no se considera por vencer', () => {
    expect(sesion.estaPorVencer('basura')).toBe(false);
    expect(sesion.estaPorVencer('')).toBe(false);
  });

  it('expirar borra los tokens y avisa a quienes escuchan; se puede dejar de escuchar', () => {
    const aviso = jasmine.createSpy('aviso');
    const cancelar = sesion.alExpirar(aviso);
    sesion.guardar('a', 'r');

    sesion.expirar();
    expect(aviso).toHaveBeenCalledTimes(1);
    expect(sesion.hayTokens()).toBe(false);

    cancelar();
    sesion.expirar();
    expect(aviso).toHaveBeenCalledTimes(1);
  });
});
