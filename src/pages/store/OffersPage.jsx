import { productosRepo } from '../../data/db.js';
import { productosEnOferta } from '../../data/productos.js';
import { useCollection } from '../../hooks/useCollection.js';
import PageHeader from '../../components/common/PageHeader.jsx';
import ProductGrid from '../../components/common/ProductGrid.jsx';

export default function OffersPage() {
  const ofertas = productosEnOferta(useCollection(productosRepo));
  return (
    <>
      <PageHeader oscuro titulo="Ofertas" subtitulo="Todos los productos con descuento." />
      <div className="container"><ProductGrid productos={ofertas} mensajeVacio="Por ahora no hay ofertas activas." /></div>
    </>
  );
}
