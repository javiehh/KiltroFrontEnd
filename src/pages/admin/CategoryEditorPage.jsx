import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { invalidarCatalogo } from '../../api/catalogo.js';
import { actualizarCategoria, crearCategoria, obtenerCategoria } from '../../api/categoriasApi.js';
import { mensajeDeError } from '../../api/errores.js';
import { useApi } from '../../hooks/useApi.js';
import CategoryForm from '../../components/forms/CategoryForm.jsx';
import { Cargando } from '../../components/common/ConEstado.jsx';
import EmptyState from '../../components/common/EmptyState.jsx';
import PageHeader from '../../components/common/PageHeader.jsx';

/** Una sola página para "Nueva categoría" y "Editar categoría". */
export default function CategoryEditorPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const consulta = useApi(() => (id ? obtenerCategoria(id) : Promise.resolve(null)), [id]);
  const [error, setError] = useState('');
  const [enviando, setEnviando] = useState(false);
  const existente = consulta.datos;

  if (consulta.cargando && !existente) return <Cargando />;
  if (id && !existente) return <EmptyState mensaje={consulta.error || 'No encontramos esa categoría.'}><Link to="/admin/categorias" className="btn btn-primary">Volver</Link></EmptyState>;

  const guardar = async (datos) => {
    setEnviando(true);
    setError('');
    try {
      // al crear, el servidor asigna el ícono y el color por defecto; al editar se conservan los que ya tenía
      if (existente) await actualizarCategoria(existente.id, { ...datos, icono: existente.icono, tile: existente.tile });
      else await crearCategoria(datos);
      invalidarCatalogo();
      navigate('/admin/categorias');
    } catch (e) {
      setError(mensajeDeError(e));
    } finally {
      setEnviando(false);
    }
  };

  return (
    <>
      <PageHeader titulo={existente ? `Editar categoría: ${existente.nombre}` : 'Nueva categoría'} />
      <div className="card shadow-sm" style={{ maxWidth: 560 }}><div className="card-body">
        <CategoryForm key={existente?.id ?? 'nueva'} inicial={existente} idActual={existente?.id ?? null} onSubmit={guardar}
          onCancel={() => navigate('/admin/categorias')} errorGeneral={error} enviando={enviando} />
      </div></div>
    </>
  );
}
