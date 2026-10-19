import PageHeader from '../../components/common/PageHeader.jsx';

export default function AboutPage() {
  return (
    <>
      <PageHeader oscuro titulo="Nosotros" subtitulo="La historia detrás de Kiltro y quién arma cada pedido." />
      <div className="container col-lg-8 pb-4">
        <h2 className="kiltro-heading h4">Cómo partió esto</h2>
        <p>
          Kiltro nació en 2026 porque teníamos un grave problema: encontrar buenos productos para
          un perro mestizo sin pedigrí era más caro y menos surtido que para una raza "de raza".
          Empezamos vendiendo alimento a vecinos del barrio y hoy despachamos a varias comunas de Chile.
        </p>
        <h2 className="kiltro-heading h4 mt-4">El equipo</h2>
        <p>Javier es quien elige cada producto, responde los mensajes de contacto y empaqueta los pedidos. A su servicio.</p>
        <h2 className="kiltro-heading h4 mt-4">Nuestros valores</h2>
        <ul>
          <li>Productos que compraríamos para nuestra propia mascota.</li>
          <li>Precios fijos y con descuentos.</li>
          <li>Contacto directo con el dueño.</li>
        </ul>
      </div>
    </>
  );
}
