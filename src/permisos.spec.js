import { ROLES } from './data/constantes.js';
import { PERMISOS, puede } from './permisos.js';

const admin = { tipo: ROLES.ADMIN };
const vendedor = { tipo: ROLES.VENDEDOR };
const cliente = { tipo: ROLES.CLIENTE };

describe('Permisos por rol', () => {
  it('el Administrador tiene todos los permisos', () => {
    Object.values(PERMISOS).forEach((permiso) => expect(puede(admin, permiso)).toBe(true));
  });

  it('el Vendedor solo ve órdenes y productos (y su perfil): no gestiona nada más', () => {
    expect(puede(vendedor, PERMISOS.PANEL)).toBe(true);
    expect(puede(vendedor, PERMISOS.ORDENES_VER)).toBe(true);
    expect(puede(vendedor, PERMISOS.PRODUCTOS_VER)).toBe(true);
    expect(puede(vendedor, PERMISOS.PERFIL_PROPIO)).toBe(true);

    expect(puede(vendedor, PERMISOS.PRODUCTOS_GESTIONAR)).toBe(false);
    expect(puede(vendedor, PERMISOS.ORDENES_GESTIONAR)).toBe(false);
    expect(puede(vendedor, PERMISOS.CATEGORIAS_GESTIONAR)).toBe(false);
    expect(puede(vendedor, PERMISOS.USUARIOS_GESTIONAR)).toBe(false);
    expect(puede(vendedor, PERMISOS.REPORTES_VER)).toBe(false);
  });

  it('el Cliente no tiene ningún permiso del panel', () => {
    Object.values(PERMISOS).forEach((permiso) => expect(puede(cliente, permiso)).toBe(false));
  });

  it('sin usuario o con un rol desconocido no hay permisos', () => {
    expect(puede(null, PERMISOS.PANEL)).toBe(false);
    expect(puede(undefined, PERMISOS.PANEL)).toBe(false);
    expect(puede({ tipo: 'Inventado' }, PERMISOS.PANEL)).toBe(false);
  });
});
