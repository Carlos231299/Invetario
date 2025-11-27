import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService.js';
import Button from '../components/Button.jsx';
import Input from '../components/Input.jsx';
import PasswordInput from '../components/PasswordInput.jsx';
import Alert from '../components/Alert.jsx';
import { useForm } from '../hooks/useForm.js';
import { validatePassword, getPasswordRequirements } from '../utils/passwordValidator.js';

const PasswordReset = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState('request'); // request -> verify -> reset
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  const { values, handleChange, reset } = useForm({ email: '', code: '', password: '', confirmPassword: '' });

  const handleRequestReset = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAlert(null);

    try {
      const result = await authService.forgotPassword(values.email);
      if (result.success) {
        setAlert({ type: 'success', message: result.message || 'Código enviado a tu correo electrónico' });
        setStep('verify');
      } else {
        setAlert({ type: 'error', message: result.message || 'Error al solicitar recuperación' });
      }
    } catch (error) {
      setAlert({ type: 'error', message: 'Error al solicitar recuperación' });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    if (values.code.length !== 6) {
      setAlert({ type: 'error', message: 'El código debe tener 6 dígitos' });
      return;
    }

    setLoading(true);
    setAlert(null);

    try {
      const result = await authService.verifyCode(values.email, values.code);
      if (result.success) {
        setAlert({ type: 'success', message: 'Código verificado correctamente' });
        setStep('reset');
      } else {
        setAlert({ type: 'error', message: result.message || 'Código inválido' });
      }
    } catch (error) {
      setAlert({ type: 'error', message: 'Error al verificar código' });
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

    const passwordValidation = validatePassword(values.password);
    if (!passwordValidation.isValid) {
      setAlert({ 
        type: 'error', 
        message: 'La contraseña no cumple con los requisitos: ' + passwordValidation.errors.join(', ') 
      });
      return;
    }

    setLoading(true);
    setAlert(null);

    try {
      const result = await authService.resetPassword(values.email, values.code, values.password);
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
            <p className="mt-2 text-center text-sm text-gray-600">
              Ingresa tu correo electrónico para recibir un código de recuperación
            </p>
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
              disabled={loading}
            />
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Enviando...' : 'Enviar Código de Recuperación'}
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

  if (step === 'verify') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Verificar Código
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Ingresa el código de 6 dígitos enviado a {values.email}
            </p>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleVerifyCode}>
            {alert && <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />}
            <Input
              label="Código de Verificación"
              name="code"
              type="text"
              value={values.code}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                handleChange({ target: { name: 'code', value } });
              }}
              placeholder="000000"
              maxLength="6"
              required
              disabled={loading}
              className="text-center text-2xl tracking-widest font-mono"
            />
            <Button type="submit" className="w-full" disabled={loading || values.code.length !== 6}>
              {loading ? 'Verificando...' : 'Verificar Código'}
            </Button>
            <div className="text-center space-y-2">
              <button
                type="button"
                onClick={() => {
                  setStep('request');
                  reset();
                  setAlert(null);
                }}
                className="text-sm text-blue-600 hover:text-blue-500"
              >
                Cambiar correo electrónico
              </button>
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
          <PasswordInput
            label="Nueva Contraseña"
            name="password"
            value={values.password}
            onChange={handleChange}
            required
            disabled={loading}
          />
          <div className="mb-4 text-xs text-gray-600">
            <p className="font-semibold mb-1">Requisitos de contraseña:</p>
            <ul className="list-disc list-inside space-y-1">
              {getPasswordRequirements().map((req, idx) => (
                <li key={idx} className={validatePassword(values.password).errors.some(e => e.includes(req.split(' ')[0])) ? 'text-gray-400' : 'text-gray-600'}>
                  {req}
                </li>
              ))}
            </ul>
          </div>
          <PasswordInput
            label="Confirmar Contraseña"
            name="confirmPassword"
            value={values.confirmPassword}
            onChange={handleChange}
            required
            disabled={loading}
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

