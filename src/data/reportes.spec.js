import { cantidadAnuladas, topProductos, unidadesInventario, usuariosPorRol, valorInventario, ventasPorCategoria } from './reportes.js';

const item = (productoId, nombre, cantidad, precio) => ({ productoId, nombre, cantidad, precio, subtotal: cantidad * precio });
const boletas = [
  { id: 1, estado: 'PAGADA', items: [item(1, 'Alimento', 2, 1000), item(2, 'Correa', 1, 500)] },
  { id: 2, estado: 'ENVIADA', items: [item(1, 'Alimento', 1, 1000)] },
  { id: 3, estado: 'ANULADA', items: [item(2, 'Correa', 10, 500)] } // no debe contar
];

describe('Reportes', () => {
  it('las boletas anuladas no cuentan como venta', () => {
    expect(cantidadAnuladas(boletas)).toBe(1);
    const top = topProductos(boletas, 5);
    expect(top.find((t) => t.productoId === 2).unidades).toBe(1); // no suma las 10 de la boleta anulada
  });

  it('topProductos ordena por unidades vendidas y suma los ingresos', () => {
    const top = topProductos(boletas, 5);
    expect(top[0]).toEqual({ productoId: 1, nombre: 'Alimento', unidades: 3, ingresos: 3000 });
  });

  it('ventasPorCategoria reparte los ingresos según la categoría de cada producto', () => {
    const productos = [{ id: 1, categoriaId: 10 }, { id: 2, categoriaId: 20 }];
    const categorias = [{ id: 10, nombre: 'Perros' }, { id: 20, nombre: 'Gatos' }];
    expect(ventasPorCategoria(boletas, productos, categorias)).toEqual([
      { categoria: 'Perros', ingresos: 3000 }, { categoria: 'Gatos', ingresos: 500 }
    ]);
  });

  it('inventario: valor y unidades', () => {
    const productos = [{ precio: 1000, stock: 3 }, { precio: 500, stock: 10 }];
    expect(valorInventario(productos)).toBe(8000);
    expect(unidadesInventario(productos)).toBe(13);
  });

  it('usuariosPorRol cuenta cada rol', () => {
    const r = usuariosPorRol([{ tipo: 'Cliente' }, { tipo: 'Cliente' }, { tipo: 'Administrador' }]);
    expect(r.find((x) => x.rol === 'Cliente').cantidad).toBe(2);
    expect(r.find((x) => x.rol === 'Vendedor').cantidad).toBe(0);
  });
});
