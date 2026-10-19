import { productosRepo } from './db.js';
import { reiniciarTodo } from '../test-utils.jsx';

describe('Archivo de datos (db.js)', () => {
  beforeEach(reiniciarTodo);

  it('permite Crear, Leer, Actualizar y Eliminar productos', () => {
    const creado = productosRepo.crear({ codigo: 'X-1', nombre: 'Nuevo' });                  // Create
    expect(productosRepo.obtener(creado.id).nombre).toBe('Nuevo');                           // Read
    expect(productosRepo.actualizar(creado.id, { nombre: 'Editado' }).nombre).toBe('Editado'); // Update
    expect(productosRepo.eliminar(creado.id)).toBeTrue();                                    // Delete
    expect(productosRepo.obtener(creado.id)).toBeUndefined();
  });
});
