import { Link, useNavigate, useParams } from 'react-router-dom';
import { categoriasRepo } from '../../data/db.js';
import { useCollection } from '../../hooks/useCollection.js';
import CategoryForm from '../../components/forms/CategoryForm.jsx';
import EmptyState from '../../components/common/EmptyState.jsx';
import PageHeader from '../../components/common/PageHeader.jsx';

/** Una sola página para "Nueva categoría" y "Editar categoría". */
export default function CategoryEditorPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const existente = useCollection(categoriasRepo).find((c) => String(c.id) === id);
  if (id && !existente) return <EmptyState mensaje="No encontramos esa categoría."><Link to="/admin/categorias" className="btn btn-primary">Volver</Link></EmptyState>;

  const guardar = (datos) => {
    if (existente) categoriasRepo.actualizar(existente.id, datos);
    else categoriasRepo.crear({ ...datos, icono: 'huellas', tile: '#1F3A2E' });
    navigate('/admin/categorias');
  };
  return (
    <>
      <PageHeader titulo={existente ? `Editar categoría: ${existente.nombre}` : 'Nueva categoría'} />
      <div className="card shadow-sm" style={{ maxWidth: 560 }}><div className="card-body">
        <CategoryForm inicial={existente} idActual={existente?.id ?? null} onSubmit={guardar} onCancel={() => navigate('/admin/categorias')} />
      </div></div>
    </>
  );
}
