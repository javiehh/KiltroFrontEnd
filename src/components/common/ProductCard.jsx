import { Link } from 'react-router-dom';
import { estaEnOferta, precioFinal } from '../../data/productos.js';
import { formatoCLP } from '../../utils/format.js';
import ProductMedia from './ProductMedia.jsx';
import AddToCartButton from './AddToCartButton.jsx';

/** Tarjeta de un producto: imagen, categoría, nombre, precio (con oferta si corresponde) y botón de agregar. */
export default function ProductCard({ producto, categoria }) {
  const oferta = estaEnOferta(producto);
  return (
    <div className="card h-100 shadow-sm kiltro-card position-relative" data-testid="product-card">
      {oferta && <span className="badge bg-danger position-absolute top-0 end-0 m-2" data-testid="badge-oferta">-{producto.descuento}%</span>}
      <Link to={`/productos/${producto.id}`} aria-label={`Ver ${producto.nombre}`}>
        <ProductMedia producto={producto} className="card-img-top" />
      </Link>
      <div className="card-body d-flex flex-column">
        {categoria && <span className="kiltro-tag mb-1">{categoria.nombre}</span>}
        <h3 className="h6 card-title">
          <Link to={`/productos/${producto.id}`} className="text-reset">{producto.nombre}</Link>
        </h3>
        <p className="card-text small text-secondary flex-grow-1">{producto.descripcion}</p>
        <div className="d-flex justify-content-between align-items-end mt-2">
          <div>
            {oferta && <div className="text-decoration-line-through text-secondary small" data-testid="precio-original">{formatoCLP(producto.precio)}</div>}
            <div className="fw-bold fs-5 kiltro-heading">{formatoCLP(precioFinal(producto))}</div>
          </div>
          <AddToCartButton producto={producto} />
        </div>
      </div>
    </div>
  );
}
