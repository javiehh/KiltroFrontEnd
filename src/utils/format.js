export const formatoCLP = (valor) => '$' + Number(valor).toLocaleString('es-CL');
export const formatoFecha = (iso) =>
  new Date(iso).toLocaleDateString('es-CL', { day: '2-digit', month: '2-digit', year: 'numeric' });
