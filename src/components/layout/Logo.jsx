import { Link } from 'react-router-dom';

export const LOGO_PATH = 'M24 6c-3 0-5 2.4-5 5.6 0 1.8.9 3.3 2.2 4.3-4.6 1.6-8.7 5-11 9.6-1.6 3.2-1.6 6.6.4 8.6 2 2 5.2 1.8 8-.2 2-1.4 4.3-2.1 5.4-2.1s3.4.7 5.4 2.1c2.8 2 6 2.2 8-.2 2-2 2-5.4.4-8.6-2.3-4.6-6.4-8-11-9.6 1.3-1 2.2-2.5 2.2-4.3C29 8.4 27 6 24 6z';

export default function Logo({ to = '/', className = '' }) {
  return (
    <Link to={to} className={`kiltro-logo d-inline-flex align-items-center gap-2 text-decoration-none ${className}`}>
      <svg viewBox="0 0 48 48" width="32" height="32" aria-hidden="true"><path d={LOGO_PATH} fill="currentColor" /></svg>
      <span className="kiltro-heading fs-4 fw-semibold">Kiltro</span>
    </Link>
  );
}
