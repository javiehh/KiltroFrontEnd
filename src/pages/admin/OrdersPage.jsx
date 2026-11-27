import { useState } from 'react';
import { listarBoletas } from '../../api/boletasApi.js';
import { ESTADOS_BOLETA, ETIQUETA_ESTADO } from '../../data/constantes.js';
import { useApi } from '../../hooks/useApi.js';
import { ConConsulta } from '../../components/common/ConEstado.jsx';
import OrdersTable from '../../components/common/OrdersTable.jsx';
import PageHeader from '../../components/common/PageHeader.jsx';

export default function OrdersPage() {
  const consulta = useApi(listarBoletas);
  const [estado, setEstado] = useState('');
  return (
    <ConConsulta consulta={consulta}>
      {(ordenes) => {
        const visibles = [...ordenes].filter((o) => !estado || o.estado === estado).sort((a, b) => b.fecha.localeCompare(a.fecha));
        return (
          <>
            <PageHeader titulo="Órdenes y boletas" subtitulo={`${ordenes.length} órdenes registradas`}>
              <select className="form-select" aria-label="Filtrar por estado" value={estado} onChange={(e) => setEstado(e.target.value)}>
                <option value="">Todos los estados</option>
                {Object.values(ESTADOS_BOLETA).map((e) => <option key={e} value={e}>{ETIQUETA_ESTADO[e]}</option>)}
              </select>
            </PageHeader>
            <OrdersTable ordenes={visibles} />
          </>
        );
      }}
    </ConConsulta>
  );
}
