import { useForm } from '../../hooks/useForm.js';
import { correoOpcional, esRequerido, largoMaximo } from '../../utils/validators.js';
import Button from '../common/Button.jsx';
import FormField from '../common/FormField.jsx';

const REGLAS = {
  nombre: [esRequerido, (v) => largoMaximo(v, 100)],
  correo: [(v) => largoMaximo(v, 100), correoOpcional],
  mensaje: [esRequerido, (v) => largoMaximo(v, 500)]
};

export default function ContactForm({ onSubmit }) {
  const form = useForm({ nombre: '', correo: '', mensaje: '' }, REGLAS);
  const enviar = (valores) => {
    onSubmit(valores);
    form.reiniciar();
  };
  return (
    <form onSubmit={form.enviar(enviar)} noValidate aria-label="Formulario de contacto">
      <FormField label="Nombre" autoComplete="name" maxLength={100} {...form.campo('nombre')} />
      <FormField label="Correo electrónico (opcional)" type="email" hint="Si lo dejas, solo @gmail.com." {...form.campo('correo')} />
      <FormField as="textarea" label="Mensaje" rows={4} hint={`${form.values.mensaje.length}/500 caracteres`} {...form.campo('mensaje')} />
      <Button type="submit" className="w-100">Enviar mensaje</Button>
    </form>
  );
}
