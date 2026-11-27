import { ROLES } from '../data/constantes.js';

const ROL_A_TIPO = { ADMIN: ROLES.ADMIN, VENDEDOR: ROLES.VENDEDOR, CLIENTE: ROLES.CLIENTE };
const TIPO_A_ROL = Object.fromEntries(Object.entries(ROL_A_TIPO).map(([rol, tipo]) => [tipo, rol]));

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

export const usuarioAApi = (d) => ({
  ...perfilAApi(d),
  run: d.run,
  rol: TIPO_A_ROL[d.tipo]
});

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
