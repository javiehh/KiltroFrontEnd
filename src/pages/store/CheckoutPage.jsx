import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ordenesRepo } from '../../data/db.js';
import { vaciarCarrito } from '../../data/carrito.js';
import { crearOrden, procesarPago, reintentarOrden, validarStock } from '../../data/ordenes.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { useCart } from '../../hooks/useCart.js';
import { useForm } from '../../hooks/useForm.js';
import { correoValido, esRequerido, largoMaximo } from '../../utils/validators.js';
import { formatoCLP } from '../../utils/format.js';
import Button from '../../components/common/Button.jsx';
import EmptyState from '../../components/common/EmptyState.jsx';
import FormField from '../../components/common/FormField.jsx';
import PageHeader from '../../components/common/PageHeader.jsx';
import ProductMedia from '../../components/common/ProductMedia.jsx';
import RegionComunaFields from '../../components/forms/RegionComunaFields.jsx';

const REGLAS = {
  nombre: [esRequerido, (v) => largoMaximo(v, 50)],
  apellidos: [esRequerido, (v) => largoMaximo(v, 100)],
  correo: [esRequerido, (v) => largoMaximo(v, 100), correoValido],
  calle: [esRequerido, (v) => largoMaximo(v, 300)],
  departamento: [(v) => largoMaximo(v, 20)],
  region: [esRequerido],
  comuna: [esRequerido],
  indicaciones: [(v) => largoMaximo(v, 300)]
};

/** Valores iniciales: si es un reintento, los datos de la orden; si hay sesión, los datos del usuario (se completan solos). */
function valoresIniciales(usuario, ordenPrevia) {
  if (ordenPrevia) {
    const { cliente, direccion } = ordenPrevia;
    return { ...cliente, calle: direccion.calle, departamento: direccion.departamento || '', region: direccion.region, comuna: direccion.comuna, indicaciones: direccion.indicaciones || '', simulacion: 'aprobado' };
  }
  return {
    nombre: usuario?.nombre ?? '', apellidos: usuario?.apellidos ?? '', correo: usuario?.correo ?? '',
    calle: usuario?.direccion ?? '', departamento: '', region: usuario?.region ?? '', comuna: usuario?.comuna ?? '', indicaciones: '',
    simulacion: 'aprobado'
  };
}

export default function CheckoutPage() {
  const { detalle, total } = useCart();
  const { usuario } = useAuth();
  const navigate = useNavigate();
  const { state } = useLocation();
  const ordenPrevia = state?.reintento ? ordenesRepo.obtener(state.reintento) : null;
  const [problemas, setProblemas] = useState([]);
  const form = useForm(valoresIniciales(usuario, ordenPrevia), REGLAS);

  if (detalle.length === 0) {
    return <div className="container py-5"><EmptyState mensaje="No hay productos en tu carrito para pagar."><Link to="/productos" className="btn btn-primary">Ver productos</Link></EmptyState></div>;
  }

  const pagar = (v) => {
    const sinStock = validarStock(detalle);
    if (sinStock.length) { setProblemas(sinStock); return; }
    const datos = {
      cliente: { nombre: v.nombre.trim(), apellidos: v.apellidos.trim(), correo: v.correo.trim() },
      direccion: { calle: v.calle.trim(), departamento: v.departamento.trim(), region: v.region, comuna: v.comuna, indicaciones: v.indicaciones.trim() },
      lineas: detalle
    };
    const orden = ordenPrevia ? reintentarOrden(ordenPrevia.numero, datos) : crearOrden({ ...datos, usuarioRun: usuario?.run ?? null });
    const resultado = procesarPago(orden.numero, v.simulacion === 'aprobado');
    if (resultado.estado === 'pagada') {
      vaciarCarrito();
      navigate(`/compra/exitosa/${orden.numero}`);
    } else {
      navigate(`/compra/error/${orden.numero}`);
    }
  };

  return (
    <div className="container py-4" style={{ maxWidth: 860 }}>
      <PageHeader titulo="Checkout" subtitulo="Completa tus datos y la dirección de entrega." >
        <span className="badge text-bg-primary fs-6">Total a pagar: {formatoCLP(total)}</span>
      </PageHeader>
      {usuario && <div className="alert alert-info py-2">Ya iniciaste sesión: completamos tus datos automáticamente.</div>}

      <div className="table-responsive mb-4">
        <table className="table table-sm align-middle" aria-label="Resumen de la compra">
          <thead><tr><th>Imagen</th><th>Nombre</th><th>Precio</th><th>Cantidad</th><th className="text-end">Subtotal</th></tr></thead>
          <tbody>
            {detalle.map(({ producto, cantidad, precio, subtotal }) => (
              <tr key={producto.id}><td><ProductMedia producto={producto} className="kiltro-thumb" /></td><td>{producto.nombre}</td><td>{formatoCLP(precio)}</td><td>{cantidad}</td><td className="text-end">{formatoCLP(subtotal)}</td></tr>
            ))}
          </tbody>
        </table>
      </div>

      <form onSubmit={form.enviar(pagar)} noValidate aria-label="Datos de compra">
        <h2 className="h5 kiltro-heading">Información del cliente</h2>
        <div className="row">
          <FormField label="Nombre" className="col-md-6 mb-3" {...form.campo('nombre')} />
          <FormField label="Apellidos" className="col-md-6 mb-3" {...form.campo('apellidos')} />
          <FormField label="Correo" type="email" className="col-12 mb-3" hint="Solo @gmail.com." {...form.campo('correo')} />
        </div>
        <h2 className="h5 kiltro-heading">Dirección de entrega de los productos</h2>
        <div className="row">
          <FormField label="Calle" className="col-md-8 mb-3" {...form.campo('calle')} />
          <FormField label="Departamento (opcional)" className="col-md-4 mb-3" placeholder="Ej: 603" {...form.campo('departamento')} />
          <RegionComunaFields region={form.campo('region')} comuna={form.campo('comuna')} />
          <FormField as="textarea" label="Indicaciones para la entrega (opcional)" className="col-12 mb-3" placeholder="Ej: Entre calles, color del edificio, no tiene timbre." {...form.campo('indicaciones')} />
        </div>

        <div className="border rounded p-3 mb-3 bg-body-tertiary">
          <FormField as="select" label="Simulación de la pasarela de pago (solo demostración)" className="mb-0" hint="Como no hay una pasarela real, aquí eliges si el pago se aprueba o se rechaza." {...form.campo('simulacion')}>
            <option value="aprobado">Pago aprobado</option>
            <option value="rechazado">Pago rechazado</option>
          </FormField>
        </div>

        {problemas.length > 0 && <div className="alert alert-danger" role="alert">{problemas.map((p) => <div key={p}>{p}</div>)}</div>}
        <div className="text-end"><Button type="submit" variant="success" size="lg">Pagar ahora {formatoCLP(total)}</Button></div>
      </form>
    </div>
  );
}
