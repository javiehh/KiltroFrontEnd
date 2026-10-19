import { screen } from '@testing-library/react';
import ProductGrid from './ProductGrid.jsx';
import { productosRepo } from '../../data/db.js';
import { renderConApp, reiniciarTodo } from '../../test-utils.jsx';

describe('Renderizado correcto', () => {
  beforeEach(reiniciarTodo);

  it('ProductGrid renderiza una tarjeta por CADA elemento del conjunto de datos', () => {
    const productos = productosRepo.listar();
    renderConApp(<ProductGrid productos={productos} />);
    expect(screen.getAllByTestId('product-card').length).toBe(productos.length);
    productos.forEach((p) => expect(screen.getAllByText(p.nombre).length).toBeGreaterThan(0));
  });
});
