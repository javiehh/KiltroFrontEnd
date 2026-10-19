import { useForm } from '../../hooks/useForm.js';
import { correoValido, esRequerido, largoEntre, largoMaximo } from '../../utils/validators.js';
import Button from '../common/Button.jsx';
import FormField from '../common/FormField.jsx';

const REGLAS = {
  correo: [esRequerido, (v) => largoMaximo(v, 100), correoValido],
  password: [esRequerido, (v) => largoEntre(v, 4, 10)]
};

/** Formulario de inicio de sesión. `errorGeneral` es el mensaje que devuelve el sistema (ej: credenciales incorrectas). */
export default function LoginForm({ onSubmit, errorGeneral = '' }) {
  const form = useForm({ correo: '', password: '' }, REGLAS);
  return (
    <form onSubmit={form.enviar(onSubmit)} noValidate aria-label="Inicio de sesión">
      <FormField label="Correo electrónico" type="email" autoComplete="email" hint="Solo @gmail.com." {...form.campo('correo')} />
      <FormField label="Contraseña" type="password" autoComplete="current-password" hint="Entre 4 y 10 caracteres." {...form.campo('password')} />
      {errorGeneral && <div className="alert alert-danger py-2" role="alert">{errorGeneral}</div>}
      <Button type="submit" className="w-100">Iniciar sesión</Button>
    </form>
  );
}
