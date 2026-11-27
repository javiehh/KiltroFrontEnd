import { fireEvent, render, screen } from '@testing-library/react';
import AddToCartButton from './AddToCartButton.jsx';
import { carritoStore } from '../../data/carrito.js';
import { PRODUCTOS_PRUEBA, reiniciarTodo } from '../../test-utils.jsx';

describe('Simulación de eventos (carrito)', () => {
  beforeEach(reiniciarTodo);

  it('un clic en "Agregar" ejecuta agregarAlCarrito y deja el producto en el carrito', () => {
    render(<AddToCartButton producto={PRODUCTOS_PRUEBA[1]} />);
    fireEvent.click(screen.getByRole('button', { name: 'Agregar' }));
    expect(carritoStore.obtener()).toEqual([{ id: 2, cantidad: 1 }]);
    expect(screen.getByRole('button').textContent).toBe('Agregado ✓');
  });
});
