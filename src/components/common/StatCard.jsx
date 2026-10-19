/** Tarjeta de cifra para el dashboard (ej: "Productos — 12"). `color` es una clase de fondo de Bootstrap. */
export default function StatCard({ titulo, valor, detalle, icono, color = 'primary' }) {
  return (
    <div className={`card text-white bg-${color} h-100 border-0 shadow-sm`} data-testid="stat-card">
      <div className="card-body d-flex align-items-center gap-3">
        {icono && <i className={`bi ${icono} fs-1`} aria-hidden="true" />}
        <div>
          <div className="small text-uppercase opacity-75">{titulo}</div>
          <div className="fs-2 fw-bold lh-1">{valor}</div>
          {detalle && <div className="small mt-1 opacity-75">{detalle}</div>}
        </div>
      </div>
    </div>
  );
}
