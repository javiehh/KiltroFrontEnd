export default function Button({ label, children, onClick, variant = 'primary', size, type = 'button', disabled = false, className = '', ...resto }) {
  const clases = ['btn', `btn-${variant}`, size ? `btn-${size}` : '', className].filter(Boolean).join(' ');
  return (
    <button type={type} className={clases} onClick={onClick} disabled={disabled} {...resto}>
      {label ?? children}
    </button>
  );
}
