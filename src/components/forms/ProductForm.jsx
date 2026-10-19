import { categoriasRepo, productosRepo } from '../../data/db.js';
import { useCollection } from '../../hooks/useCollection.js';
import { useForm } from '../../hooks/useForm.js';
import { enteroEntre, enteroMinimo, esRequerido, largoMaximo, largoMinimo, numeroMinimo } from '../../utils/validators.js';
import Button from '../common/Button.jsx';
import FormField from '../common/FormField.jsx';

const VACIO = { codigo: '', categoriaId: '', nombre: '', descripcion: '', precio: '', stock: '', stockCritico: '', oferta: false, descuento: '', imagenUrl: '' };

/** Formulario para crear o editar un producto (reglas de negocio del Anexo: código, precio, stock, etc.). */
export default function ProductForm({ inicial, idActual = null, onSubmit, onCancel }) {
  const categorias = useCollection(categoriasRepo);
  const reglas = {
    codigo: [
      esRequerido,
      (v) => largoMinimo(v, 3),
      (v) => {
        const repetido = productosRepo.listar().some((p) => p.codigo.toLowerCase() === v.trim().toLowerCase() && p.id !== idActual);
        return { valid: !repetido, message: 'Ya existe un producto con ese código.' };
      }
    ],
    categoriaId: [esRequerido],
    nombre: [esRequerido, (v) => largoMaximo(v, 100)],
    descripcion: [(v) => largoMaximo(v, 500)],
    precio: [esRequerido, (v) => numeroMinimo(v, 0)],
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
        <FormField label="Código del producto" className="col-md-6 mb-3" hint="Mínimo 3 caracteres, sin límite máximo." {...form.campo('codigo')} />
        <FormField as="select" label="Categoría" className="col-md-6 mb-3" {...form.campo('categoriaId')}>
          <option value="">-- Selecciona --</option>
          {categorias.map((c) => <option key={c.id} value={c.id}>{c.nombre}</option>)}
        </FormField>
        <FormField label="Nombre" className="col-12 mb-3" maxLength={100} {...form.campo('nombre')} />
        <FormField as="textarea" label="Descripción (opcional)" className="col-12 mb-3" maxLength={500} {...form.campo('descripcion')} />
        <FormField label="Precio (CLP)" type="number" step="0.01" min="0" className="col-md-4 mb-3" hint="Puede ser 0 (producto gratis) y admite decimales." {...form.campo('precio')} />
        <FormField label="Stock" type="number" step="1" min="0" className="col-md-4 mb-3" {...form.campo('stock')} />
        <FormField label="Stock crítico (opcional)" type="number" step="1" min="0" className="col-md-4 mb-3" hint="Se avisa cuando el stock llega a este nivel o menos." {...form.campo('stockCritico')} />
        <FormField as="checkbox" label="Producto en oferta" className="col-md-6 mb-3" {...form.campo('oferta')} />
        {form.values.oferta && <FormField label="Descuento (%)" type="number" min="1" max="90" className="col-md-6 mb-3" {...form.campo('descuento')} />}
        <FormField label="URL de imagen (opcional)" type="url" className="col-12 mb-3" placeholder="https://..." {...form.campo('imagenUrl')} />
      </div>
      <div className="d-flex gap-2">
        <Button type="submit">Guardar producto</Button>
        <Button variant="outline-secondary" onClick={onCancel}>Cancelar</Button>
      </div>
    </form>
  );
}
