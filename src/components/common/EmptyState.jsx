export default function EmptyState({ mensaje, children }) {
  return (
    <div className="text-center text-secondary py-5" data-testid="empty-state">
      <p className="mb-3">{mensaje}</p>
      {children}
    </div>
  );
}
