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
        navigate('/dashboard');
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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Inventario Ferretería Bastidas
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Inicia sesión en tu cuenta
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
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
              value={values.email}
              onChange={handleChange}
              error={errors.email}
              required
            />
            <PasswordInput
              label="Contraseña"
              name="password"
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
          <div className="text-center">
            <a
              href="/forgot-password"
              className="text-sm text-blue-600 hover:text-blue-500"
            >
              ¿Olvidaste tu contraseña?
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;

