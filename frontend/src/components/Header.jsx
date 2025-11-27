import { useState } from 'react';
import { useAuth } from '../hooks/useAuth.js';
import Button from './Button.jsx';
import ConfirmDialog from './ConfirmDialog.jsx';

const Header = () => {
  const { user, logout } = useAuth();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleLogout = () => {
    logout();
  };

  return (
    <>
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">Inventario Ferretería Bastidas</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">
                {user?.nombre} ({user?.rol})
              </span>
              <Button onClick={() => setShowLogoutConfirm(true)} variant="secondary" className="text-sm">
                Cerrar Sesión
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

