import { useCatalogo } from '../../hooks/useCatalogo.js';
import { useForm } from '../../hooks/useForm.js';
import { esRequerido, largoMaximo } from '../../utils/validators.js';
import Button from '../common/Button.jsx';
import FormField from '../common/FormField.jsx';

export default function CategoryForm({ inicial, idActual = null, onSubmit, onCancel, errorGeneral = '', enviando = false }) {
  const { categorias } = useCatalogo();
  const reglas = {
    nombre: [
      esRequerido,
      (v) => largoMaximo(v, 50),
      (v) => {
        const repetida = categorias.some((c) => c.nombre.toLowerCase() === v.trim().toLowerCase() && c.id !== idActual);
        return { valid: !repetida, message: 'Ya existe una categoría con ese nombre.' };
      }
    ],
    descripcion: [esRequerido, (v) => largoMaximo(v, 200)]
  };
  const form = useForm({ nombre: '', descripcion: '', ...inicial }, reglas);
  return (
    <form onSubmit={form.enviar((v) => onSubmit({ nombre: v.nombre.trim(), descripcion: v.descripcion.trim() }))} noValidate aria-label="Formulario de categoría">
      <FormField label="Nombre" maxLength={50} {...form.campo('nombre')} />
      <FormField as="textarea" label="Descripción" maxLength={200} {...form.campo('descripcion')} />
      {errorGeneral && <div className="alert alert-danger" role="alert">{errorGeneral}</div>}
      <div className="d-flex gap-2">
        <Button type="submit" disabled={enviando}>{enviando ? 'Guardando…' : 'Guardar categoría'}</Button>
        <Button variant="outline-secondary" onClick={onCancel}>Cancelar</Button>
      </div>
    </form>
  );
}
