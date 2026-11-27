import { useState } from 'react';
import { validarValor } from '../utils/validators.js';

export function useForm(valoresIniciales, reglas = {}) {
  const [values, setValues] = useState(valoresIniciales);
  const [tocados, setTocados] = useState({});
  const [intentoEnvio, setIntentoEnvio] = useState(false);

  const errors = {};
  Object.keys(reglas).forEach((nombre) => {
    errors[nombre] = validarValor(values[nombre], reglas[nombre], values);
  });

  const cambiar = (nombre, valor) => setValues((v) => ({ ...v, [nombre]: valor }));

  const campo = (nombre) => ({
    id: nombre,
    name: nombre,
    value: values[nombre] ?? '',
    onChange: (e) => cambiar(nombre, e.target.type === 'checkbox' ? e.target.checked : e.target.value),
    onBlur: () => setTocados((t) => ({ ...t, [nombre]: true })),
    error: tocados[nombre] || intentoEnvio ? errors[nombre] || '' : ''
  });

  const esValido = Object.values(errors).every((e) => !e);

  const enviar = (fn) => (evento) => {
    evento?.preventDefault?.();
    setIntentoEnvio(true);
    if (esValido) fn(values);
  };

  const reiniciar = (nuevos = valoresIniciales) => {
    setValues(nuevos);
    setTocados({});
    setIntentoEnvio(false);
  };

  return { values, errors, esValido, campo, cambiar, enviar, reiniciar, setValues };
}
