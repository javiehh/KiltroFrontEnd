import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { ROLES } from '../../data/constantes.js';
import LoginForm from '../../components/forms/LoginForm.jsx';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { state } = useLocation();
  const [error, setError] = useState('');

  const ingresar = ({ correo, password }) => {
    const resultado = login(correo, password);
    if (!resultado.ok) { setError(resultado.error); return; }
    // Vuelve a donde quería ir; si no, los Clientes van a la tienda y el personal al panel.
    const destino = state?.from || (resultado.usuario.tipo === ROLES.CLIENTE ? '/' : '/admin');
    navigate(destino, { replace: true });
  };

  return (
    <div className="container py-5" style={{ maxWidth: 480 }}>
      <div className="card shadow-sm"><div className="card-body p-4">
        <h1 className="h4 kiltro-heading text-center mb-3">Iniciar sesión</h1>
        {state?.registroOk && <div className="alert alert-success py-2" role="status">¡Cuenta creada! Ya puedes iniciar sesión.</div>}
        <LoginForm onSubmit={ingresar} errorGeneral={error} />
        <p className="text-center small mt-3 mb-0">¿No tienes cuenta? <Link to="/registro">Crea una aquí</Link>.</p>
      </div></div>
    </div>
  );
}
