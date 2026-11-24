import { ROLES } from '../data/constantes.js';
import { compraAApi, perfilAApi, productoAApi, registroAApi, usuarioAApi, usuarioDesdeApi } from './adaptadores.js';

describe('Adaptadores API <-> interfaz', () => {
  const deLaApi = {
    id: 3, run: '123456785', nombre: 'Pedro', apellidos: 'Pérez', correo: 'pedro@gmail.com', rol: 'CLIENTE',
    region: 'Región Metropolitana de Santiago', comuna: 'Ñuñoa', direccion: 'Los Crisantemos 123', fechaNacimiento: null
  };

  it('traduce el rol de la API al tipo que usa la interfaz', () => {
    expect(usuarioDesdeApi({ ...deLaApi, rol: 'ADMIN' }).tipo).toBe(ROLES.ADMIN);
    expect(usuarioDesdeApi({ ...deLaApi, rol: 'VENDEDOR' }).tipo).toBe(ROLES.VENDEDOR);
    expect(usuarioDesdeApi({ ...deLaApi, rol: 'CLIENTE' }).tipo).toBe(ROLES.CLIENTE);
  });

  it('un rol desconocido se trata como Cliente (el de menos permisos)', () => {
    expect(usuarioDesdeApi({ ...deLaApi, rol: 'SUPERUSUARIO' }).tipo).toBe(ROLES.CLIENTE);
  });

  it('la fecha de nacimiento nula pasa a texto vacío, que es lo que espera el formulario', () => {
    expect(usuarioDesdeApi(deLaApi).fechaNacimiento).toBe('');
    expect(usuarioDesdeApi({ ...deLaApi, fechaNacimiento: '1998-11-02' }).fechaNacimiento).toBe('1998-11-02');
  });

  it('el usuario de la interfaz nunca incluye la contraseña', () => {
    expect(Object.keys(usuarioDesdeApi({ ...deLaApi, password: 'x' }))).not.toContain('password');
  });

  it('el registro no envía rol y convierte la fecha vacía en null', () => {
    const cuerpo = registroAApi({ ...deLaApi, password: 'ana123', tipo: 'Administrador', fechaNacimiento: '' });

    expect(cuerpo.rol).toBeUndefined();
    expect(cuerpo.tipo).toBeUndefined();
    expect(cuerpo.fechaNacimiento).toBeNull();
    expect(cuerpo.password).toBe('ana123');
  });

  it('el perfil no envía RUN ni rol, y la contraseña solo si se escribió una nueva', () => {
    const sinClave = perfilAApi({ ...deLaApi, tipo: 'Administrador', password: '' });
    expect(sinClave.run).toBeUndefined();
    expect(sinClave.rol).toBeUndefined();
    expect(sinClave.password).toBeUndefined();

    expect(perfilAApi({ ...deLaApi, password: 'nueva1' }).password).toBe('nueva1');
  });

  it('el formulario del administrador traduce el tipo al rol de la API', () => {
    expect(usuarioAApi({ ...deLaApi, tipo: ROLES.VENDEDOR }).rol).toBe('VENDEDOR');
    expect(usuarioAApi({ ...deLaApi, tipo: ROLES.ADMIN }).run).toBe('123456785');
  });

  it('el producto envía solo el porcentaje de descuento: sin la casilla "oferta" el descuento es 0', () => {
    const base = { codigo: 'PER-004', nombre: 'Pelota', descripcion: '', precio: '6990', stock: '20', stockCritico: '', categoriaId: '1', imagenUrl: '' };

    const enOferta = productoAApi({ ...base, oferta: true, descuento: '15' });
    expect(enOferta.descuento).toBe(15);
    expect(enOferta.oferta).toBeUndefined();

    expect(productoAApi({ ...base, oferta: false, descuento: '15' }).descuento).toBe(0);
  });

  it('el producto convierte los números, usa 0 como stock crítico por defecto y la imagen vacía pasa a null', () => {
    const cuerpo = productoAApi({ codigo: 'X-1', nombre: 'N', descripcion: '', precio: '6990', stock: '20', stockCritico: '', categoriaId: '2', imagenUrl: '' });

    expect(cuerpo.precio).toBe(6990);
    expect(cuerpo.stock).toBe(20);
    expect(cuerpo.stockCritico).toBe(0);
    expect(cuerpo.categoriaId).toBe(2);
    expect(cuerpo.imagenUrl).toBeNull();
  });

  it('la compra envía SOLO productoId y cantidad: ningún precio ni total', () => {
    const cuerpo = compraAApi({
      cliente: { nombre: 'Pedro', apellidos: 'Pérez', correo: 'pedro@gmail.com' },
      direccion: { calle: 'Los Crisantemos 123', region: 'RM', comuna: 'Ñuñoa' },
      lineas: [{ producto: { id: 1, precio: 34990, nombre: 'Alimento' }, cantidad: 2, precio: 29742, subtotal: 59484 }]
    });

    expect(cuerpo.items).toEqual([{ productoId: 1, cantidad: 2 }]);
    expect(JSON.stringify(cuerpo)).not.toContain('29742');
    expect(JSON.stringify(cuerpo)).not.toContain('34990');
    expect(cuerpo.total).toBeUndefined();
    expect(cuerpo.direccion.departamento).toBe('');
  });
});
