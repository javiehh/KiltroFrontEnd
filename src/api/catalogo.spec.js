import { crearCatalogo } from './catalogo.js';

describe('Almacén del catálogo', () => {
  const productos = [{ id: 1, nombre: 'Alimento' }];
  const categorias = [{ id: 1, nombre: 'Perros' }];
  let cargarProductos;
  let cargarCategorias;
  let reloj;

  const crear = () => crearCatalogo({ cargarProductos, cargarCategorias, vigenciaMs: 1000, ahora: () => reloj });

  beforeEach(() => {
    reloj = 0;
    cargarProductos = jasmine.createSpy('productos').and.callFake(() => Promise.resolve(productos));
    cargarCategorias = jasmine.createSpy('categorias').and.callFake(() => Promise.resolve(categorias));
  });

  it('carga productos y categorías y avisa a quienes escuchan', async () => {
    const catalogo = crear();
    const aviso = jasmine.createSpy('aviso');
    catalogo.suscribir(aviso);

    await catalogo.cargar();

    expect(catalogo.obtener().productos).toEqual(productos);
    expect(catalogo.obtener().categorias).toEqual(categorias);
    expect(catalogo.obtener().cargado).toBe(true);
    expect(aviso).toHaveBeenCalled();
  });

  it('varias peticiones simultáneas comparten UNA sola llamada al servidor', async () => {
    const catalogo = crear();

    await Promise.all([catalogo.cargar(), catalogo.cargar(), catalogo.cargar()]);

    expect(cargarProductos).toHaveBeenCalledTimes(1);
    expect(cargarCategorias).toHaveBeenCalledTimes(1);
  });

  it('reutiliza el resultado mientras está vigente y lo vuelve a pedir cuando vence', async () => {
    const catalogo = crear();
    await catalogo.cargar();
    reloj = 500;
    await catalogo.cargar();
    expect(cargarProductos).toHaveBeenCalledTimes(1);

    reloj = 1500;
    await catalogo.cargar();
    expect(cargarProductos).toHaveBeenCalledTimes(2);
  });

  it('invalidar fuerza la recarga aunque el resultado siga vigente (por ejemplo, tras una compra)', async () => {
    const catalogo = crear();
    await catalogo.cargar();

    await catalogo.invalidar();

    expect(cargarProductos).toHaveBeenCalledTimes(2);
  });

  it('si el servidor falla guarda el mensaje, no queda como cargado y permite reintentar', async () => {
    cargarProductos.and.callFake(() => Promise.reject({ response: { data: { mensaje: 'Servicio no disponible' } } }));
    const catalogo = crear();

    await catalogo.cargar();
    expect(catalogo.obtener().error).toBe('Servicio no disponible');
    expect(catalogo.obtener().cargado).toBe(false);
    expect(catalogo.obtener().cargando).toBe(false);

    cargarProductos.and.callFake(() => Promise.resolve(productos));
    await catalogo.cargar();
    expect(catalogo.obtener().cargado).toBe(true);
    expect(catalogo.obtener().error).toBe('');
  });
});
