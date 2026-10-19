import { Link, useParams } from 'react-router-dom';
import { ordenesRepo, usuariosRepo } from '../../data/db.js';
import { ordenesDeUsuario } from '../../data/ordenes.js';
import { useCollection } from '../../hooks/useCollection.js';
import EmptyState from '../../components/common/EmptyState.jsx';
import PageHeader from '../../components/common/PageHeader.jsx';

/** "Mostrar usuario": datos de la cuenta, con acceso a editarla y a su historial de compras. */
export default function UserDetailPage() {
  const { run } = useParams();
  const usuario = useCollection(usuariosRepo).find((u) => u.run === run);
  const cantidadCompras = ordenesDeUsuario(useCollection(ordenesRepo), run).length;
  if (!usuario) return <EmptyState mensaje="No encontramos ese usuario."><Link to="/admin/usuarios" className="btn btn-primary">Volver</Link></EmptyState>;
  return (
    <>
      <PageHeader titulo={`${usuario.nombre} ${usuario.apellidos}`} subtitulo={usuario.tipo}>
        <Link to={`/admin/usuarios/${run}/editar`} className="btn btn-primary">Editar usuario</Link>
        <Link to={`/admin/usuarios/${run}/historial`} className="btn btn-outline-primary">Historial de compras ({cantidadCompras})</Link>
        <Link to="/admin/usuarios" className="btn btn-outline-secondary">← Usuarios</Link>
      </PageHeader>
      <dl className="row">
        <dt className="col-sm-3">RUN</dt><dd className="col-sm-9">{usuario.run}</dd>
        <dt className="col-sm-3">Correo</dt><dd className="col-sm-9">{usuario.correo}</dd>
        <dt className="col-sm-3">Fecha de nacimiento</dt><dd className="col-sm-9">{usuario.fechaNacimiento || '—'}</dd>
        <dt className="col-sm-3">Dirección</dt><dd className="col-sm-9">{usuario.direccion}, {usuario.comuna}, {usuario.region}</dd>
      </dl>
    </>
  );
}
