import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';
import { useForm } from '../hooks/useForm.js';
import Button from '../components/Button.jsx';
import Input from '../components/Input.jsx';
import PasswordInput from '../components/PasswordInput.jsx';
import Alert from '../components/Alert.jsx';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { values, handleChange, errors, setErrors } = useForm({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAlert(null);
    setErrors({});

    try {
      const result = await login(values.email, values.password);
      if (result.success) {
        // Forzar navegación al dashboard
        window.location.href = '/dashboard';
      } else {
        setAlert({ type: 'error', message: result.message || 'Error al iniciar sesión' });
      }
    } catch (error) {
      setAlert({ 
        type: 'error', 
        message: error.message || 'Error al conectar con el servidor. Verifica tu conexión a internet.' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center shadow-xl transform hover:scale-105 transition-transform">
              <span className="text-white font-bold text-3xl">IB</span>
            </div>
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900 mb-2">
            Inventario Ferretería Bastidas
          </h2>
          <p className="text-sm text-gray-600">
            Sistema de gestión de inventario profesional
          </p>
          <p className="mt-1 text-xs text-gray-500">
            Inicia sesión para continuar
          </p>
        </div>
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <form className="space-y-6" onSubmit={handleSubmit}>
          {alert && (
            <Alert
              type={alert.type}
              message={alert.message}
              onClose={() => setAlert(null)}
            />
          )}
          <div>
            <Input
              label="Email"
              name="email"
              type="email"
              autoComplete="email"
              value={values.email}
              onChange={handleChange}
              error={errors.email}
              required
            />
            <PasswordInput
              label="Contraseña"
              name="password"
              autoComplete="current-password"
              value={values.password}
              onChange={handleChange}
              error={errors.password}
              required
            />
          </div>
          <div>
            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </Button>
          </div>
            <div className="text-center pt-4 border-t border-gray-200">
              <a
                href="/forgot-password"
                className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
              >
                ¿Olvidaste tu contraseña?
              </a>
            </div>
          </form>
        </div>
        <p className="text-center text-xs text-gray-500">
          © {new Date().getFullYear()} Ferretería Bastidas. Todos los derechos reservados.
        </p>
      </div>
    </div>
  );
};

export default Login;

