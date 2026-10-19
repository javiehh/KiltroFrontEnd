import { useState } from 'react';
import { usuariosRepo } from '../../data/db.js';
import { useAuth } from '../../context/AuthContext.jsx';
import UserForm from '../../components/forms/UserForm.jsx';
import PageHeader from '../../components/common/PageHeader.jsx';

/** Perfil: cada usuario del panel edita sus propios datos y su contraseña (no puede cambiar su RUN ni su rol). */
export default function ProfilePage() {
  const { usuario } = useAuth();
  const [guardado, setGuardado] = useState(false);
  const [error, setError] = useState('');

  const guardar = (datos) => {
    const repetido = usuariosRepo.listar().some((u) => u.correo.toLowerCase() === datos.correo.toLowerCase() && u.run !== usuario.run);
    if (repetido) { setError('Ya existe otra cuenta con ese correo.'); setGuardado(false); return; }
    const { tipo, run, ...cambios } = datos;
    usuariosRepo.actualizar(usuario.run, cambios);
    setError('');
    setGuardado(true);
  };

  return (
    <>
      <PageHeader titulo="Mi perfil" subtitulo={`${usuario.tipo} · RUN ${usuario.run}`} />
      {guardado && <div className="alert alert-success" role="status">Perfil actualizado correctamente.</div>}
      <div className="card shadow-sm" style={{ maxWidth: 760 }}><div className="card-body">
        <UserForm modo="perfil" inicial={usuario} onSubmit={guardar} errorGeneral={error} textoBoton="Guardar cambios" />
      </div></div>
    </>
  );
}
