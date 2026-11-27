import { REGIONES } from '../../data/regiones.js';
import FormField from '../common/FormField.jsx';

export default function RegionComunaFields({ region, comuna }) {
  const comunas = REGIONES.find((r) => r.nombre === region.value)?.comunas ?? [];

  const cambiarRegion = (e) => {
    region.onChange(e);
    comuna.onChange({ target: { type: 'select-one', value: '' } });
  };

  return (
    <>
      <FormField as="select" label="Región" className="col-md-6 mb-3" {...region} onChange={cambiarRegion}>
        <option value="">-- Selecciona la región --</option>
        {REGIONES.map((r) => <option key={r.nombre} value={r.nombre}>{r.nombre}</option>)}
      </FormField>
      <FormField as="select" label="Comuna" className="col-md-6 mb-3" {...comuna} disabled={!region.value}>
        <option value="">-- Selecciona la comuna --</option>
        {comunas.map((c) => <option key={c} value={c}>{c}</option>)}
      </FormField>
    </>
  );
}
