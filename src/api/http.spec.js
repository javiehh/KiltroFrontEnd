import { AxiosError } from 'axios';
import { crearCliente } from './http.js';
import { sesion } from './sesion.js';

function tokenFalso(segundosDeVida, marca = 'x') {
  const codificar = (objeto) => btoa(JSON.stringify(objeto)).replace(/=+$/, '').replace(/\+/g, '-').replace(/\//g, '_');
  const exp = Math.floor(Date.now() / 1000) + segundosDeVida;
  return `${codificar({ alg: 'HS256', marca })}.${codificar({ exp })}.firma`;
}

function responder(config, status, data = {}) {
  const respuesta = { data, status, statusText: '', headers: {}, config };
  if (status >= 200 && status < 300) return Promise.resolve(respuesta);
  return Promise.reject(new AxiosError(`HTTP ${status}`, AxiosError.ERR_BAD_REQUEST, config, null, respuesta));
}

const autorizacion = (config) => config.headers.get('Authorization');

function clienteDePrueba(manejador, pedirTokens) {
  const cliente = crearCliente('http://servidor.test', pedirTokens);
  cliente.defaults.adapter = (config) => manejador(config);
  return cliente;
}

describe('Cliente HTTP con interceptores', () => {
  let cancelarAviso;

  beforeEach(() => {
    localStorage.clear();
    cancelarAviso = () => {};
  });
  afterEach(() => cancelarAviso());

  it('agrega el token a cada petición cuando hay sesión', async () => {
    const acceso = tokenFalso(600);
    sesion.guardar(acceso, 'refresh');
    const manejador = jasmine.createSpy('servidor').and.callFake((config) => responder(config, 200));

    await clienteDePrueba(manejador, async () => 'no-se-usa').get('/api/v1/productos');

    expect(autorizacion(manejador.calls.mostRecent().args[0])).toBe(`Bearer ${acceso}`);
  });

  it('sin sesión no envía el encabezado Authorization', async () => {
    const manejador = jasmine.createSpy('servidor').and.callFake((config) => responder(config, 200));

    await clienteDePrueba(manejador, async () => 'no-se-usa').get('/api/v1/productos');

    expect(autorizacion(manejador.calls.mostRecent().args[0])).toBeFalsy();
  });

  it('si el servidor responde 401, renueva los tokens y repite la petición una vez', async () => {
    const nuevo = tokenFalso(600, 'nuevo');
    sesion.guardar(tokenFalso(600, 'viejo'), 'refresh-1');
    const pedir = jasmine.createSpy('pedirTokens').and.callFake(async () => {
      sesion.guardar(nuevo, 'refresh-2');
      return nuevo;
    });
    const manejador = jasmine.createSpy('servidor').and.callFake((config) =>
      autorizacion(config) === `Bearer ${nuevo}` ? responder(config, 200, { ok: true }) : responder(config, 401));

    const respuesta = await clienteDePrueba(manejador, pedir).get('/api/v1/usuarios');

    expect(respuesta.data.ok).toBe(true);
    expect(manejador).toHaveBeenCalledTimes(2);
    expect(pedir).toHaveBeenCalledTimes(1);
    expect(sesion.obtenerRefresh()).toBe('refresh-2');
  });

  it('varias peticiones que fallan a la vez renuevan los tokens UNA sola vez', async () => {
    const nuevo = tokenFalso(600, 'nuevo');
    sesion.guardar(tokenFalso(600, 'viejo'), 'refresh-1');
    const pedir = jasmine.createSpy('pedirTokens').and.callFake(
      () => new Promise((resolver) => setTimeout(() => { sesion.guardar(nuevo, 'refresh-2'); resolver(nuevo); }, 20)));
    const manejador = (config) => (autorizacion(config) === `Bearer ${nuevo}` ? responder(config, 200) : responder(config, 401));
    const cliente = clienteDePrueba(manejador, pedir);

    const respuestas = await Promise.all([cliente.get('/a'), cliente.get('/b'), cliente.get('/c'), cliente.get('/d')]);

    expect(respuestas.every((r) => r.status === 200)).toBe(true);
    expect(pedir).toHaveBeenCalledTimes(1);
  });

  it('si la renovación falla, cierra la sesión y la petición queda rechazada con 401', async () => {
    sesion.guardar(tokenFalso(600), 'refresh-vencido');
    const aviso = jasmine.createSpy('sesionExpirada');
    cancelarAviso = sesion.alExpirar(aviso);
    const pedir = () => Promise.reject(new Error('refresh vencido'));
    const cliente = clienteDePrueba((config) => responder(config, 401), pedir);

    const error = await cliente.get('/api/v1/usuarios').catch((e) => e);

    expect(error.response.status).toBe(401);
    expect(aviso).toHaveBeenCalledTimes(1);
    expect(sesion.hayTokens()).toBe(false);
  });

  it('un 401 del login (contraseña incorrecta) no intenta renovar nada', async () => {
    sesion.guardar(tokenFalso(600), 'refresh-1');
    const pedir = jasmine.createSpy('pedirTokens');
    const cliente = clienteDePrueba((config) => responder(config, 401, { mensaje: 'Correo o contraseña incorrectos' }), pedir);

    const error = await cliente.post('/api/v1/auth/login', {}).catch((e) => e);

    expect(error.response.status).toBe(401);
    expect(pedir).not.toHaveBeenCalled();
  });

  it('si después de renovar el servidor sigue respondiendo 401, no reintenta en bucle', async () => {
    const nuevo = tokenFalso(600, 'nuevo');
    sesion.guardar(tokenFalso(600, 'viejo'), 'refresh-1');
    const pedir = jasmine.createSpy('pedirTokens').and.callFake(async () => {
      sesion.guardar(nuevo, 'refresh-2');
      return nuevo;
    });
    const manejador = jasmine.createSpy('servidor').and.callFake((config) => responder(config, 401));

    const error = await clienteDePrueba(manejador, pedir).get('/api/v1/usuarios').catch((e) => e);

    expect(error.response.status).toBe(401);
    expect(manejador).toHaveBeenCalledTimes(2);
    expect(pedir).toHaveBeenCalledTimes(1);
  });

  it('renueva el token ANTES de enviar si está por vencer (una compra no viaja con un token vencido)', async () => {
    const nuevo = tokenFalso(600, 'nuevo');
    sesion.guardar(tokenFalso(10, 'por-vencer'), 'refresh-1');
    const pedir = jasmine.createSpy('pedirTokens').and.callFake(async () => {
      sesion.guardar(nuevo, 'refresh-2');
      return nuevo;
    });
    const manejador = jasmine.createSpy('servidor').and.callFake((config) => responder(config, 201));

    await clienteDePrueba(manejador, pedir).post('/api/v1/boletas', {});

    expect(pedir).toHaveBeenCalledTimes(1);
    expect(manejador).toHaveBeenCalledTimes(1);
    expect(autorizacion(manejador.calls.mostRecent().args[0])).toBe(`Bearer ${nuevo}`);
  });
});
