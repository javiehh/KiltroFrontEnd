import { screen } from '@testing-library/react';
import ProductGrid from './ProductGrid.jsx';
import { CATEGORIAS_PRUEBA, PRODUCTOS_PRUEBA, renderConApp, reiniciarTodo } from '../../test-utils.jsx';

describe('Renderizado correcto', () => {
  beforeEach(reiniciarTodo);

  it('ProductGrid renderiza una tarjeta por CADA elemento del conjunto de datos', () => {
    renderConApp(<ProductGrid productos={PRODUCTOS_PRUEBA} categorias={CATEGORIAS_PRUEBA} />);
    expect(screen.getAllByTestId('product-card').length).toBe(PRODUCTOS_PRUEBA.length);
    PRODUCTOS_PRUEBA.forEach((p) => expect(screen.getAllByText(p.nombre).length).toBeGreaterThan(0));
  });

  it('sin productos muestra el mensaje de vacío en lugar de la grilla', () => {
    renderConApp(<ProductGrid productos={[]} mensajeVacio="Nada por aquí" />);
    expect(screen.queryAllByTestId('product-card').length).toBe(0);
    expect(screen.getByText('Nada por aquí')).toBeTruthy();
  });
});
