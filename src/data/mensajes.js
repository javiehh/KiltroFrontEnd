/**
 * Mensajes del formulario de contacto. La guía no incluye un microservicio para ellos, así que siguen
 * guardándose en el navegador (localStorage), como en la EP2. Todo lo demás de la tienda ya viene de la API.
 */
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
