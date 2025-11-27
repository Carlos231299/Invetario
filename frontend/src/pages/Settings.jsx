import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth.js';
import { useTheme } from '../hooks/useTheme.js';
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
  const { theme, changeTheme } = useTheme();
  const [activeTab, setActiveTab] = useState('profile');
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nombre: user?.nombre || '',
    email: user?.email || '',
    avatar: user?.avatar || null,
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    notifications: {
      email: true,
      push: false,
      lowStock: true
    },
    theme: theme
  });

  // Sincronizar tema cuando cambie
  useEffect(() => {
    setFormData(prev => ({ ...prev, theme }));
  }, [theme]);

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
                  {/* Avatar */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Foto de Perfil
                    </label>
                    <div className="flex items-center space-x-4">
                      <div className="relative">
                        {formData.avatar ? (
                          <img
                            src={formData.avatar}
                            alt="Avatar"
                            className="w-24 h-24 rounded-full object-cover border-4 border-gray-200 dark:border-gray-700"
                          />
                        ) : (
                          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold border-4 border-gray-200 dark:border-gray-700">
                            {user?.nombre?.charAt(0).toUpperCase() || 'U'}
                          </div>
                        )}
                        <label
                          htmlFor="avatar-upload"
                          className="absolute bottom-0 right-0 bg-blue-600 text-white rounded-full p-2 cursor-pointer hover:bg-blue-700 transition-colors shadow-lg"
                          title="Cambiar foto"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        </label>
                        <input
                          id="avatar-upload"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files[0];
                            if (file) {
                              if (file.size > 2 * 1024 * 1024) {
                                setAlert({ type: 'error', message: 'La imagen debe ser menor a 2MB' });
                                return;
                              }
                              const reader = new FileReader();
                              reader.onloadend = () => {
                                setFormData(prev => ({ ...prev, avatar: reader.result }));
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Haz clic en el ícono de cámara para cambiar tu foto de perfil.
                        </p>
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                          Formatos soportados: JPG, PNG, GIF. Tamaño máximo: 2MB
                        </p>
                        {formData.avatar && (
                          <button
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, avatar: null }))}
                            className="mt-2 text-sm text-red-600 hover:text-red-700 dark:text-red-400"
                          >
                            Eliminar foto
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
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
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Tema</label>
                    <select
                      name="theme"
                      value={formData.theme}
                      onChange={(e) => {
                        const newTheme = e.target.value;
                        setFormData(prev => ({ ...prev, theme: newTheme }));
                        changeTheme(newTheme);
                        setAlert({ type: 'success', message: 'Tema actualizado correctamente' });
                      }}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                    >
                      <option value="light">Claro</option>
                      <option value="dark">Oscuro</option>
                    </select>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                      El tema se aplica inmediatamente y se guarda automáticamente.
                    </p>
                  </div>
                  <div className="p-4 bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-700 rounded-lg">
                    <h3 className="font-medium text-blue-900 dark:text-blue-100 mb-2">Vista previa</h3>
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      El tema actual es: <strong>{formData.theme === 'dark' ? 'Oscuro' : 'Claro'}</strong>
                    </p>
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

