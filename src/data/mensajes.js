const CLAVE = 'kiltro_mensajes_contacto';

export function listarMensajes() {
  try {
    return JSON.parse(localStorage.getItem(CLAVE)) || [];
  } catch (e) {
    return [];
  }
}

export function guardarMensaje(datos) {
  const nuevo = { id: Date.now(), ...datos };
  localStorage.setItem(CLAVE, JSON.stringify([...listarMensajes(), nuevo]));
  return nuevo;
}
