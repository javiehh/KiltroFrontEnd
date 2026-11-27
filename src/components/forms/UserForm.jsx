import { useForm } from '../../hooks/useForm.js';
import { ROLES } from '../../data/constantes.js';
import { correoValido, esRequerido, largoEntre, largoMaximo, runValido } from '../../utils/validators.js';
import Button from '../common/Button.jsx';
import FormField from '../common/FormField.jsx';
import RegionComunaFields from './RegionComunaFields.jsx';

const VACIO = { run: '', tipo: '', nombre: '', apellidos: '', correo: '', password: '', passwordConfirm: '', fechaNacimiento: '', region: '', comuna: '', direccion: '' };

export default function UserForm({ modo = 'registro', inicial, onSubmit, onCancel, errorGeneral = '', textoBoton, enviando = false }) {
  const edicion = modo === 'editar' || modo === 'perfil';
  const reglas = {
    run: [esRequerido, runValido],
    nombre: [esRequerido, (v) => largoMaximo(v, 50)],
    apellidos: [esRequerido, (v) => largoMaximo(v, 100)],
    correo: [esRequerido, (v) => largoMaximo(v, 100), correoValido],
    password: edicion
      ? [(v) => (v === '' ? { valid: true, message: '' } : largoEntre(v, 4, 10))]
      : [esRequerido, (v) => largoEntre(v, 4, 10)],
    region: [esRequerido],
    comuna: [esRequerido],
    direccion: [esRequerido, (v) => largoMaximo(v, 300)]
  };
  if (modo === 'crear' || modo === 'editar') reglas.tipo = [esRequerido];
  if (modo === 'registro') {
    reglas.passwordConfirm = [(v, todos) => ({ valid: v === todos.password, message: 'Las contraseñas no coinciden.' })];
  }

  const form = useForm({ ...VACIO, ...inicial, password: '' }, reglas);

  const enviar = (valores) => {
    const { passwordConfirm, ...datos } = valores;
    if (edicion && datos.password === '') delete datos.password;
    if (modo === 'registro') datos.tipo = ROLES.CLIENTE;
    datos.run = datos.run.trim().toUpperCase().replace(/[^0-9K]/g, '');
    onSubmit(datos);
  };

  return (
    <form onSubmit={form.enviar(enviar)} noValidate aria-label="Formulario de usuario">
      <div className="row">
        <FormField label="RUN" className="col-md-6 mb-3" maxLength={9} placeholder="190110228" hint="Sin puntos ni guion. Entre 7 y 9 caracteres."
          readOnly={edicion} {...form.campo('run')} />
        {(modo === 'crear' || modo === 'editar') ? (
          <FormField as="select" label="Tipo de usuario" className="col-md-6 mb-3" hint="Administrador: acceso total · Vendedor: productos y órdenes · Cliente: solo la tienda." {...form.campo('tipo')}>
            <option value="">-- Selecciona --</option>
            {Object.values(ROLES).map((r) => <option key={r} value={r}>{r}</option>)}
          </FormField>
        ) : <div className="col-md-6" />}
        <FormField label="Nombre" className="col-md-6 mb-3" maxLength={50} {...form.campo('nombre')} />
        <FormField label="Apellidos" className="col-md-6 mb-3" maxLength={100} {...form.campo('apellidos')} />
        <FormField label="Correo electrónico" type="email" className="col-12 mb-3" maxLength={100} hint="Solo @gmail.com." {...form.campo('correo')} />
        <FormField label={edicion ? 'Nueva contraseña (opcional)' : 'Contraseña'} type="password" className="col-md-6 mb-3"
          hint={edicion ? 'Déjala en blanco para no cambiarla.' : 'Entre 4 y 10 caracteres.'} autoComplete="new-password" {...form.campo('password')} />
        {modo === 'registro' && <FormField label="Confirmar contraseña" type="password" className="col-md-6 mb-3" autoComplete="new-password" {...form.campo('passwordConfirm')} />}
        <FormField label="Fecha de nacimiento (opcional)" type="date" className="col-md-6 mb-3" {...form.campo('fechaNacimiento')} />
        <RegionComunaFields region={form.campo('region')} comuna={form.campo('comuna')} />
        <FormField label="Dirección" className="col-12 mb-3" maxLength={300} {...form.campo('direccion')} />
      </div>
      {errorGeneral && <div className="alert alert-danger py-2" role="alert">{errorGeneral}</div>}
      <div className="d-flex gap-2">
        <Button type="submit" disabled={enviando}>{enviando ? 'Guardando…' : textoBoton || (modo === 'registro' ? 'Crear cuenta' : 'Guardar usuario')}</Button>
        {onCancel && <Button variant="outline-secondary" onClick={onCancel}>Cancelar</Button>}
      </div>
    </form>
  );
}
