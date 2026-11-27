import { listarOfertas } from '../../api/productosApi.js';
import { useApi } from '../../hooks/useApi.js';
import { useCatalogo } from '../../hooks/useCatalogo.js';
import ConEstado from '../../components/common/ConEstado.jsx';
import PageHeader from '../../components/common/PageHeader.jsx';
import ProductGrid from '../../components/common/ProductGrid.jsx';

export default function OffersPage() {
  const ofertas = useApi(listarOfertas);
  const { categorias } = useCatalogo();
  return (
    <>
      <PageHeader oscuro titulo="Ofertas" subtitulo="Todos los productos con descuento." />
      <div className="container">
        <ConEstado listo={ofertas.datos !== null} cargando={ofertas.cargando} error={ofertas.error} onReintentar={ofertas.recargar}>
          {() => <ProductGrid productos={ofertas.datos} categorias={categorias} mensajeVacio="Por ahora no hay ofertas activas." />}
        </ConEstado>
      </div>
    </>
  );
}
