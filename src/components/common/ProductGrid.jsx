import { categoriasRepo } from '../../data/db.js';
import { useCollection } from '../../hooks/useCollection.js';
import ProductCard from './ProductCard.jsx';
import EmptyState from './EmptyState.jsx';

/** Lista de productos en una grilla responsive de Bootstrap. Dibuja una tarjeta por cada producto recibido. */
export default function ProductGrid({ productos, mensajeVacio = 'No hay productos para mostrar.' }) {
  const categorias = useCollection(categoriasRepo);
  if (productos.length === 0) return <EmptyState mensaje={mensajeVacio} />;
  return (
    <div className="row g-4 row-cols-1 row-cols-sm-2 row-cols-lg-3 row-cols-xl-4">
      {productos.map((p) => (
        <div className="col" key={p.id}>
          <ProductCard producto={p} categoria={categorias.find((c) => c.id === p.categoriaId)} />
        </div>
      ))}
    </div>
  );
}
