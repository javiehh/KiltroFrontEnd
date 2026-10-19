import { useState } from 'react';
import { Link } from 'react-router-dom';
import { usuariosRepo } from '../../data/db.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { useCollection } from '../../hooks/useCollection.js';
import Button from '../../components/common/Button.jsx';
import PageHeader from '../../components/common/PageHeader.jsx';

const BADGE = { Administrador: 'text-bg-primary', Vendedor: 'text-bg-success', Cliente: 'text-bg-secondary' };

export default function AdminUsersPage() {
  const usuarios = useCollection(usuariosRepo);
  const { usuario: yo } = useAuth();
  const [texto, setTexto] = useState('');
  const t = texto.trim().toLowerCase();
  const visibles = usuarios.filter((u) => !t || `${u.run} ${u.nombre} ${u.apellidos} ${u.correo}`.toLowerCase().includes(t));

  const eliminar = (u) => {
    if (window.confirm(`¿Eliminar a ${u.nombre} ${u.apellidos}?`)) usuariosRepo.eliminar(u.run);
  };

  return (
    <>
      <PageHeader titulo="Usuarios" subtitulo={`${usuarios.length} cuentas registradas`}>
        <Link to="/admin/usuarios/nuevo" className="btn btn-primary">+ Nuevo usuario</Link>
      </PageHeader>
      <input type="search" className="form-control mb-3" placeholder="Buscar por RUN, nombre o correo" aria-label="Buscar usuario" value={texto} onChange={(e) => setTexto(e.target.value)} />
      <div className="table-responsive"><table className="table table-hover align-middle">
        <thead><tr><th>RUN</th><th>Nombre completo</th><th>Correo</th><th>Rol</th><th /></tr></thead>
        <tbody>
          {visibles.map((u) => (
            <tr key={u.run}>
              <td>{u.run}</td><td>{u.nombre} {u.apellidos}</td><td>{u.correo}</td><td><span className={`badge ${BADGE[u.tipo]}`}>{u.tipo}</span></td>
              <td className="text-end text-nowrap">
                <Link to={`/admin/usuarios/${u.run}`} className="btn btn-outline-secondary btn-sm me-1">Ver</Link>
                <Link to={`/admin/usuarios/${u.run}/editar`} className="btn btn-outline-primary btn-sm me-1">Editar</Link>
                <Button variant="danger" size="sm" disabled={u.run === yo.run} onClick={() => eliminar(u)} aria-label={`Eliminar ${u.nombre}`}>Eliminar</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>{visibles.length === 0 && <p className="text-secondary">No hay usuarios que coincidan.</p>}</div>
    </>
  );
}
