import { Link, useParams } from 'react-router-dom';
import { BLOG } from '../../data/blog.js';
import EmptyState from '../../components/common/EmptyState.jsx';

export default function BlogDetailPage() {
  const { id } = useParams();
  const articulo = BLOG.find((a) => String(a.id) === id);
  if (!articulo) {
    return <div className="container py-5"><EmptyState mensaje="No encontramos ese artículo."><Link to="/blog" className="btn btn-primary">Volver al blog</Link></EmptyState></div>;
  }
  return (
    <article className="container col-lg-8 py-4">
      <p><Link to="/blog">← Volver al blog</Link></p>
      <img src={articulo.foto} alt={articulo.alt} className="img-fluid rounded mb-4 w-100" />
      <h1 className="kiltro-heading h2">{articulo.titulo}</h1>
      {articulo.cuerpo.map((parrafo, i) => <p key={i}>{parrafo}</p>)}
    </article>
  );
}
