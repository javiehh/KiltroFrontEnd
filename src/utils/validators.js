/**
 * Validadores reutilizables. Cada uno recibe el valor del campo y devuelve { valid, message }.
 * Se combinan en listas (ver validarValor) y los usa el hook useForm.
 */

// Dominios de correo permitidos (definido por el negocio en las evaluaciones anteriores)
export const DOMINIOS_PERMITIDOS = ['gmail.com'];

export const esRequerido = (valor) => {
  const ok = valor !== null && valor !== undefined && String(valor).trim().length > 0;
  return { valid: ok, message: ok ? '' : 'Este campo es obligatorio.' };
};

export const largoMinimo = (valor, min) => {
  const ok = String(valor).trim().length >= min;
  return { valid: ok, message: ok ? '' : `Debe tener al menos ${min} caracteres.` };
};

export const largoMaximo = (valor, max) => {
  const largo = String(valor).trim().length;
  const ok = largo <= max;
  return { valid: ok, message: ok ? '' : `Máximo ${max} caracteres (llevas ${largo}).` };
};

export const largoEntre = (valor, min, max) => {
  const largo = String(valor).trim().length;
  const ok = largo >= min && largo <= max;
  return { valid: ok, message: ok ? '' : `Debe tener entre ${min} y ${max} caracteres.` };
};

export const correoValido = (valor) => {
  const v = String(valor).trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return { valid: false, message: 'Ingresa un correo con formato válido.' };
  const dominio = v.split('@')[1].toLowerCase();
  const ok = DOMINIOS_PERMITIDOS.includes(dominio);
  return { valid: ok, message: ok ? '' : `Solo se aceptan correos ${DOMINIOS_PERMITIDOS.map((d) => '@' + d).join(', ')}.` };
};

/** Correo opcional: vacío es válido, pero si se escribe debe cumplir formato y dominio. */
export const correoOpcional = (valor) => (String(valor).trim() === '' ? { valid: true, message: '' } : correoValido(valor));

/** RUN chileno sin puntos ni guion (7 a 9 caracteres), verificado con el algoritmo de módulo 11. */
export const runValido = (valorCrudo) => {
  const run = String(valorCrudo).trim().toUpperCase().replace(/[^0-9K]/g, '');
  if (run.length < 7 || run.length > 9) {
    return { valid: false, message: 'El RUN debe tener entre 7 y 9 caracteres, sin puntos ni guion.' };
  }
  const cuerpo = run.slice(0, -1);
  const dv = run.slice(-1);
  if (!/^\d+$/.test(cuerpo)) return { valid: false, message: 'El RUN solo puede tener números (y K como dígito verificador).' };

  let suma = 0;
  let multiplo = 2;
  for (let i = cuerpo.length - 1; i >= 0; i--) {
    suma += multiplo * parseInt(cuerpo[i], 10);
    multiplo = multiplo < 7 ? multiplo + 1 : 2;
  }
  const resto = 11 - (suma % 11);
  const esperado = resto === 11 ? '0' : resto === 10 ? 'K' : String(resto);
  const ok = dv === esperado;
  return { valid: ok, message: ok ? '' : 'El RUN ingresado no es válido (dígito verificador no coincide).' };
};

export const numeroMinimo = (valor, min) => {
  const n = Number(valor);
  const ok = valor !== '' && !Number.isNaN(n) && n >= min;
  return { valid: ok, message: ok ? '' : `Debe ser un número mayor o igual a ${min}.` };
};

export const enteroMinimo = (valor, min) => {
  const n = Number(valor);
  const ok = valor !== '' && Number.isInteger(n) && n >= min;
  return { valid: ok, message: ok ? '' : `Debe ser un número entero mayor o igual a ${min}.` };
};

export const enteroEntre = (valor, min, max) => {
  const n = Number(valor);
  const ok = valor !== '' && Number.isInteger(n) && n >= min && n <= max;
  return { valid: ok, message: ok ? '' : `Debe ser un número entero entre ${min} y ${max}.` };
};

/** Ejecuta una lista de reglas (valor, todosLosValores) => {valid,message} y devuelve el primer error ('' si todo OK). */
export function validarValor(valor, reglas = [], valores = {}) {
  for (const regla of reglas) {
    const resultado = regla(valor, valores);
    if (!resultado.valid) return resultado.message;
  }
  return '';
}
