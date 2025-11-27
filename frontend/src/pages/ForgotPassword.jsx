import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService.js';
import Button from '../components/Button.jsx';
import Input from '../components/Input.jsx';
import Alert from '../components/Alert.jsx';
import { useForm } from '../hooks/useForm.js';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  const { values, handleChange } = useForm({ email: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validación básica
    if (!values.email || !values.email.trim()) {
      setAlert({ type: 'error', message: 'Por favor, ingresa tu correo electrónico' });
      return;
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(values.email.trim())) {
      setAlert({ type: 'error', message: 'Por favor, ingresa un correo electrónico válido' });
      return;
    }

    setLoading(true);
    setAlert(null);

    try {
      const result = await authService.forgotPassword(values.email.trim());
      
      if (result && result.success) {
        setAlert({ 
          type: 'success', 
          message: result.message || 'Código de verificación enviado a tu correo electrónico'
        });
        // Redirigir a la página de verificación de código
        setTimeout(() => {
          navigate(`/reset-password?email=${encodeURIComponent(values.email.trim())}`);
        }, 1500);
      } else {
        // Mostrar el mensaje de error del backend
        const errorMessage = result?.message || 
                            'Error al solicitar recuperación. Por favor, verifica tu correo e intenta nuevamente.';
        setAlert({ type: 'error', message: errorMessage });
      }
    } catch (error) {
      console.error('Error en forgotPassword:', error);
      const errorMessage = error?.message || 
                          error?.response?.data?.message ||
                          'Error al solicitar recuperación. Por favor, verifica tu conexión e intenta nuevamente.';
      setAlert({ type: 'error', message: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Recuperar Contraseña
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Ingresa tu correo electrónico para recibir un código de verificación
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {alert && <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />}
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <p className="text-sm text-blue-800">
              <strong>Proceso de recuperación:</strong> Primero verificarás tu identidad con un código de 6 dígitos, 
              luego recibirás un enlace seguro de un solo uso para restablecer tu contraseña.
            </p>
          </div>

          <Input
            label="Email"
            name="email"
            type="email"
            value={values.email}
            onChange={handleChange}
            required
            disabled={loading}
          />
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Enviando...' : 'Enviar Código de Verificación'}
          </Button>
          <div className="text-center">
            <a href="/login" className="text-sm text-blue-600 hover:text-blue-500">
              Volver al login
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;

