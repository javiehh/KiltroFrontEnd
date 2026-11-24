import { useCatalogo } from '../../hooks/useCatalogo.js';
import { useForm } from '../../hooks/useForm.js';
import { enteroEntre, enteroMinimo, esRequerido, largoMaximo, largoMinimo } from '../../utils/validators.js';
import Button from '../common/Button.jsx';
import FormField from '../common/FormField.jsx';

const VACIO = { codigo: '', categoriaId: '', nombre: '', descripcion: '', precio: '', stock: '', stockCritico: '', oferta: false, descuento: '', imagenUrl: '' };

/**
 * Formulario para crear o editar un producto. Las validaciones dan respuesta inmediata; el servidor vuelve a
 * validarlo todo (y es quien asegura, por ejemplo, que el código no se repita aunque dos personas creen a la vez).
 */
export default function ProductForm({ inicial, idActual = null, onSubmit, onCancel, errorGeneral = '', enviando = false }) {
  const { categorias, productos } = useCatalogo();
  const reglas = {
    codigo: [
      esRequerido,
      (v) => largoMinimo(v, 3),
      (v) => {
        const repetido = productos.some((p) => p.codigo.toLowerCase() === v.trim().toLowerCase() && p.id !== idActual);
        return { valid: !repetido, message: 'Ya existe un producto con ese código.' };
      }
    ],
    categoriaId: [esRequerido],
    nombre: [esRequerido, (v) => largoMaximo(v, 100)],
    descripcion: [(v) => largoMaximo(v, 500)],
    precio: [esRequerido, (v) => enteroMinimo(v, 0)],
    stock: [esRequerido, (v) => enteroMinimo(v, 0)],
    stockCritico: [(v) => (v === '' ? { valid: true, message: '' } : enteroMinimo(v, 0))],
    descuento: [(v, todos) => (todos.oferta ? enteroEntre(v, 1, 90) : { valid: true, message: '' })]
  };
  const form = useForm({ ...VACIO, ...inicial }, reglas);

  const enviar = (v) => {
    onSubmit({
      codigo: v.codigo.trim(),
      categoriaId: Number(v.categoriaId),
      nombre: v.nombre.trim(),
      descripcion: v.descripcion.trim(),
      precio: Number(v.precio),
      stock: Number(v.stock),
      stockCritico: v.stockCritico === '' ? 0 : Number(v.stockCritico),
      oferta: Boolean(v.oferta),
      descuento: v.oferta ? Number(v.descuento) : 0,
      imagenUrl: v.imagenUrl.trim()
    });
  };

  return (
    <form onSubmit={form.enviar(enviar)} noValidate aria-label="Formulario de producto">
      <div className="row">
        <FormField label="Código del producto" className="col-md-6 mb-3" hint="Entre 3 y 20 caracteres." maxLength={20} {...form.campo('codigo')} />
        <FormField as="select" label="Categoría" className="col-md-6 mb-3" {...form.campo('categoriaId')}>
          <option value="">-- Selecciona --</option>
          {categorias.map((c) => <option key={c.id} value={c.id}>{c.nombre}</option>)}
        </FormField>
        <FormField label="Nombre" className="col-12 mb-3" maxLength={100} {...form.campo('nombre')} />
        <FormField as="textarea" label="Descripción (opcional)" className="col-12 mb-3" maxLength={500} {...form.campo('descripcion')} />
        <FormField label="Precio (CLP)" type="number" step="1" min="0" className="col-md-4 mb-3" hint="Pesos chilenos, sin decimales. Puede ser 0." {...form.campo('precio')} />
        <FormField label="Stock" type="number" step="1" min="0" className="col-md-4 mb-3" {...form.campo('stock')} />
        <FormField label="Stock crítico (opcional)" type="number" step="1" min="0" className="col-md-4 mb-3" hint="Se avisa cuando el stock llega a este nivel o menos." {...form.campo('stockCritico')} />
        <FormField as="checkbox" label="Producto en oferta" className="col-md-6 mb-3" {...form.campo('oferta')} />
        {form.values.oferta && <FormField label="Descuento (%)" type="number" min="1" max="90" className="col-md-6 mb-3" {...form.campo('descuento')} />}
        <FormField label="URL de imagen (opcional)" type="url" className="col-12 mb-3" placeholder="https://..." {...form.campo('imagenUrl')} />
      </div>
      {errorGeneral && <div className="alert alert-danger" role="alert">{errorGeneral}</div>}
      <div className="d-flex gap-2">
        <Button type="submit" disabled={enviando}>{enviando ? 'Guardando…' : 'Guardar producto'}</Button>
        <Button variant="outline-secondary" onClick={onCancel}>Cancelar</Button>
      </div>
    </form>
  );
}
