import { useState } from 'react';
import { Link } from 'react-router-dom';
import { categoriasRepo, productosRepo } from '../../data/db.js';
import { useCollection } from '../../hooks/useCollection.js';
import Button from '../../components/common/Button.jsx';
import PageHeader from '../../components/common/PageHeader.jsx';

export default function AdminCategoriesPage() {
  const categorias = useCollection(categoriasRepo);
  const productos = useCollection(productosRepo);
  const [mensaje, setMensaje] = useState('');

  const eliminar = (c) => {
    const cantidad = productos.filter((p) => p.categoriaId === c.id).length;
    if (cantidad > 0) { setMensaje(`No se puede eliminar "${c.nombre}": tiene ${cantidad} producto(s) asociados.`); return; }
    if (window.confirm(`¿Eliminar la categoría "${c.nombre}"?`)) { categoriasRepo.eliminar(c.id); setMensaje(''); }
  };

  return (
    <>
      <PageHeader titulo="Categorías" subtitulo="Organiza los productos para facilitar la navegación.">
        <Link to="/admin/categorias/nueva" className="btn btn-primary">+ Nueva categoría</Link>
      </PageHeader>
      {mensaje && <div className="alert alert-warning" role="alert">{mensaje}</div>}
      <div className="table-responsive"><table className="table table-hover align-middle">
        <thead><tr><th>Nombre</th><th>Descripción</th><th>Productos</th><th /></tr></thead>
        <tbody>
          {categorias.map((c) => (
            <tr key={c.id}>
              <td>{c.nombre}</td><td>{c.descripcion}</td><td>{productos.filter((p) => p.categoriaId === c.id).length}</td>
              <td className="text-end text-nowrap">
                <Link to={`/admin/categorias/${c.id}/editar`} className="btn btn-outline-primary btn-sm me-1">Editar</Link>
                <Button variant="danger" size="sm" onClick={() => eliminar(c)} aria-label={`Eliminar ${c.nombre}`}>Eliminar</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table></div>
    </>
  );
}
