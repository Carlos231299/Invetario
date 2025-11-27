import { useEffect, useRef } from 'react';
import { authService } from '../services/authService.js';

const SESSION_TIMEOUT = 5 * 60 * 1000; // 5 minutos en milisegundos

export const useSessionTimeout = () => {
  const timeoutRef = useRef(null);
  const lastActivityRef = useRef(Date.now());

  const resetTimeout = () => {
    // Solo activar si el usuario está autenticado
    if (!authService.isAuthenticated()) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      return;
    }

    lastActivityRef.current = Date.now();
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      const timeSinceLastActivity = Date.now() - lastActivityRef.current;
      
      // Verificar nuevamente si está autenticado antes de cerrar sesión
      if (authService.isAuthenticated() && timeSinceLastActivity >= SESSION_TIMEOUT) {
        // Sesión expirada por inactividad
        authService.logout();
        window.location.href = '/login';
      }
    }, SESSION_TIMEOUT);
  };

  useEffect(() => {
    // Eventos que indican actividad del usuario
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    
    const handleActivity = () => {
      resetTimeout();
    };

    // Inicializar timeout
    resetTimeout();

    // Agregar listeners para detectar actividad
    events.forEach(event => {
      document.addEventListener(event, handleActivity, true);
    });

    // Limpiar al desmontar
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      events.forEach(event => {
        document.removeEventListener(event, handleActivity, true);
      });
    };
  }, []);

  return { resetTimeout };
};

