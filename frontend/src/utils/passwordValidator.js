/**
 * Valida que una contraseña cumpla con los requisitos de seguridad
 */
export const validatePassword = (password) => {
  const errors = [];

  if (password.length < 8) {
    errors.push('La contraseña debe tener al menos 8 caracteres');
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('Al menos una letra mayúscula');
  }

  if (!/[a-z]/.test(password)) {
    errors.push('Al menos una letra minúscula');
  }

  if (!/[0-9]/.test(password)) {
    errors.push('Al menos un número');
  }

  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push('Al menos un carácter especial (!@#$%^&*()_+-=[]{}|;:,.<>?)');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

export const getPasswordRequirements = () => {
  return [
    'Mínimo 8 caracteres',
    'Al menos una letra mayúscula',
    'Al menos una letra minúscula',
    'Al menos un número',
    'Al menos un carácter especial (!@#$%^&*()_+-=[]{}|;:,.<>?)'
  ];
};

