/**
 * Traductores entre lo que habla la API y lo que ya usa la interfaz. Así los componentes no cambian:
 * siguen trabajando con usuario.tipo = 'Administrador' aunque el backend use rol = 'ADMIN'.
 */
import { ROLES } from '../data/constantes.js';

const ROL_A_TIPO = { ADMIN: ROLES.ADMIN, VENDEDOR: ROLES.VENDEDOR, CLIENTE: ROLES.CLIENTE };
const TIPO_A_ROL = Object.fromEntries(Object.entries(ROL_A_TIPO).map(([rol, tipo]) => [tipo, rol]));

/** API -> interfaz. Un rol desconocido se trata como Cliente (el de menos permisos). */
export const usuarioDesdeApi = (u) => ({
  id: u.id,
  run: u.run,
  nombre: u.nombre,
  apellidos: u.apellidos,
  correo: u.correo,
  tipo: ROL_A_TIPO[u.rol] ?? ROLES.CLIENTE,
  region: u.region,
  comuna: u.comuna,
  direccion: u.direccion,
  fechaNacimiento: u.fechaNacimiento ?? ''
});

const fechaOpcional = (valor) => valor || null;

/** Formulario de registro -> RegistroRequest (no lleva rol: el servidor siempre crea un Cliente). */
export const registroAApi = (d) => ({
  run: d.run,
  nombre: d.nombre,
  apellidos: d.apellidos,
  correo: d.correo,
  password: d.password,
  region: d.region,
  comuna: d.comuna,
  direccion: d.direccion,
  fechaNacimiento: fechaOpcional(d.fechaNacimiento)
});

/** Formulario de perfil -> PerfilRequest (sin RUN ni rol). La contraseña solo viaja si se escribió una nueva. */
export const perfilAApi = (d) => {
  const cuerpo = {
    nombre: d.nombre,
    apellidos: d.apellidos,
    correo: d.correo,
    region: d.region,
    comuna: d.comuna,
    direccion: d.direccion,
    fechaNacimiento: fechaOpcional(d.fechaNacimiento)
  };
  if (d.password) cuerpo.password = d.password;
  return cuerpo;
};

/** Formulario del administrador -> UsuarioRequest (con rol). */
export const usuarioAApi = (d) => ({
  ...perfilAApi(d),
  run: d.run,
  rol: TIPO_A_ROL[d.tipo]
});

/**
 * Formulario de producto -> ProductoRequest. La API recibe SOLO el porcentaje de descuento (0 = sin oferta),
 * no la casilla "oferta"; la imagen viaja como URL y el servidor decide si guarda una foto o un ícono.
 */
export const productoAApi = (d) => ({
  codigo: d.codigo,
  nombre: d.nombre,
  descripcion: d.descripcion,
  precio: Number(d.precio),
  descuento: d.oferta ? Number(d.descuento) : 0,
  stock: Number(d.stock),
  stockCritico: d.stockCritico === '' || d.stockCritico == null ? 0 : Number(d.stockCritico),
  imagenUrl: d.imagenUrl || null,
  categoriaId: Number(d.categoriaId)
});

/**
 * Compra -> CompraRequest. Solo viajan productoId y cantidad de cada línea: el precio y el total los calcula el
 * backend, así nadie puede comprar a $1 modificando la petición.
 */
export const compraAApi = ({ cliente, direccion, lineas }) => ({
  cliente: { nombre: cliente.nombre, apellidos: cliente.apellidos, correo: cliente.correo },
  direccion: {
    calle: direccion.calle,
    departamento: direccion.departamento || '',
    region: direccion.region,
    comuna: direccion.comuna,
    indicaciones: direccion.indicaciones || ''
  },
  items: lineas.map((linea) => ({ productoId: linea.producto.id, cantidad: linea.cantidad }))
});
