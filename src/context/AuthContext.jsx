import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { usuariosRepo } from '../data/db.js';
import { ROLES } from '../data/constantes.js';
import { useCollection } from '../hooks/useCollection.js';

export const SESION_KEY = 'kiltro_react_sesion';
const AuthContext = createContext(null);

/**
 * Sesión de usuario simulada: guarda el RUN del usuario conectado en localStorage.
 * El usuario se busca siempre en la "base de datos", así si el admin edita su perfil se refleja al tiro.
 */
export function AuthProvider({ children }) {
  const usuarios = useCollection(usuariosRepo);
  const [run, setRun] = useState(() => localStorage.getItem(SESION_KEY));

  const usuario = useMemo(() => usuarios.find((u) => u.run === run) || null, [usuarios, run]);

  const login = useCallback((correo, password) => {
    const encontrado = usuariosRepo
      .listar()
      .find((u) => u.correo.toLowerCase() === String(correo).trim().toLowerCase() && u.password === password);
    if (!encontrado) return { ok: false, error: 'Correo o contraseña incorrectos.' };
    localStorage.setItem(SESION_KEY, encontrado.run);
    setRun(encontrado.run);
    return { ok: true, usuario: encontrado };
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(SESION_KEY);
    setRun(null);
  }, []);

  /** Registro público: siempre crea un usuario de tipo Cliente. */
  const registrar = useCallback((datos) => {
    if (usuariosRepo.obtener(datos.run)) return { ok: false, error: 'Ya existe una cuenta registrada con ese RUN.' };
    if (usuariosRepo.listar().some((u) => u.correo.toLowerCase() === datos.correo.toLowerCase())) {
      return { ok: false, error: 'Ya existe una cuenta con ese correo.' };
    }
    const creado = usuariosRepo.crear({ ...datos, tipo: ROLES.CLIENTE });
    return { ok: true, usuario: creado };
  }, []);

  const valor = useMemo(
    () => ({
      usuario,
      login,
      logout,
      registrar,
      estaLogueado: Boolean(usuario),
      esAdmin: usuario?.tipo === ROLES.ADMIN,
      esVendedor: usuario?.tipo === ROLES.VENDEDOR,
      puedeEntrarAlPanel: usuario?.tipo === ROLES.ADMIN || usuario?.tipo === ROLES.VENDEDOR
    }),
    [usuario, login, logout, registrar]
  );

  return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>;
}

/** Falla con un mensaje claro si se usa useAuth fuera de <AuthProvider> (función pura, fácil de probar). */
export function exigirAuth(ctx) {
  if (!ctx) throw new Error('useAuth debe usarse dentro de <AuthProvider>');
  return ctx;
}

export function useAuth() {
  return exigirAuth(useContext(AuthContext));
}
