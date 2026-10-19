import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import UserForm from '../../components/forms/UserForm.jsx';

export default function RegisterPage() {
  const { registrar } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const crear = (datos) => {
    const resultado = registrar(datos);
    if (!resultado.ok) { setError(resultado.error); return; }
    navigate('/login', { state: { registroOk: true } });
  };

  return (
    <div className="container py-5" style={{ maxWidth: 760 }}>
      <div className="card shadow-sm"><div className="card-body p-4">
        <h1 className="h4 kiltro-heading mb-3">Registro de usuario</h1>
        <UserForm modo="registro" onSubmit={crear} errorGeneral={error} />
        <p className="small mt-3 mb-0">¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>.</p>
      </div></div>
    </div>
  );
}
