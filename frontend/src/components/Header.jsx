import { useState } from 'react';
import { useAuth } from '../hooks/useAuth.js';
import { useLocation } from 'react-router-dom';
import { 
  UserCircleIcon, 
  ArrowRightOnRectangleIcon,
  BellIcon,
  Cog6ToothIcon
} from '@heroicons/react/24/outline';
import Button from './Button.jsx';
import ConfirmDialog from './ConfirmDialog.jsx';

const Header = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleLogout = () => {
    logout();
  };

  const getPageTitle = () => {
    const titles = {
      '/dashboard': 'Dashboard',
      '/products': 'Productos',
      '/categories': 'Categorías',
      '/suppliers': 'Proveedores',
      '/entries': 'Entradas',
      '/exits': 'Salidas',
      '/movements': 'Movimientos',
      '/users': 'Usuarios'
    };
    return titles[location.pathname] || 'Inventario';
  };

  return (
    <>
      <header className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-50 backdrop-blur-sm bg-white/95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center shadow-md">
                  <span className="text-white font-bold text-lg">IB</span>
                </div>
                <div>
                  <h1 className="text-lg font-bold text-gray-900">Ferretería Bastidas</h1>
                  <p className="text-xs text-gray-500">{getPageTitle()}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-3 px-4 py-2 bg-gray-50 rounded-lg border border-gray-200">
                <UserCircleIcon className="h-5 w-5 text-gray-600" />
                <div className="text-sm">
                  <p className="font-semibold text-gray-900">{user?.nombre}</p>
                  <p className="text-xs text-gray-500">{user?.rol}</p>
                </div>
              </div>
              <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                <BellIcon className="h-5 w-5" />
              </button>
              <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                <Cog6ToothIcon className="h-5 w-5" />
              </button>
              <Button 
                onClick={() => setShowLogoutConfirm(true)} 
                variant="secondary" 
                className="text-sm flex items-center space-x-2"
              >
                <ArrowRightOnRectangleIcon className="h-4 w-4" />
                <span>Salir</span>
              </Button>
            </div>
          </div>
        </div>
      </header>
      <ConfirmDialog
        isOpen={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
        onConfirm={handleLogout}
        title="Cerrar Sesión"
        message="¿Estás seguro de que deseas cerrar sesión?"
        confirmText="Sí, cerrar sesión"
        cancelText="Cancelar"
        variant="warning"
      />
    </>
  );
};

export default Header;

