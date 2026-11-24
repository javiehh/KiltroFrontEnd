export const ROLES = { ADMIN: 'Administrador', VENDEDOR: 'Vendedor', CLIENTE: 'Cliente' };
/** Estados de una boleta: los mismos que maneja ms-ventas. Una compra sin stock no se guarda (responde 409), por eso no hay "rechazada". */
export const ESTADOS_BOLETA = { PAGADA: 'PAGADA', ENVIADA: 'ENVIADA', ENTREGADA: 'ENTREGADA', ANULADA: 'ANULADA' };
export const ETIQUETA_ESTADO = { PAGADA: 'Pagada', ENVIADA: 'Enviada', ENTREGADA: 'Entregada', ANULADA: 'Anulada' };
export const COLOR_ESTADO = { PAGADA: 'success', ENVIADA: 'info', ENTREGADA: 'primary', ANULADA: 'danger' };
export const MEDIA_POR_DEFECTO = { tipo: 'icono', icono: 'huellas', tile: '#D9A441' };
