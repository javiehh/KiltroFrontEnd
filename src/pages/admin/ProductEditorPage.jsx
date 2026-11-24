import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { invalidarCatalogo } from '../../api/catalogo.js';
import { mensajeDeError } from '../../api/errores.js';
import { actualizarProducto, crearProducto, obtenerProducto } from '../../api/productosApi.js';
import { productoAFormulario } from '../../data/productos.js';
import { useApi } from '../../hooks/useApi.js';
import ProductForm from '../../components/forms/ProductForm.jsx';
import { Cargando } from '../../components/common/ConEstado.jsx';
import EmptyState from '../../components/common/EmptyState.jsx';
import PageHeader from '../../components/common/PageHeader.jsx';

/** Una sola página para "Nuevo producto" (sin :id) y "Editar producto" (con :id). */
export default function ProductEditorPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const consulta = useApi(() => (id ? obtenerProducto(id) : Promise.resolve(null)), [id]);
  const [error, setError] = useState('');
  const [enviando, setEnviando] = useState(false);
  const existente = consulta.datos;

  if (consulta.cargando && !existente) return <Cargando />;
  if (id && !existente) return <EmptyState mensaje={consulta.error || 'No encontramos ese producto.'}><Link to="/admin/productos" className="btn btn-primary">Volver</Link></EmptyState>;

  const guardar = async (datos) => {
    setEnviando(true);
    setError('');
    try {
      if (existente) await actualizarProducto(existente.id, datos);
      else await crearProducto(datos);
      invalidarCatalogo();
      navigate('/admin/productos');
    } catch (e) {
      setError(mensajeDeError(e)); // por ejemplo: 409 si el código ya existe
    } finally {
      setEnviando(false);
    }
  };

  return (
    <>
      <PageHeader titulo={existente ? `Editar producto: ${existente.nombre}` : 'Nuevo producto'} />
      <div className="card shadow-sm" style={{ maxWidth: 760 }}><div className="card-body">
        <ProductForm key={existente?.id ?? 'nuevo'} inicial={existente ? productoAFormulario(existente) : undefined} idActual={existente?.id ?? null}
          onSubmit={guardar} onCancel={() => navigate('/admin/productos')} errorGeneral={error} enviando={enviando} />
      </div></div>
    </>
  );
}
