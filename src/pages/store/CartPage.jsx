import { Link, useNavigate } from 'react-router-dom';
import { productosRepo } from '../../data/db.js';
import { cambiarCantidad, quitarDelCarrito, vaciarCarrito } from '../../data/carrito.js';
import { precioFinal } from '../../data/productos.js';
import { useCart } from '../../hooks/useCart.js';
import { useCollection } from '../../hooks/useCollection.js';
import { formatoCLP } from '../../utils/format.js';
import AddToCartButton from '../../components/common/AddToCartButton.jsx';
import Button from '../../components/common/Button.jsx';
import EmptyState from '../../components/common/EmptyState.jsx';
import PageHeader from '../../components/common/PageHeader.jsx';
import ProductMedia from '../../components/common/ProductMedia.jsx';
import QuantitySelector from '../../components/common/QuantitySelector.jsx';

/** Carrito de compras: a la izquierda el catálogo para seguir agregando, a la derecha el detalle del carrito. */
export default function CartPage() {
  const productos = useCollection(productosRepo);
  const { detalle, total } = useCart();
  const navigate = useNavigate();

  return (
    <div className="container py-4">
      <PageHeader titulo="Mi carrito de compras" subtitulo="El carrito se guarda en tu navegador (localStorage) y se actualiza en tiempo real." />
      <div className="row g-4">
        <div className="col-lg-5">
          <h2 className="h5 kiltro-heading">Lista de productos</h2>
          <ul className="list-group kiltro-lista-scroll">
            {productos.map((p) => (
              <li key={p.id} className="list-group-item d-flex align-items-center gap-3">
                <ProductMedia producto={p} className="kiltro-thumb" />
                <div className="flex-grow-1 small"><div className="fw-semibold">{p.nombre}</div><div className="text-secondary">{formatoCLP(precioFinal(p))} · stock {p.stock}</div></div>
                <AddToCartButton producto={p} />
              </li>
            ))}
          </ul>
        </div>

        <div className="col-lg-7">
          <h2 className="h5 kiltro-heading">Carrito de compras</h2>
          {detalle.length === 0 ? (
            <EmptyState mensaje="Tu carrito está vacío. Agrega productos desde la lista." />
          ) : (
            <>
              <div className="table-responsive">
                <table className="table align-middle" aria-label="Productos en el carrito">
                  <thead><tr><th>Imagen</th><th>Nombre</th><th>Precio</th><th>Cantidad</th><th className="text-end">Subtotal</th><th /></tr></thead>
                  <tbody>
                    {detalle.map(({ producto, cantidad, precio, subtotal }) => (
                      <tr key={producto.id} data-testid="linea-carrito">
                        <td><ProductMedia producto={producto} className="kiltro-thumb" /></td>
                        <td>{producto.nombre}</td>
                        <td>{formatoCLP(precio)}</td>
                        <td><QuantitySelector value={cantidad} min={1} max={producto.stock} onChange={(n) => cambiarCantidad(producto.id, n)} label={`Cantidad de ${producto.nombre}`} /></td>
                        <td className="text-end">{formatoCLP(subtotal)}</td>
                        <td><Button variant="danger" size="sm" onClick={() => quitarDelCarrito(producto.id)} aria-label={`Eliminar ${producto.nombre}`}>Eliminar</Button></td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot><tr><th colSpan={4} className="text-end">Total</th><th className="text-end fs-5" data-testid="total-carrito">{formatoCLP(total)}</th><th /></tr></tfoot>
                </table>
              </div>
              <div className="d-flex justify-content-end gap-2">
                <Button variant="secondary" onClick={vaciarCarrito}>Limpiar</Button>
                <Button variant="success" onClick={() => navigate('/checkout')}>Comprar ahora</Button>
              </div>
            </>
          )}
          <Link to="/productos" className="d-inline-block mt-3">← Seguir viendo productos</Link>
        </div>
      </div>
    </div>
  );
}
