import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService.js';
import Button from '../components/Button.jsx';
import Input from '../components/Input.jsx';
import Alert from '../components/Alert.jsx';
import { useForm } from '../hooks/useForm.js';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [method, setMethod] = useState('code'); // 'code' o 'link'
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  const { values, handleChange } = useForm({ email: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAlert(null);

    try {
      const result = await authService.forgotPassword(values.email, method);
      if (result.success) {
        setAlert({ 
          type: 'success', 
          message: result.message || (method === 'code' 
            ? 'Código enviado a tu correo electrónico' 
            : 'Enlace enviado a tu correo electrónico')
        });
        if (method === 'code') {
          navigate(`/reset-password?email=${encodeURIComponent(values.email)}`);
        } else {
          setAlert({ 
            type: 'success', 
            message: 'Revisa tu correo electrónico y haz clic en el enlace para restablecer tu contraseña' 
          });
        }
      } else {
        setAlert({ type: 'error', message: result.message || 'Error al solicitar recuperación' });
      }
    } catch (error) {
      setAlert({ type: 'error', message: 'Error al solicitar recuperación' });
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
            Elige el método de recuperación
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {alert && <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />}
          
          {/* Selector de método */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Método de recuperación:
            </label>
            <div className="flex space-x-4">
              <button
                type="button"
                onClick={() => setMethod('code')}
                className={`flex-1 py-2 px-4 rounded-lg border-2 transition-colors ${
                  method === 'code'
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                }`}
              >
                <div className="font-semibold">Por Código</div>
                <div className="text-xs mt-1">Recibirás un código de 6 dígitos</div>
              </button>
              <button
                type="button"
                onClick={() => setMethod('link')}
                className={`flex-1 py-2 px-4 rounded-lg border-2 transition-colors ${
                  method === 'link'
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                }`}
              >
                <div className="font-semibold">Por Enlace</div>
                <div className="text-xs mt-1">Recibirás un enlace de un solo uso</div>
              </button>
            </div>
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
            {loading 
              ? 'Enviando...' 
              : method === 'code' 
                ? 'Enviar Código de Recuperación' 
                : 'Enviar Enlace de Recuperación'}
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

