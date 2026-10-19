import { Link } from 'react-router-dom';
import { BLOG } from '../../data/blog.js';
import PageHeader from '../../components/common/PageHeader.jsx';

export default function BlogPage() {
  return (
    <>
      <PageHeader oscuro titulo="Noticias importantes" subtitulo="En esta página se irán mostrando noticias relacionadas con nuestras mascotas, incluidas próximas noticias relacionadas con nosotros." />
      <div className="container">
        <div className="row g-4">
          {BLOG.map((articulo) => (
            <div className="col-md-6" key={articulo.id}>
              <article className="card h-100 shadow-sm kiltro-card">
                <img src={articulo.foto} alt={articulo.alt} className="card-img-top kiltro-media" loading="lazy" />
                <div className="card-body d-flex flex-column">
                  <h2 className="h5 card-title">Caso curioso #{articulo.id}: {articulo.titulo}</h2>
                  <p className="card-text text-secondary flex-grow-1">{articulo.resumen}</p>
                  <Link to={`/blog/${articulo.id}`} className="btn btn-outline-primary btn-sm align-self-start">Ver caso</Link>
                </div>
              </article>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
