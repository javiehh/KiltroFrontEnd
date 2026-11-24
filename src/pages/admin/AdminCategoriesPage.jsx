import { useState } from 'react';
import { Link } from 'react-router-dom';
import { invalidarCatalogo } from '../../api/catalogo.js';
import { eliminarCategoria, listarCategorias } from '../../api/categoriasApi.js';
import { mensajeDeError } from '../../api/errores.js';
import { useApi } from '../../hooks/useApi.js';
import Button from '../../components/common/Button.jsx';
import { ConConsulta } from '../../components/common/ConEstado.jsx';
import PageHeader from '../../components/common/PageHeader.jsx';

export default function AdminCategoriesPage() {
  const consulta = useApi(listarCategorias); // cada categoría trae su cantidadProductos
  const [mensaje, setMensaje] = useState('');

  const eliminar = async (c) => {
    if (c.cantidadProductos > 0) { setMensaje(`No se puede eliminar "${c.nombre}": tiene ${c.cantidadProductos} producto(s) asociados.`); return; }
    if (!window.confirm(`¿Eliminar la categoría "${c.nombre}"?`)) return;
    try {
      await eliminarCategoria(c.id);
      setMensaje('');
      invalidarCatalogo();
      consulta.recargar();
    } catch (e) {
      setMensaje(mensajeDeError(e)); // el servidor también lo impide (409) aunque la pantalla estuviera desactualizada
    }
  };

  return (
    <>
      <PageHeader titulo="Categorías" subtitulo="Organiza los productos para facilitar la navegación.">
        <Link to="/admin/categorias/nueva" className="btn btn-primary">+ Nueva categoría</Link>
      </PageHeader>
      {mensaje && <div className="alert alert-warning" role="alert">{mensaje}</div>}
      <ConConsulta consulta={consulta}>
        {(categorias) => (
          <div className="table-responsive"><table className="table table-hover align-middle">
            <thead><tr><th>Nombre</th><th>Descripción</th><th>Productos</th><th /></tr></thead>
            <tbody>
              {categorias.map((c) => (
                <tr key={c.id}>
                  <td>{c.nombre}</td><td>{c.descripcion}</td><td>{c.cantidadProductos}</td>
                  <td className="text-end text-nowrap">
                    <Link to={`/admin/categorias/${c.id}/editar`} className="btn btn-outline-primary btn-sm me-1">Editar</Link>
                    <Button variant="danger" size="sm" onClick={() => eliminar(c)} aria-label={`Eliminar ${c.nombre}`}>Eliminar</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table></div>
        )}
      </ConConsulta>
    </>
  );
}
