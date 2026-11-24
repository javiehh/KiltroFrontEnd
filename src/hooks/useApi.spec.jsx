import { act, renderHook, waitFor } from '@testing-library/react';
import { useApi } from './useApi.js';

/**
 * Espera hasta que se cumpla una condición. Con Jasmine el callback de waitFor debe LANZAR un error cuando aún no se cumple:
 * un expect() de Jasmine que falla solo anota el fallo y no lanza, y waitFor creería que ya terminó.
 */
const esperar = (condicion) =>
  waitFor(() => {
    if (!condicion()) throw new Error('la condición todavía no se cumple');
  });

describe('useApi', () => {
  it('pasa de "cargando" a los datos cuando la consulta termina', async () => {
    const { result } = renderHook(() => useApi(() => Promise.resolve([1, 2, 3])));
    expect(result.current.cargando).toBe(true);
    expect(result.current.datos).toBeNull();

    await esperar(() => !result.current.cargando);

    expect(result.current.datos).toEqual([1, 2, 3]);
    expect(result.current.error).toBe('');
  });

  it('entrega el mensaje del servidor cuando la consulta falla', async () => {
    const { result } = renderHook(() => useApi(() => Promise.reject({ response: { data: { mensaje: 'No autorizado' } } })));

    await esperar(() => !result.current.cargando);

    expect(result.current.error).toBe('No autorizado');
    expect(result.current.datos).toBeNull();
  });

  it('recargar vuelve a pedir los datos', async () => {
    let llamadas = 0;
    const { result } = renderHook(() => useApi(() => Promise.resolve(++llamadas)));
    await esperar(() => result.current.datos === 1);

    act(() => result.current.recargar());

    await esperar(() => result.current.datos === 2);
    expect(llamadas).toBe(2);
  });

  it('al cambiar las dependencias descarta los datos anteriores e ignora la respuesta tardía', async () => {
    const pendientes = {};
    const consulta = (id) => new Promise((resolver) => { pendientes[id] = resolver; });
    const { result, rerender } = renderHook(({ id }) => useApi(() => consulta(id), [id]), { initialProps: { id: 1 } });

    rerender({ id: 2 }); // el usuario cambió de producto antes de que llegara la respuesta del primero
    await esperar(() => pendientes[1] && pendientes[2]);
    pendientes[1]('respuesta tardía del producto 1');
    pendientes[2]('producto 2');

    await esperar(() => result.current.datos === 'producto 2');
    expect(result.current.datos).toBe('producto 2'); // la respuesta tardía del producto 1 no pisó a la vigente
  });
});
