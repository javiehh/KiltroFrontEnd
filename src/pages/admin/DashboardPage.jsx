import { Link } from 'react-router-dom';
import { ordenesRepo, productosRepo, usuariosRepo } from '../../data/db.js';
import { esCritico } from '../../data/productos.js';
import { resumenVentas, unidadesInventario } from '../../data/reportes.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { useCollection } from '../../hooks/useCollection.js';
import { formatoCLP } from '../../utils/format.js';
import { MENU_ADMIN } from '../../components/layout/AdminLayout.jsx';
import PageHeader from '../../components/common/PageHeader.jsx';
import StatCard from '../../components/common/StatCard.jsx';

const DESCRIPCIONES = {
  '/admin/ordenes': 'Gestión y seguimiento de todas las órdenes de compra realizadas.',
  '/admin/productos': 'Administrar inventario y detalles de los productos disponibles.',
  '/admin/categorias': 'Organizar productos en categorías para facilitar su navegación.',
  '/admin/usuarios': 'Gestión de cuentas de usuario y sus roles dentro del sistema.',
  '/admin/reportes': 'Informes detallados sobre las operaciones del sistema.',
  '/admin/perfil': 'Administración de tu información personal y contraseña.'
};

export default function DashboardPage() {
  const { usuario } = useAuth();
  const ordenes = useCollection(ordenesRepo);
  const productos = useCollection(productosRepo);
  const usuarios = useCollection(usuariosRepo);
  const ventas = resumenVentas(ordenes);
  const criticos = productos.filter(esCritico).length;

  return (
    <>
      <PageHeader titulo={`¡Hola, ${usuario.nombre}!`} subtitulo="Resumen de las actividades diarias." />
      <div className="row g-3 mb-4">
        <div className="col-md-4"><StatCard color="primary" icono="bi-cart3" titulo="Compras" valor={ventas.ordenesPagadas} detalle={`Ventas totales: ${formatoCLP(ventas.ventasTotales)}`} /></div>
        <div className="col-md-4"><StatCard color="success" icono="bi-box-seam" titulo="Productos" valor={productos.length} detalle={`Inventario actual: ${unidadesInventario(productos)} · ${criticos} críticos`} /></div>
        <div className="col-md-4"><StatCard color="warning" icono="bi-people" titulo="Usuarios" valor={usuarios.length} detalle={`${usuarios.filter((u) => u.tipo === 'Cliente').length} clientes registrados`} /></div>
      </div>
      <div className="row g-3 row-cols-1 row-cols-md-2 row-cols-xl-3">
        {MENU_ADMIN.filter((o) => o.roles.includes(usuario.tipo) && DESCRIPCIONES[o.ruta]).map((o) => (
          <div className="col" key={o.ruta}>
            <Link to={o.ruta} className="card h-100 text-center text-decoration-none shadow-sm kiltro-card">
              <div className="card-body"><i className={`bi ${o.icono} fs-2 text-primary`} aria-hidden="true" /><h2 className="h6 mt-2">{o.texto}</h2><p className="small text-secondary mb-0">{DESCRIPCIONES[o.ruta]}</p></div>
            </Link>
          </div>
        ))}
      </div>
    </>
  );
}
