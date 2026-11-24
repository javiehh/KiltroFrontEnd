import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { cambiarEstado, obtenerBoleta } from '../../api/boletasApi.js';
import { invalidarCatalogo } from '../../api/catalogo.js';
import { mensajeDeError } from '../../api/errores.js';
import { ESTADOS_BOLETA, ETIQUETA_ESTADO } from '../../data/constantes.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { PERMISOS } from '../../permisos.js';
import { useApi } from '../../hooks/useApi.js';
import Boleta from '../../components/common/Boleta.jsx';
import Button from '../../components/common/Button.jsx';
import { Cargando } from '../../components/common/ConEstado.jsx';
import EmptyState from '../../components/common/EmptyState.jsx';
import PageHeader from '../../components/common/PageHeader.jsx';

/** Boleta de una orden. Quien tiene el permiso de gestionar órdenes (Administrador) puede cambiar su estado. */
export default function OrderDetailPage() {
  const { id } = useParams();
  const { puede } = useAuth();
  const consulta = useApi(() => obtenerBoleta(id), [id]);
  const [nuevoEstado, setNuevoEstado] = useState('');
  const [aviso, setAviso] = useState({ tipo: '', texto: '' });
  const [enviando, setEnviando] = useState(false);
  const orden = consulta.datos;

  if (consulta.cargando && !orden) return <Cargando />;
  if (!orden) return <EmptyState mensaje={consulta.error || 'No encontramos esa orden.'}><Link to="/admin/ordenes" className="btn btn-primary">Volver a órdenes</Link></EmptyState>;

  const anulada = orden.estado === ESTADOS_BOLETA.ANULADA;
  const elegido = nuevoEstado || orden.estado;

  const actualizar = async () => {
    setEnviando(true);
    setAviso({ tipo: '', texto: '' });
    try {
      await cambiarEstado(orden.id, elegido);
      if (elegido === ESTADOS_BOLETA.ANULADA) invalidarCatalogo(); // al anular, el servidor devuelve el stock
      setNuevoEstado('');
      setAviso({ tipo: 'success', texto: elegido === ESTADOS_BOLETA.ANULADA ? 'Orden anulada: el stock volvió al inventario.' : `Estado actualizado a ${ETIQUETA_ESTADO[elegido]}.` });
      consulta.recargar();
    } catch (e) {
      setAviso({ tipo: 'danger', texto: mensajeDeError(e) }); // 409 si ya estaba anulada, 503 si ms-productos no responde
    } finally {
      setEnviando(false);
    }
  };

  return (
    <>
      <PageHeader titulo={`Boleta #${orden.id}`} subtitulo={`Estado: ${ETIQUETA_ESTADO[orden.estado]}`}>
        <Button variant="outline-secondary" onClick={() => window.print()}>Imprimir</Button>
        <Link to="/admin/ordenes" className="btn btn-outline-primary">← Órdenes</Link>
      </PageHeader>
      {aviso.texto && <div className={`alert alert-${aviso.tipo}`} role="alert">{aviso.texto}</div>}
      {puede(PERMISOS.ORDENES_GESTIONAR) && (
        anulada ? (
          <p className="text-secondary">Una orden anulada no se puede modificar.</p>
        ) : (
          <div className="d-flex gap-2 align-items-center mb-3 flex-wrap" data-testid="cambio-de-estado">
            <label htmlFor="estado-orden" className="fw-semibold">Cambiar estado</label>
            <select id="estado-orden" className="form-select w-auto" value={elegido} onChange={(e) => setNuevoEstado(e.target.value)}>
              {Object.values(ESTADOS_BOLETA).map((e) => <option key={e} value={e}>{ETIQUETA_ESTADO[e]}</option>)}
            </select>
            <Button onClick={actualizar} disabled={enviando || elegido === orden.estado}>{enviando ? 'Guardando…' : 'Actualizar estado'}</Button>
          </div>
        )
      )}
      <div className="card shadow-sm"><div className="card-body"><Boleta orden={orden} /></div></div>
    </>
  );
}
