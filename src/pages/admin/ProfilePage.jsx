import { useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import UserForm from '../../components/forms/UserForm.jsx';
import PageHeader from '../../components/common/PageHeader.jsx';

/** Perfil: cada usuario del panel edita sus propios datos y su contraseña (no puede cambiar su RUN ni su rol). */
export default function ProfilePage() {
  const { usuario, actualizarPerfil } = useAuth();
  const [guardado, setGuardado] = useState(false);
  const [error, setError] = useState('');
  const [enviando, setEnviando] = useState(false);

  const guardar = async (datos) => {
    setEnviando(true);
    const resultado = await actualizarPerfil(datos); // el servidor valida, p. ej. que el correo no sea de otra cuenta
    setEnviando(false);
    if (!resultado.ok) { setError(resultado.error); setGuardado(false); return; }
    setError('');
    setGuardado(true);
  };

  return (
    <>
      <PageHeader titulo="Mi perfil" subtitulo={`${usuario.tipo} · RUN ${usuario.run}`} />
      {guardado && <div className="alert alert-success" role="status">Perfil actualizado correctamente.</div>}
      <div className="card shadow-sm" style={{ maxWidth: 760 }}><div className="card-body">
        <UserForm modo="perfil" inicial={usuario} onSubmit={guardar} errorGeneral={error} enviando={enviando} textoBoton="Guardar cambios" />
      </div></div>
    </>
  );
}
