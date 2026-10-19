/** Selector de cantidad con botones − y +, limitado entre min y max. El padre controla el valor (props). */
export default function QuantitySelector({ value, onChange, min = 1, max = 99, label = 'Cantidad' }) {
  const poner = (n) => onChange(Math.min(max, Math.max(min, n)));
  return (
    <div className="input-group input-group-sm" style={{ width: 130 }} role="group" aria-label={label}>
      <button type="button" className="btn btn-outline-secondary" aria-label="Disminuir" onClick={() => poner(value - 1)} disabled={value <= min}>−</button>
      <input
        type="number"
        className="form-control text-center"
        aria-label={label}
        value={value}
        min={min}
        max={max}
        onChange={(e) => poner(Number(e.target.value) || min)}
      />
      <button type="button" className="btn btn-outline-secondary" aria-label="Aumentar" onClick={() => poner(value + 1)} disabled={value >= max}>+</button>
    </div>
  );
}
