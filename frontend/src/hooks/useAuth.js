import { useState, useEffect } from 'react';
import { authService } from '../services/authService.js';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Función para cargar el usuario desde localStorage
  const loadUser = () => {
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
    setLoading(false);
  };

  useEffect(() => {
    loadUser();

    // Escuchar cambios en localStorage para actualizar el usuario
    const handleStorageChange = (e) => {
      if (e.key === 'user') {
        loadUser();
      }
    };

    // Escuchar eventos de storage (cuando cambia en otra pestaña)
    window.addEventListener('storage', handleStorageChange);

    // Escuchar eventos personalizados para cambios en la misma pestaña
    const handleUserUpdate = () => {
      loadUser();
    };
    window.addEventListener('userUpdated', handleUserUpdate);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('userUpdated', handleUserUpdate);
    };
  }, []);

  const login = async (email, password) => {
    const result = await authService.login(email, password);
    if (result.success) {
      setUser(result.data.user);
    }
    return result;
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    // Redirigir al login
    window.location.href = '/login';
  };

  const updateUser = (updatedUserData) => {
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      const updatedUser = { ...currentUser, ...updatedUserData };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      // Disparar evento personalizado para actualizar otros componentes
      window.dispatchEvent(new Event('userUpdated'));
    }
  };

  return {
    user,
    loading,
    login,
    logout,
    updateUser,
    isAuthenticated: authService.isAuthenticated()
  };
};

