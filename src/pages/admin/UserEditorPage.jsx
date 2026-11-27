import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { mensajeDeError } from '../../api/errores.js';
import { actualizarUsuario, crearUsuario, obtenerUsuario } from '../../api/usuariosApi.js';
import { useApi } from '../../hooks/useApi.js';
import UserForm from '../../components/forms/UserForm.jsx';
import { Cargando } from '../../components/common/ConEstado.jsx';
import EmptyState from '../../components/common/EmptyState.jsx';
import PageHeader from '../../components/common/PageHeader.jsx';

export default function UserEditorPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const consulta = useApi(() => (id ? obtenerUsuario(id) : Promise.resolve(null)), [id]);
  const [error, setError] = useState('');
  const [enviando, setEnviando] = useState(false);
  const existente = consulta.datos;

  if (consulta.cargando && !existente) return <Cargando />;
  if (id && !existente) return <EmptyState mensaje={consulta.error || 'No encontramos ese usuario.'}><Link to="/admin/usuarios" className="btn btn-primary">Volver</Link></EmptyState>;

  const guardar = async (datos) => {
    setEnviando(true);
    setError('');
    try {
      if (existente) await actualizarUsuario(existente.id, datos);
      else await crearUsuario(datos);
      navigate('/admin/usuarios');
    } catch (e) {
      setError(mensajeDeError(e));
    } finally {
      setEnviando(false);
    }
  };

  return (
    <>
      <PageHeader titulo={existente ? `Editar usuario: ${existente.nombre} ${existente.apellidos}` : 'Nuevo usuario'} />
      <div className="card shadow-sm" style={{ maxWidth: 760 }}><div className="card-body">
        <UserForm key={existente?.id ?? 'nuevo'} modo={existente ? 'editar' : 'crear'} inicial={existente ?? undefined} onSubmit={guardar}
          onCancel={() => navigate('/admin/usuarios')} errorGeneral={error} enviando={enviando} />
      </div></div>
    </>
  );
}
