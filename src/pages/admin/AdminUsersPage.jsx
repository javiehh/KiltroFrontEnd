import { useState } from 'react';
import { Link } from 'react-router-dom';
import { mensajeDeError } from '../../api/errores.js';
import { eliminarUsuario, listarUsuarios } from '../../api/usuariosApi.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { useApi } from '../../hooks/useApi.js';
import Button from '../../components/common/Button.jsx';
import { ConConsulta } from '../../components/common/ConEstado.jsx';
import PageHeader from '../../components/common/PageHeader.jsx';

const BADGE = { Administrador: 'text-bg-primary', Vendedor: 'text-bg-success', Cliente: 'text-bg-secondary' };

export default function AdminUsersPage() {
  const consulta = useApi(listarUsuarios);
  const { usuario: yo } = useAuth();
  const [texto, setTexto] = useState('');
  const [error, setError] = useState('');
  const t = texto.trim().toLowerCase();

  const eliminar = async (u) => {
    if (!window.confirm(`¿Eliminar a ${u.nombre} ${u.apellidos}?`)) return;
    try {
      await eliminarUsuario(u.id);
      setError('');
      consulta.recargar();
    } catch (e) {
      setError(mensajeDeError(e));
    }
  };

  return (
    <ConConsulta consulta={consulta}>
      {(usuarios) => {
        const visibles = usuarios.filter((u) => !t || `${u.run} ${u.nombre} ${u.apellidos} ${u.correo}`.toLowerCase().includes(t));
        return (
          <>
            <PageHeader titulo="Usuarios" subtitulo={`${usuarios.length} cuentas registradas`}>
              <Link to="/admin/usuarios/nuevo" className="btn btn-primary">+ Nuevo usuario</Link>
            </PageHeader>
            {error && <div className="alert alert-danger" role="alert">{error}</div>}
            <input type="search" className="form-control mb-3" placeholder="Buscar por RUN, nombre o correo" aria-label="Buscar usuario" value={texto} onChange={(e) => setTexto(e.target.value)} />
            <div className="table-responsive"><table className="table table-hover align-middle">
              <thead><tr><th>RUN</th><th>Nombre completo</th><th>Correo</th><th>Rol</th><th /></tr></thead>
              <tbody>
                {visibles.map((u) => (
                  <tr key={u.id}>
                    <td>{u.run}</td><td>{u.nombre} {u.apellidos}</td><td>{u.correo}</td><td><span className={`badge ${BADGE[u.tipo]}`}>{u.tipo}</span></td>
                    <td className="text-end text-nowrap">
                      <Link to={`/admin/usuarios/${u.id}`} className="btn btn-outline-secondary btn-sm me-1">Ver</Link>
                      <Link to={`/admin/usuarios/${u.id}/editar`} className="btn btn-outline-primary btn-sm me-1">Editar</Link>
                      <Button variant="danger" size="sm" disabled={u.id === yo.id} onClick={() => eliminar(u)} aria-label={`Eliminar ${u.nombre}`}>Eliminar</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>{visibles.length === 0 && <p className="text-secondary">No hay usuarios que coincidan.</p>}</div>
          </>
        );
      }}
    </ConConsulta>
  );
}
