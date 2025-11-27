import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  HomeIcon,
  CubeIcon,
  FolderIcon,
  BuildingOfficeIcon,
  ArrowUpTrayIcon,
  ArrowDownTrayIcon,
  DocumentTextIcon,
  UsersIcon,
  Bars3Icon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import {
  HomeIcon as HomeIconSolid,
  CubeIcon as CubeIconSolid,
  FolderIcon as FolderIconSolid,
  BuildingOfficeIcon as BuildingOfficeIconSolid,
  ArrowUpTrayIcon as ArrowUpTrayIconSolid,
  ArrowDownTrayIcon as ArrowDownTrayIconSolid,
  DocumentTextIcon as DocumentTextIconSolid,
  UsersIcon as UsersIconSolid
} from '@heroicons/react/24/solid';

const Sidebar = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { 
      path: '/dashboard', 
      label: 'Dashboard', 
      icon: HomeIcon, 
      iconSolid: HomeIconSolid,
      color: 'blue'
    },
    { 
      path: '/products', 
      label: 'Productos', 
      icon: CubeIcon, 
      iconSolid: CubeIconSolid,
      color: 'green'
    },
    { 
      path: '/categories', 
      label: 'Categorías', 
      icon: FolderIcon, 
      iconSolid: FolderIconSolid,
      color: 'purple'
    },
    { 
      path: '/suppliers', 
      label: 'Proveedores', 
      icon: BuildingOfficeIcon, 
      iconSolid: BuildingOfficeIconSolid,
      color: 'orange'
    },
    { 
      path: '/entries', 
      label: 'Entradas', 
      icon: ArrowUpTrayIcon, 
      iconSolid: ArrowUpTrayIconSolid,
      color: 'emerald'
    },
    { 
      path: '/exits', 
      label: 'Salidas', 
      icon: ArrowDownTrayIcon, 
      iconSolid: ArrowDownTrayIconSolid,
      color: 'red'
    },
    { 
      path: '/movements', 
      label: 'Movimientos', 
      icon: DocumentTextIcon, 
      iconSolid: DocumentTextIconSolid,
      color: 'indigo'
    },
    { 
      path: '/users', 
      label: 'Usuarios', 
      icon: UsersIcon, 
      iconSolid: UsersIconSolid,
      color: 'pink'
    }
  ];

  const getColorClasses = (color, isActive) => {
    const colors = {
      blue: isActive ? 'bg-blue-50 text-blue-700 border-blue-200' : 'text-gray-600 hover:bg-blue-50 hover:text-blue-700',
      green: isActive ? 'bg-green-50 text-green-700 border-green-200' : 'text-gray-600 hover:bg-green-50 hover:text-green-700',
      purple: isActive ? 'bg-purple-50 text-purple-700 border-purple-200' : 'text-gray-600 hover:bg-purple-50 hover:text-purple-700',
      orange: isActive ? 'bg-orange-50 text-orange-700 border-orange-200' : 'text-gray-600 hover:bg-orange-50 hover:text-orange-700',
      emerald: isActive ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'text-gray-600 hover:bg-emerald-50 hover:text-emerald-700',
      red: isActive ? 'bg-red-50 text-red-700 border-red-200' : 'text-gray-600 hover:bg-red-50 hover:text-red-700',
      indigo: isActive ? 'bg-indigo-50 text-indigo-700 border-indigo-200' : 'text-gray-600 hover:bg-indigo-50 hover:text-indigo-700',
      pink: isActive ? 'bg-pink-50 text-pink-700 border-pink-200' : 'text-gray-600 hover:bg-pink-50 hover:text-pink-700'
    };
    return colors[color] || colors.blue;
  };

  return (
    <>
      {/* Botón móvil para abrir/cerrar */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-lg border border-gray-200 hover:bg-gray-50 transition-colors"
        aria-label="Toggle menu"
      >
        {isOpen ? (
          <XMarkIcon className="h-6 w-6 text-gray-700" />
        ) : (
          <Bars3Icon className="h-6 w-6 text-gray-700" />
        )}
      </button>

      {/* Overlay para móvil */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static
          top-0 left-0
          w-64 h-full
          bg-white border-r border-gray-200
          shadow-lg lg:shadow-sm
          z-50 lg:z-auto
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center shadow-md">
                <span className="text-white font-bold text-lg">IB</span>
              </div>
              <div>
                <h2 className="text-sm font-bold text-gray-900">Inventario</h2>
                <p className="text-xs text-gray-500">Ferretería Bastidas</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="lg:hidden p-1 text-gray-500 hover:text-gray-700"
              aria-label="Cerrar menú"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
        <nav className="p-4 space-y-1 overflow-y-auto h-[calc(100vh-100px)]">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            const IconComponent = isActive ? item.iconSolid : item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={`flex items-center px-4 py-3 rounded-lg transition-all duration-200 border-l-4 ${
                  getColorClasses(item.color, isActive)
                } ${isActive ? 'font-semibold shadow-sm' : 'font-medium'}`}
              >
                <IconComponent className={`h-5 w-5 mr-3 ${isActive ? 'scale-110' : ''} transition-transform`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;

