import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { PERMISOS, puede } from '../../permisos.js';
import LoginForm from '../../components/forms/LoginForm.jsx';

export default function LoginPage() {
  const { login, sesionExpirada } = useAuth();
  const navigate = useNavigate();
  const { state } = useLocation();
  const [error, setError] = useState('');
  const [enviando, setEnviando] = useState(false);

  const ingresar = async ({ correo, password }) => {
    setEnviando(true);
    const resultado = await login(correo, password);
    setEnviando(false);
    if (!resultado.ok) { setError(resultado.error); return; }
    // quien puede usar el panel (Administrador y Vendedor) entra directo a él; el Cliente vuelve a la tienda
    const destino = state?.from || (puede(resultado.usuario, PERMISOS.PANEL) ? '/admin' : '/');
    navigate(destino, { replace: true });
  };

  return (
    <div className="container py-5" style={{ maxWidth: 480 }}>
      <div className="card shadow-sm"><div className="card-body p-4">
        <h1 className="h4 kiltro-heading text-center mb-3">Iniciar sesión</h1>
        {state?.registroOk && <div className="alert alert-success py-2" role="status">¡Cuenta creada! Ya puedes iniciar sesión.</div>}
        {sesionExpirada && <div className="alert alert-warning py-2" role="status">Tu sesión expiró. Vuelve a iniciar sesión.</div>}
        <LoginForm onSubmit={ingresar} errorGeneral={error} enviando={enviando} />
        <p className="text-center small mt-3 mb-0">¿No tienes cuenta? <Link to="/registro">Crea una aquí</Link>.</p>
      </div></div>
    </div>
  );
}
