import { fireEvent, screen } from '@testing-library/react';
import { AxiosError } from 'axios';
import { Route, Routes, useLocation } from 'react-router-dom';
import CheckoutPage from './CheckoutPage.jsx';
import { catalogo } from '../../api/catalogo.js';
import { apiProductos, apiVentas } from '../../api/http.js';
import { agregarAlCarrito, carritoStore } from '../../data/carrito.js';
import { CATEGORIAS_PRUEBA, PRODUCTOS_PRUEBA, renderConApp, reiniciarTodo, RUN } from '../../test-utils.jsx';

/** Respuesta simulada: 2xx resuelve; el resto rechaza como lo haría axios. */
function responder(config, status, data) {
  const respuesta = { data, status, statusText: '', headers: {}, config };
  if (status >= 200 && status < 300) return Promise.resolve(respuesta);
  return Promise.reject(new AxiosError(`HTTP ${status}`, AxiosError.ERR_BAD_REQUEST, config, null, respuesta));
}

function CompraFallida() {
  const { state } = useLocation();
  return <p data-testid="motivo-fallo">{state?.motivo}</p>;
}

const Pantallas = () => (
  <Routes>
    <Route path="/checkout" element={<CheckoutPage />} />
    <Route path="/compra/exitosa/:id" element={<p>COMPRA REALIZADA</p>} />
    <Route path="/compra/error" element={<CompraFallida />} />
  </Routes>
);

describe('Checkout contra ms-ventas', () => {
  let peticionesDeCompra;

  beforeEach(async () => {
    reiniciarTodo();
    peticionesDeCompra = [];
    apiProductos.defaults.adapter = (config) =>
      responder(config, 200, config.url.includes('categorias') ? CATEGORIAS_PRUEBA : PRODUCTOS_PRUEBA);
    await catalogo.invalidar();
    agregarAlCarrito(1, 2);
  });

  const pagar = () => fireEvent.submit(screen.getByRole('form', { name: 'Datos de compra' }));

  it('con 201 muestra la compra realizada y vacía el carrito; al servidor solo viajan productoId y cantidad', async () => {
    apiVentas.defaults.adapter = (config) => {
      peticionesDeCompra.push(JSON.parse(config.data));
      return responder(config, 201, { id: 7, codigo: 'ORDER10007', estado: 'PAGADA', total: 59484, items: [] });
    };
    renderConApp(<Pantallas />, { ruta: '/checkout', usuarioRun: RUN.CLIENTE });

    pagar();

    expect(await screen.findByText('COMPRA REALIZADA')).toBeTruthy();
    expect(carritoStore.obtener().length).toBe(0);
    expect(peticionesDeCompra[0].items).toEqual([{ productoId: 1, cantidad: 2 }]);
    expect(JSON.stringify(peticionesDeCompra[0])).not.toContain('29742'); // ningún precio sale del navegador
  });

  it('con 409 (sin stock) muestra el motivo del servidor y CONSERVA el carrito', async () => {
    apiVentas.defaults.adapter = (config) =>
      responder(config, 409, { status: 409, mensaje: 'Stock insuficiente de "Alimento premium adulto 15kg": quedan 1 y se pidieron 2' });
    renderConApp(<Pantallas />, { ruta: '/checkout', usuarioRun: RUN.CLIENTE });

    pagar();

    expect((await screen.findByTestId('motivo-fallo')).textContent).toContain('Stock insuficiente');
    expect(carritoStore.obtener().length).toBe(1);
  });

  it('con 503 (ms-productos caído) también lleva a la vista de compra fallida', async () => {
    apiVentas.defaults.adapter = (config) =>
      responder(config, 503, { status: 503, mensaje: 'El servicio de productos no está disponible. Intenta nuevamente en unos minutos' });
    renderConApp(<Pantallas />, { ruta: '/checkout', usuarioRun: RUN.CLIENTE });

    pagar();

    expect((await screen.findByTestId('motivo-fallo')).textContent).toContain('no está disponible');
    expect(carritoStore.obtener().length).toBe(1);
  });
});
