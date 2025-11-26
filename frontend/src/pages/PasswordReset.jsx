import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { authService } from '../services/authService.js';
import Button from '../components/Button.jsx';
import Input from '../components/Input.jsx';
import Alert from '../components/Alert.jsx';
import { useForm } from '../hooks/useForm.js';

const PasswordReset = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');
  const [step, setStep] = useState(token ? 'reset' : 'request');
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  const { values, handleChange, reset } = useForm({ email: '', password: '', confirmPassword: '' });

  const handleRequestReset = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAlert(null);

    try {
      const result = await authService.forgotPassword(values.email);
      setAlert({ type: 'success', message: result.message || 'Si el email existe, se enviará un enlace de recuperación' });
    } catch (error) {
      setAlert({ type: 'error', message: 'Error al solicitar recuperación' });
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (values.password !== values.confirmPassword) {
      setAlert({ type: 'error', message: 'Las contraseñas no coinciden' });
      return;
    }

    setLoading(true);
    setAlert(null);

    try {
      const result = await authService.resetPassword(token, values.password);
      if (result.success) {
        setAlert({ type: 'success', message: 'Contraseña restablecida correctamente' });
        setTimeout(() => navigate('/login'), 2000);
      } else {
        setAlert({ type: 'error', message: result.message || 'Error al restablecer contraseña' });
      }
    } catch (error) {
      setAlert({ type: 'error', message: 'Error al restablecer contraseña' });
    } finally {
      setLoading(false);
    }
  };

  if (step === 'request') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Recuperar Contraseña
            </h2>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleRequestReset}>
            {alert && <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />}
            <Input
              label="Email"
              name="email"
              type="email"
              value={values.email}
              onChange={handleChange}
              required
            />
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Enviando...' : 'Enviar Enlace de Recuperación'}
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
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Restablecer Contraseña
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleResetPassword}>
          {alert && <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />}
          <Input
            label="Nueva Contraseña"
            name="password"
            type="password"
            value={values.password}
            onChange={handleChange}
            required
          />
          <Input
            label="Confirmar Contraseña"
            name="confirmPassword"
            type="password"
            value={values.confirmPassword}
            onChange={handleChange}
            required
          />
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Restableciendo...' : 'Restablecer Contraseña'}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default PasswordReset;

