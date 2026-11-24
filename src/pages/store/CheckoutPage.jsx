import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { comprar } from '../../api/boletasApi.js';
import { invalidarCatalogo } from '../../api/catalogo.js';
import { mensajeDeError } from '../../api/errores.js';
import { vaciarCarrito } from '../../data/carrito.js';
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

/** Si hay sesión, los datos del usuario se completan solos. */
const valoresIniciales = (usuario) => ({
  nombre: usuario?.nombre ?? '', apellidos: usuario?.apellidos ?? '', correo: usuario?.correo ?? '',
  calle: usuario?.direccion ?? '', departamento: '', region: usuario?.region ?? '', comuna: usuario?.comuna ?? '', indicaciones: ''
});

export default function CheckoutPage() {
  const { detalle, total } = useCart();
  const { usuario } = useAuth();
  const navigate = useNavigate();
  const [problemas, setProblemas] = useState([]);
  const [enviando, setEnviando] = useState(false);
  const form = useForm(valoresIniciales(usuario), REGLAS);

  if (detalle.length === 0) {
    return <div className="container py-5"><EmptyState mensaje="No hay productos en tu carrito para pagar."><Link to="/productos" className="btn btn-primary">Ver productos</Link></EmptyState></div>;
  }

  const pagar = async (v) => {
    // revisión rápida para avisar antes de enviar; el servidor vuelve a comprobar el stock y es quien decide
    const sinStock = detalle
      .filter(({ producto, cantidad }) => cantidad > producto.stock)
      .map(({ producto }) => `No hay stock suficiente de "${producto.nombre}" (quedan ${producto.stock}).`);
    if (sinStock.length) { setProblemas(sinStock); return; }

    setProblemas([]);
    setEnviando(true);
    try {
      // solo viajan los datos del cliente y productoId + cantidad: el precio y el total los calcula el backend
      const orden = await comprar({
        cliente: { nombre: v.nombre.trim(), apellidos: v.apellidos.trim(), correo: v.correo.trim() },
        direccion: { calle: v.calle.trim(), departamento: v.departamento.trim(), region: v.region, comuna: v.comuna, indicaciones: v.indicaciones.trim() },
        lineas: detalle
      });
      vaciarCarrito();
      invalidarCatalogo(); // el stock cambió
      navigate(`/compra/exitosa/${orden.id}`, { state: { orden } });
    } catch (error) {
      const status = error.response?.status;
      if (!error.response || status === 409 || status === 503) {
        // sin stock (409), servicio caído (503) o sin conexión: vista de compra fallida; el carrito se conserva
        invalidarCatalogo();
        navigate('/compra/error', { state: { motivo: mensajeDeError(error) } });
      } else {
        setProblemas([mensajeDeError(error)]);
      }
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="container py-4" style={{ maxWidth: 860 }}>
      <PageHeader titulo="Checkout" subtitulo="Completa tus datos y la dirección de entrega." >
        <span className="badge text-bg-primary fs-6">Total a pagar: {formatoCLP(total)}</span>
      </PageHeader>
      {usuario
        ? <div className="alert alert-info py-2">Ya iniciaste sesión: completamos tus datos automáticamente.</div>
        : <div className="alert alert-secondary py-2">Estás comprando sin iniciar sesión: la compra se registra, pero no quedará en tu historial. <Link to="/login">Inicia sesión</Link> para verla después.</div>}

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

        {problemas.length > 0 && <div className="alert alert-danger" role="alert">{problemas.map((p) => <div key={p}>{p}</div>)}</div>}
        <div className="text-end"><Button type="submit" variant="success" size="lg" disabled={enviando}>{enviando ? 'Procesando…' : `Pagar ahora ${formatoCLP(total)}`}</Button></div>
      </form>
    </div>
  );
}
