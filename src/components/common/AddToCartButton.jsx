import { useEffect, useState } from 'react';
import { agregarAlCarrito } from '../../data/carrito.js';
import Button from './Button.jsx';

export default function AddToCartButton({ producto, cantidad = 1, className = '', size = 'sm', children }) {
  const [agregado, setAgregado] = useState(false);

  useEffect(() => {
    if (!agregado) return undefined;
    const t = setTimeout(() => setAgregado(false), 1200);
    return () => clearTimeout(t);
  }, [agregado]);

  if (producto.stock <= 0) return <Button variant="secondary" size={size} disabled className={className}>Sin stock</Button>;

  const alHacerClic = () => {
    agregarAlCarrito(producto.id, cantidad, producto.stock);
    setAgregado(true);
  };

  return (
    <Button variant={agregado ? 'success' : 'primary'} size={size} className={className} onClick={alHacerClic}>
      {agregado ? 'Agregado ✓' : children ?? 'Agregar'}
    </Button>
  );
}
