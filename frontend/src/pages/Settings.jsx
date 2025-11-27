import { useState } from 'react';
import { useAuth } from '../hooks/useAuth.js';
import Card from '../components/Card.jsx';
import Button from '../components/Button.jsx';
import Input from '../components/Input.jsx';
import Alert from '../components/Alert.jsx';
import { 
  UserCircleIcon,
  KeyIcon,
  BellIcon,
  PaintBrushIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';

const Settings = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nombre: user?.nombre || '',
    email: user?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    notifications: {
      email: true,
      push: false,
      lowStock: true
    },
    theme: 'light'
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: checked
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAlert(null);

    try {
      // Aquí iría la llamada al API
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulación
      setAlert({ type: 'success', message: 'Perfil actualizado correctamente' });
    } catch (error) {
      setAlert({ type: 'error', message: 'Error al actualizar perfil' });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAlert(null);

    if (formData.newPassword !== formData.confirmPassword) {
      setAlert({ type: 'error', message: 'Las contraseñas no coinciden' });
      setLoading(false);
      return;
    }

    if (formData.newPassword.length < 8) {
      setAlert({ type: 'error', message: 'La contraseña debe tener al menos 8 caracteres' });
      setLoading(false);
      return;
    }

    try {
      // Aquí iría la llamada al API
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulación
      setAlert({ type: 'success', message: 'Contraseña actualizada correctamente' });
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));
    } catch (error) {
      setAlert({ type: 'error', message: 'Error al actualizar contraseña' });
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationsSave = async () => {
    setLoading(true);
    setAlert(null);

    try {
      // Aquí iría la llamada al API
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulación
      setAlert({ type: 'success', message: 'Preferencias de notificaciones guardadas' });
    } catch (error) {
      setAlert({ type: 'error', message: 'Error al guardar preferencias' });
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'profile', label: 'Perfil', icon: UserCircleIcon },
    { id: 'password', label: 'Contraseña', icon: KeyIcon },
    { id: 'notifications', label: 'Notificaciones', icon: BellIcon },
    { id: 'appearance', label: 'Apariencia', icon: PaintBrushIcon },
    { id: 'security', label: 'Seguridad', icon: ShieldCheckIcon }
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Configuración</h1>

      {alert && <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />}

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar de pestañas */}
        <div className="lg:w-64">
          <Card>
            <nav className="space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                      activeTab === tab.id
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </Card>
        </div>

        {/* Contenido */}
        <div className="flex-1">
          <Card>
            {/* Perfil */}
            {activeTab === 'profile' && (
              <form onSubmit={handleProfileUpdate}>
                <h2 className="text-xl font-semibold mb-4">Información del Perfil</h2>
                <div className="space-y-4">
                  <Input
                    label="Nombre"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    required
                  />
                  <Input
                    label="Email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    disabled
                  />
                  <div className="pt-4">
                    <Button type="submit" disabled={loading}>
                      {loading ? 'Guardando...' : 'Guardar Cambios'}
                    </Button>
                  </div>
                </div>
              </form>
            )}

            {/* Contraseña */}
            {activeTab === 'password' && (
              <form onSubmit={handlePasswordChange}>
                <h2 className="text-xl font-semibold mb-4">Cambiar Contraseña</h2>
                <div className="space-y-4">
                  <Input
                    label="Contraseña Actual"
                    name="currentPassword"
                    type="password"
                    value={formData.currentPassword}
                    onChange={handleChange}
                    required
                  />
                  <Input
                    label="Nueva Contraseña"
                    name="newPassword"
                    type="password"
                    value={formData.newPassword}
                    onChange={handleChange}
                    required
                    minLength={8}
                  />
                  <Input
                    label="Confirmar Nueva Contraseña"
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    minLength={8}
                  />
                  <div className="pt-4">
                    <Button type="submit" disabled={loading}>
                      {loading ? 'Actualizando...' : 'Actualizar Contraseña'}
                    </Button>
                  </div>
                </div>
              </form>
            )}

            {/* Notificaciones */}
            {activeTab === 'notifications' && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Preferencias de Notificaciones</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h3 className="font-medium">Notificaciones por Email</h3>
                      <p className="text-sm text-gray-500">Recibe notificaciones importantes por correo</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        name="notifications.email"
                        checked={formData.notifications.email}
                        onChange={handleChange}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h3 className="font-medium">Notificaciones Push</h3>
                      <p className="text-sm text-gray-500">Recibe notificaciones en tiempo real</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        name="notifications.push"
                        checked={formData.notifications.push}
                        onChange={handleChange}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h3 className="font-medium">Alertas de Stock Bajo</h3>
                      <p className="text-sm text-gray-500">Notificaciones cuando un producto tiene stock bajo</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        name="notifications.lowStock"
                        checked={formData.notifications.lowStock}
                        onChange={handleChange}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                  <div className="pt-4">
                    <Button onClick={handleNotificationsSave} disabled={loading}>
                      {loading ? 'Guardando...' : 'Guardar Preferencias'}
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Apariencia */}
            {activeTab === 'appearance' && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Apariencia</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tema</label>
                    <select
                      name="theme"
                      value={formData.theme}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    >
                      <option value="light">Claro</option>
                      <option value="dark">Oscuro</option>
                      <option value="auto">Automático</option>
                    </select>
                  </div>
                  <div className="pt-4">
                    <Button disabled={loading}>
                      {loading ? 'Guardando...' : 'Guardar Preferencias'}
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Seguridad */}
            {activeTab === 'security' && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Seguridad</h2>
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h3 className="font-medium text-blue-900 mb-2">Sesión Activa</h3>
                    <p className="text-sm text-blue-700">
                      Tu sesión se cerrará automáticamente después de 5 minutos de inactividad por seguridad.
                    </p>
                  </div>
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <h3 className="font-medium text-green-900 mb-2">Autenticación</h3>
                    <p className="text-sm text-green-700">
                      Tu cuenta está protegida con autenticación JWT y contraseñas encriptadas.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Settings;

