import { Link, useNavigate, useParams } from 'react-router-dom';
import { productosRepo } from '../../data/db.js';
import { mediaDesdeFormulario, productoAFormulario } from '../../data/productos.js';
import { useCollection } from '../../hooks/useCollection.js';
import ProductForm from '../../components/forms/ProductForm.jsx';
import EmptyState from '../../components/common/EmptyState.jsx';
import PageHeader from '../../components/common/PageHeader.jsx';

/** Una sola página para "Nuevo producto" (sin :id) y "Editar producto" (con :id). */
export default function ProductEditorPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const existente = useCollection(productosRepo).find((p) => String(p.id) === id);

  if (id && !existente) return <EmptyState mensaje="No encontramos ese producto."><Link to="/admin/productos" className="btn btn-primary">Volver</Link></EmptyState>;

  const guardar = ({ imagenUrl, ...datos }) => {
    const media = mediaDesdeFormulario(imagenUrl, datos.nombre, existente?.media);
    if (existente) productosRepo.actualizar(existente.id, { ...datos, media });
    else productosRepo.crear({ ...datos, media });
    navigate('/admin/productos');
  };

  return (
    <>
      <PageHeader titulo={existente ? `Editar producto: ${existente.nombre}` : 'Nuevo producto'} />
      <div className="card shadow-sm" style={{ maxWidth: 760 }}><div className="card-body">
        <ProductForm key={existente?.id ?? 'nuevo'} inicial={existente ? productoAFormulario(existente) : undefined} idActual={existente?.id ?? null}
          onSubmit={guardar} onCancel={() => navigate('/admin/productos')} />
      </div></div>
    </>
  );
}
