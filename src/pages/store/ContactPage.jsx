import { useState } from 'react';
import { mensajesRepo } from '../../data/db.js';
import ContactForm from '../../components/forms/ContactForm.jsx';

export default function ContactPage() {
  const [enviado, setEnviado] = useState(false);

  const guardar = ({ nombre, correo, mensaje }) => {
    mensajesRepo.crear({ nombre, correo, mensaje, fecha: new Date().toISOString() });
    setEnviado(true);
  };

  return (
    <div className="container py-5">
      <div className="row g-0 rounded overflow-hidden shadow">
        <div className="col-lg-6 kiltro-contacto p-4 p-lg-5">
          <h1 className="kiltro-heading">¡Contáctanos!</h1>
          <p>
            ¿Alguna duda, sugerencia o comentario sobre nuestros productos? ¿Hay algún producto que no tenemos y te gustaría que tuviéramos?
            No dudes en contactarnos, te responderemos a la brevedad.
          </p>
          <dl className="mb-0">
            <dt className="small text-uppercase kiltro-eyebrow">Contacto</dt><dd>Kiltro.Inc</dd>
            <dt className="small text-uppercase kiltro-eyebrow">Correo</dt><dd><a href="mailto:kiltrosInc@kiltro.cl">kiltrosInc@kiltro.cl</a></dd>
            <dt className="small text-uppercase kiltro-eyebrow">WhatsApp</dt><dd><a href="https://wa.me/56900000000">+56 9 0000 0000</a></dd>
          </dl>
        </div>
        <div className="col-lg-6 bg-white p-4 p-lg-5">
          {enviado && <div className="alert alert-success" role="status">¡Gracias! Recibimos tu mensaje y te responderemos a la brevedad.</div>}
          <ContactForm onSubmit={guardar} />
        </div>
      </div>
    </div>
  );
}
