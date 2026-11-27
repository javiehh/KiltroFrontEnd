import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { ROLES } from '../data/constantes.js';
import { PERMISOS, puede } from '../permisos.js';
import { sesion } from '../api/sesion.js';
import { mensajeDeError } from '../api/errores.js';
import { guardarPerfil, iniciarSesion, obtenerSesion, registrarCuenta } from '../api/authApi.js';

export const AuthContext = createContext(null);

export function construirValor({ usuario = null, cargando = false, sesionExpirada = false, acciones = {} } = {}) {
  return {
    usuario,
    cargando,
    sesionExpirada,
    login: async () => ({ ok: false, error: 'No disponible' }),
    logout: () => {},
    registrar: async () => ({ ok: false, error: 'No disponible' }),
    actualizarPerfil: async () => ({ ok: false, error: 'No disponible' }),
    ...acciones,
    estaLogueado: Boolean(usuario),
    esAdmin: usuario?.tipo === ROLES.ADMIN,
    esVendedor: usuario?.tipo === ROLES.VENDEDOR,
    puedeEntrarAlPanel: puede(usuario, PERMISOS.PANEL),
    puede: (permiso) => puede(usuario, permiso)
  };
}

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(() => sesion.hayTokens());
  const [sesionExpirada, setSesionExpirada] = useState(false);

  useEffect(() => {
    if (!sesion.hayTokens()) return undefined;
    let activo = true;
    obtenerSesion()
      .then((u) => activo && setUsuario(u))
      .catch((error) => {
        if (error?.response) sesion.limpiar();
      })
      .finally(() => activo && setCargando(false));
    return () => {
      activo = false;
    };
  }, []);

  useEffect(
    () =>
      sesion.alExpirar(() => {
        setUsuario(null);
        setSesionExpirada(true);
      }),
    []
  );

  const login = useCallback(async (correo, password) => {
    try {
      const { usuario: u, accessToken, refreshToken } = await iniciarSesion(correo, password);
      sesion.guardar(accessToken, refreshToken);
      setUsuario(u);
      setSesionExpirada(false);
      return { ok: true, usuario: u };
    } catch (error) {
      return { ok: false, error: mensajeDeError(error) };
    }
  }, []);

  const logout = useCallback(() => {
    sesion.limpiar();
    setUsuario(null);
    setSesionExpirada(false);
  }, []);

  const registrar = useCallback(async (datos) => {
    try {
      return { ok: true, usuario: await registrarCuenta(datos) };
    } catch (error) {
      return { ok: false, error: mensajeDeError(error) };
    }
  }, []);

  const actualizarPerfil = useCallback(async (datos) => {
    try {
      const actualizado = await guardarPerfil(datos);
      setUsuario(actualizado);
      return { ok: true, usuario: actualizado };
    } catch (error) {
      return { ok: false, error: mensajeDeError(error) };
    }
  }, []);

  const valor = useMemo(
    () => construirValor({ usuario, cargando, sesionExpirada, acciones: { login, logout, registrar, actualizarPerfil } }),
    [usuario, cargando, sesionExpirada, login, logout, registrar, actualizarPerfil]
  );

  return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>;
}

export function exigirAuth(ctx) {
  if (!ctx) throw new Error('useAuth debe usarse dentro de <AuthProvider>');
  return ctx;
}

export function useAuth() {
  return exigirAuth(useContext(AuthContext));
}
