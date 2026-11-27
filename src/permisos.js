import { ROLES } from './data/constantes.js';

export const PERMISOS = {
  PANEL: 'panel',
  ORDENES_VER: 'ordenes.ver',
  ORDENES_GESTIONAR: 'ordenes.gestionar',
  PRODUCTOS_VER: 'productos.ver',
  PRODUCTOS_GESTIONAR: 'productos.gestionar',
  CATEGORIAS_GESTIONAR: 'categorias.gestionar',
  USUARIOS_GESTIONAR: 'usuarios.gestionar',
  REPORTES_VER: 'reportes.ver',
  PERFIL_PROPIO: 'perfil.propio'
};

const POR_ROL = {
  [ROLES.ADMIN]: Object.values(PERMISOS),
  [ROLES.VENDEDOR]: [PERMISOS.PANEL, PERMISOS.ORDENES_VER, PERMISOS.PRODUCTOS_VER, PERMISOS.PERFIL_PROPIO],
  [ROLES.CLIENTE]: []
};

export const puede = (usuario, permiso) => Boolean(usuario) && (POR_ROL[usuario.tipo] || []).includes(permiso);
