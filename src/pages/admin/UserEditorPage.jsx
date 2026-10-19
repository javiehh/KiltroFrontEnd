import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { usuariosRepo } from '../../data/db.js';
import { useCollection } from '../../hooks/useCollection.js';
import UserForm from '../../components/forms/UserForm.jsx';
import EmptyState from '../../components/common/EmptyState.jsx';
import PageHeader from '../../components/common/PageHeader.jsx';

/** Una sola página para "Nuevo usuario" (sin :run) y "Editar usuario" (con :run). */
export default function UserEditorPage() {
  const { run } = useParams();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const usuarios = useCollection(usuariosRepo);
  const existente = usuarios.find((u) => u.run === run);
  if (run && !existente) return <EmptyState mensaje="No encontramos ese usuario."><Link to="/admin/usuarios" className="btn btn-primary">Volver</Link></EmptyState>;

  const guardar = (datos) => {
    const correoRepetido = usuarios.some((u) => u.correo.toLowerCase() === datos.correo.toLowerCase() && u.run !== datos.run);
    if (correoRepetido) { setError('Ya existe un usuario con ese correo.'); return; }
    if (existente) usuariosRepo.actualizar(existente.run, datos);
    else {
      if (usuariosRepo.obtener(datos.run)) { setError('Ya existe un usuario con ese RUN.'); return; }
      usuariosRepo.crear(datos);
    }
    navigate('/admin/usuarios');
  };

  return (
    <>
      <PageHeader titulo={existente ? `Editar usuario: ${existente.nombre} ${existente.apellidos}` : 'Nuevo usuario'} />
      <div className="card shadow-sm" style={{ maxWidth: 760 }}><div className="card-body">
        <UserForm key={existente?.run ?? 'nuevo'} modo={existente ? 'editar' : 'crear'} inicial={existente} onSubmit={guardar} onCancel={() => navigate('/admin/usuarios')} errorGeneral={error} />
      </div></div>
    </>
  );
}
