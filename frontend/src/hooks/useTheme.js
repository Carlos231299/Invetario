import { useState, useEffect } from 'react';

// Función para obtener el tema del sistema
const getSystemTheme = () => {
  if (typeof window !== 'undefined' && window.matchMedia) {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return 'light';
};

// Función para aplicar el tema al documento
const applyTheme = (themeValue) => {
  const root = document.documentElement;
  const body = document.body;
  
  // Remover todas las clases de tema
  root.classList.remove('dark', 'light');
  body.classList.remove('dark', 'light');
  
  // Determinar el tema real a aplicar
  let actualTheme = themeValue;
  if (themeValue === 'system') {
    actualTheme = getSystemTheme();
  }
  
  // Aplicar tema
  if (actualTheme === 'dark') {
    root.classList.add('dark');
    body.classList.add('dark');
  } else {
    root.classList.add('light');
    body.classList.add('light');
  }
};

export const useTheme = () => {
  const [theme, setTheme] = useState(() => {
    // Obtener tema del localStorage o usar 'system' por defecto
    const savedTheme = localStorage.getItem('theme');
    return savedTheme || 'system';
  });

  useEffect(() => {
    // Aplicar tema inicial
    applyTheme(theme);

    // Guardar en localStorage
    localStorage.setItem('theme', theme);

    // Si el tema es 'system', escuchar cambios en la preferencia del sistema
    if (theme === 'system' && typeof window !== 'undefined' && window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      
      const handleChange = (e) => {
        applyTheme('system');
      };

      // Agregar listener (compatible con navegadores modernos y antiguos)
      if (mediaQuery.addEventListener) {
        mediaQuery.addEventListener('change', handleChange);
      } else {
        // Fallback para navegadores antiguos
        mediaQuery.addListener(handleChange);
      }

      return () => {
        if (mediaQuery.removeEventListener) {
          mediaQuery.removeEventListener('change', handleChange);
        } else {
          mediaQuery.removeListener(handleChange);
        }
      };
    }
  }, [theme]);

  const changeTheme = (newTheme) => {
    setTheme(newTheme);
    // Aplicar inmediatamente sin esperar al useEffect
    applyTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  return { theme, changeTheme };
};

