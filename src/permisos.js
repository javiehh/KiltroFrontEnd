/**
 * ÚNICO lugar donde se define qué puede hacer cada rol. Las rutas (App.jsx), el menú (AdminLayout) y los
 * botones consultan puede(usuario, permiso): si mañana el Vendedor puede algo más, se cambia solo aquí.
 *
 * Ocultar un botón NO es seguridad: la seguridad real la aplica el backend (401/403). Esto solo evita
 * mostrarle al usuario opciones que el servidor igual le rechazaría.
 */
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
