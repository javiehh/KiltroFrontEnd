import { categoriasRepo } from '../../data/db.js';
import { useForm } from '../../hooks/useForm.js';
import { esRequerido, largoMaximo } from '../../utils/validators.js';
import Button from '../common/Button.jsx';
import FormField from '../common/FormField.jsx';

export default function CategoryForm({ inicial, idActual = null, onSubmit, onCancel }) {
  const reglas = {
    nombre: [
      esRequerido,
      (v) => largoMaximo(v, 50),
      (v) => {
        const repetida = categoriasRepo.listar().some((c) => c.nombre.toLowerCase() === v.trim().toLowerCase() && c.id !== idActual);
        return { valid: !repetida, message: 'Ya existe una categoría con ese nombre.' };
      }
    ],
    descripcion: [(v) => largoMaximo(v, 200)]
  };
  const form = useForm({ nombre: '', descripcion: '', ...inicial }, reglas);
  return (
    <form onSubmit={form.enviar((v) => onSubmit({ nombre: v.nombre.trim(), descripcion: v.descripcion.trim() }))} noValidate aria-label="Formulario de categoría">
      <FormField label="Nombre" maxLength={50} {...form.campo('nombre')} />
      <FormField as="textarea" label="Descripción (opcional)" maxLength={200} {...form.campo('descripcion')} />
      <div className="d-flex gap-2">
        <Button type="submit">Guardar categoría</Button>
        <Button variant="outline-secondary" onClick={onCancel}>Cancelar</Button>
      </div>
    </form>
  );
}
