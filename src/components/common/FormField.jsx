export default function FormField({ id, label, as = 'input', error = '', hint, children, className = 'mb-3', ...props }) {
  const claseControl = `${as === 'select' ? 'form-select' : 'form-control'}${error ? ' is-invalid' : ''}`;
  const comun = { id, 'aria-invalid': error ? 'true' : undefined, 'aria-describedby': error ? `${id}-error` : undefined };

  if (as === 'checkbox') {
    const { value, ...resto } = props;
    return (
      <div className={`form-check ${className}`}>
        <input type="checkbox" className="form-check-input" checked={Boolean(value)} {...comun} {...resto} />
        <label className="form-check-label" htmlFor={id}>{label}</label>
      </div>
    );
  }

  return (
    <div className={className}>
      <label htmlFor={id} className="form-label fw-semibold">{label}</label>
      {as === 'select' && <select className={claseControl} {...comun} {...props}>{children}</select>}
      {as === 'textarea' && <textarea className={claseControl} rows={3} {...comun} {...props} />}
      {as === 'input' && <input className={claseControl} {...comun} {...props} />}
      {hint && <div className="form-text">{hint}</div>}
      {error && (
        <div id={`${id}-error`} className="invalid-feedback d-block" role="alert">
          {error}
        </div>
      )}
    </div>
  );
}
