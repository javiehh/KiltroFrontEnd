import { agregarAlCarrito, carritoStore, detalleCarrito, totalCarrito } from './carrito.js';
import { PRODUCTOS_PRUEBA, reiniciarTodo } from '../test-utils.jsx';

describe('Carrito de compras', () => {
  beforeEach(reiniciarTodo);

  it('calcula el total usando el precio con oferta y no supera el stock', () => {
    agregarAlCarrito(1, 2);
    agregarAlCarrito(3, 1);
    const detalle = detalleCarrito(carritoStore.obtener(), PRODUCTOS_PRUEBA);
    expect(totalCarrito(detalle)).toBe(29742 * 2 + 18900);

    agregarAlCarrito(6, 10, 3);
    expect(carritoStore.obtener().find((l) => l.id === 6).cantidad).toBe(3);
  });
});
