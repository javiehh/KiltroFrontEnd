import { fireEvent, render, screen } from '@testing-library/react';
import AddToCartButton from './AddToCartButton.jsx';
import { carritoStore } from '../../data/carrito.js';
import { productosRepo } from '../../data/db.js';
import { reiniciarTodo } from '../../test-utils.jsx';

describe('Simulación de eventos (carrito)', () => {
  beforeEach(reiniciarTodo);

  it('un clic en "Agregar" ejecuta agregarAlCarrito y deja el producto en el carrito', () => {
    render(<AddToCartButton producto={productosRepo.obtener(2)} />);
    fireEvent.click(screen.getByRole('button', { name: 'Agregar' }));
    expect(carritoStore.obtener()).toEqual([{ id: 2, cantidad: 1 }]);
    expect(screen.getByRole('button').textContent).toBe('Agregado ✓'); // el estado del botón cambió
  });
});
