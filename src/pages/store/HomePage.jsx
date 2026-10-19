import { Link } from 'react-router-dom';
import { Carousel } from 'react-bootstrap';
import { categoriasRepo, productosRepo } from '../../data/db.js';
import { productosEnOferta } from '../../data/productos.js';
import { useCollection } from '../../hooks/useCollection.js';
import ProductGrid from '../../components/common/ProductGrid.jsx';
import { ICONOS } from '../../data/iconos.js';

const FOTO_HERO = 'https://images.unsplash.com/photo-1450778869180-41d0601e046e?auto=format&fit=crop&w=1600&q=80';

export default function HomePage() {
  const productos = useCollection(productosRepo);
  const categorias = useCollection(categoriasRepo);
  const destacados = productos.slice(0, 4);
  const ofertas = productosEnOferta(productos).slice(0, 4);

  return (
    <>
      <Carousel interval={6000} className="kiltro-carousel" indicators controls>
        <Carousel.Item>
          <div className="kiltro-slide" style={{ backgroundImage: `linear-gradient(90deg, rgba(31,58,46,.95) 35%, rgba(31,58,46,.25)), url(${FOTO_HERO})` }}>
            <div className="container">
              <p className="kiltro-eyebrow">Tienda de barrio, cariño de verdad</p>
              <h1 className="kiltro-heading display-5 fw-semibold">Todo lo que tu compañero necesita, sin vueltas.</h1>
              <p className="lead col-lg-6">
                Alimento, correas, camas y juguetes para perros, gatos, aves y roedores.
                Elegido por alguien que también tiene un kiltro durmiendo en el sillón.
              </p>
              <div className="d-flex gap-2 flex-wrap">
                <Link to="/productos" className="btn btn-primary btn-lg">Ver productos</Link>
                <Link to="/contacto" className="btn btn-outline-light btn-lg">Escríbenos!</Link>
              </div>
            </div>
          </div>
        </Carousel.Item>
        <Carousel.Item>
          <div className="kiltro-slide kiltro-slide--oferta">
            <div className="container">
              <p className="kiltro-eyebrow">Por tiempo limitado</p>
              <h2 className="kiltro-heading display-5 fw-semibold">Ofertas para consentirlos</h2>
              <p className="lead col-lg-6">Descuentos en alimento, juguetes y accesorios seleccionados.</p>
              <Link to="/ofertas" className="btn btn-primary btn-lg">Ver ofertas</Link>
            </div>
          </div>
        </Carousel.Item>
        <Carousel.Item>
          <div className="kiltro-slide kiltro-slide--blog">
            <div className="container">
              <p className="kiltro-eyebrow">Blog</p>
              <h2 className="kiltro-heading display-5 fw-semibold">Datos curiosos sobre tu mascota</h2>
              <p className="lead col-lg-6">Tips y casos curiosos para la vida diaria con tu compañero.</p>
              <Link to="/blog" className="btn btn-primary btn-lg">Leer el blog</Link>
            </div>
          </div>
        </Carousel.Item>
      </Carousel>

      <section className="container py-5" aria-labelledby="titulo-categorias">
        <h2 id="titulo-categorias" className="kiltro-heading text-center mb-4">Categorías</h2>
        <div className="row g-3 row-cols-2 row-cols-md-4">
          {categorias.map((c) => (
            <div className="col" key={c.id}>
              <Link to={`/categorias/${c.id}`} className="card h-100 text-center text-decoration-none kiltro-card shadow-sm">
                <div className="kiltro-media kiltro-media--icono kiltro-media--corta card-img-top" style={{ background: c.tile }}>
                  <svg viewBox="0 0 64 64" width="48" height="48" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true"
                    dangerouslySetInnerHTML={{ __html: ICONOS[c.icono] || '' }} />
                </div>
                <div className="card-body"><h3 className="h6 mb-1">{c.nombre}</h3><p className="small text-secondary mb-0">{c.descripcion}</p></div>
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section className="container pb-5" aria-labelledby="titulo-destacados">
        <div className="d-flex justify-content-between align-items-end mb-3">
          <div><h2 id="titulo-destacados" className="kiltro-heading mb-0">Lo más pedido</h2><p className="text-secondary mb-0">Una muestra de nuestro catálogo.</p></div>
          <Link to="/productos" className="btn btn-outline-primary">Ver catálogo completo</Link>
        </div>
        <ProductGrid productos={destacados} />
      </section>

      {ofertas.length > 0 && (
        <section className="container pb-5" aria-labelledby="titulo-ofertas">
          <div className="d-flex justify-content-between align-items-end mb-3">
            <h2 id="titulo-ofertas" className="kiltro-heading mb-0">Ofertas</h2>
            <Link to="/ofertas" className="btn btn-outline-primary">Ver todas</Link>
          </div>
          <ProductGrid productos={ofertas} />
        </section>
      )}

      <section className="kiltro-about py-5">
        <div className="container col-lg-8">
          <h2 className="kiltro-heading">¿Quiénes somos?</h2>
          <p>
            Somos una tienda de productos para animales, en donde les damos un trato único y especial,
            en especial a aquellos que no son de raza. Todos nuestros productos son elegidos con mucho cariño
            y cuidado, para que tu compañero peludo tenga lo mejor. <Link to="/nosotros">Conoce más sobre nosotros →</Link>
          </p>
        </div>
      </section>
    </>
  );
}
