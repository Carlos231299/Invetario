import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  ChartBarIcon,
  ShoppingBagIcon,
  Squares2X2Icon,
  BuildingStorefrontIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ClipboardDocumentListIcon,
  UserGroupIcon,
  Bars3Icon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import {
  ChartBarIcon as ChartBarIconSolid,
  ShoppingBagIcon as ShoppingBagIconSolid,
  Squares2X2Icon as Squares2X2IconSolid,
  BuildingStorefrontIcon as BuildingStorefrontIconSolid,
  ArrowTrendingUpIcon as ArrowTrendingUpIconSolid,
  ArrowTrendingDownIcon as ArrowTrendingDownIconSolid,
  ClipboardDocumentListIcon as ClipboardDocumentListIconSolid,
  UserGroupIcon as UserGroupIconSolid
} from '@heroicons/react/24/solid';

const Sidebar = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    { 
      path: '/dashboard', 
      label: 'Dashboard', 
      icon: ChartBarIcon, 
      iconSolid: ChartBarIconSolid,
      color: 'blue',
      gradient: 'from-blue-500 to-blue-600'
    },
    { 
      path: '/products', 
      label: 'Productos', 
      icon: ShoppingBagIcon, 
      iconSolid: ShoppingBagIconSolid,
      color: 'green',
      gradient: 'from-green-500 to-emerald-600'
    },
    { 
      path: '/categories', 
      label: 'Categorías', 
      icon: Squares2X2Icon, 
      iconSolid: Squares2X2IconSolid,
      color: 'purple',
      gradient: 'from-purple-500 to-indigo-600'
    },
    { 
      path: '/suppliers', 
      label: 'Proveedores', 
      icon: BuildingStorefrontIcon, 
      iconSolid: BuildingStorefrontIconSolid,
      color: 'orange',
      gradient: 'from-orange-500 to-amber-600'
    },
    { 
      path: '/entries', 
      label: 'Entradas', 
      icon: ArrowTrendingUpIcon, 
      iconSolid: ArrowTrendingUpIconSolid,
      color: 'emerald',
      gradient: 'from-emerald-500 to-teal-600'
    },
    { 
      path: '/exits', 
      label: 'Salidas', 
      icon: ArrowTrendingDownIcon, 
      iconSolid: ArrowTrendingDownIconSolid,
      color: 'red',
      gradient: 'from-red-500 to-rose-600'
    },
    { 
      path: '/movements', 
      label: 'Movimientos', 
      icon: ClipboardDocumentListIcon, 
      iconSolid: ClipboardDocumentListIconSolid,
      color: 'indigo',
      gradient: 'from-indigo-500 to-blue-600'
    },
    { 
      path: '/users', 
      label: 'Usuarios', 
      icon: UserGroupIcon, 
      iconSolid: UserGroupIconSolid,
      color: 'pink',
      gradient: 'from-pink-500 to-rose-600'
    }
  ];

  const getColorClasses = (item, isActive) => {
    if (isActive) {
      return `bg-gradient-to-r ${item.gradient} text-white shadow-lg border-l-4 border-white/50`;
    }
    return `text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:${item.gradient} hover:text-white hover:shadow-md hover:border-l-4 hover:border-white/50 transition-all duration-200 border-l-4 border-transparent`;
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
          ${isCollapsed ? 'w-20' : 'w-72'} h-full
          bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700
          shadow-xl lg:shadow-lg
          z-50 lg:z-auto
          transform transition-all duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-600 to-blue-700">
          <div className="flex items-center justify-between">
            <div className={`flex items-center space-x-3 ${isCollapsed ? 'justify-center w-full' : ''}`}>
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg flex-shrink-0 ring-2 ring-white/30">
                <span className="text-white font-bold text-xl">IB</span>
              </div>
              {!isCollapsed && (
                <div>
                  <h2 className="text-base font-bold text-white">Inventario</h2>
                  <p className="text-xs text-blue-100">Ferretería Bastidas</p>
                </div>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="hidden lg:flex p-2 text-white/80 hover:text-white hover:bg-white/20 rounded-lg transition-all"
                aria-label={isCollapsed ? "Expandir menú" : "Colapsar menú"}
                title={isCollapsed ? "Expandir menú" : "Colapsar menú"}
              >
                <Bars3Icon className="h-5 w-5" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="lg:hidden p-2 text-white/80 hover:text-white hover:bg-white/20 rounded-lg transition-all"
                aria-label="Cerrar menú"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
        <nav className={`p-4 space-y-2 overflow-y-auto h-[calc(100vh-120px)] ${isCollapsed ? 'px-3' : 'px-4'}`}>
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            const IconComponent = isActive ? item.iconSolid : item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={`
                  flex items-center 
                  ${isCollapsed ? 'justify-center px-3' : 'px-4'} 
                  py-3.5 rounded-xl 
                  transition-all duration-300 
                  ${getColorClasses(item, isActive)}
                  ${isActive ? 'font-bold scale-105 shadow-lg' : 'font-semibold'} 
                  ${isCollapsed ? 'relative group' : ''}
                  transform hover:scale-105
                `}
                title={isCollapsed ? item.label : ''}
              >
                <IconComponent className={`h-6 w-6 ${isCollapsed ? '' : 'mr-3'} transition-transform flex-shrink-0 ${isActive ? 'scale-110' : ''}`} />
                {!isCollapsed && <span className="text-sm">{item.label}</span>}
                {isCollapsed && (
                  <div className="absolute left-full ml-3 px-4 py-2 bg-gray-900 dark:bg-gray-800 text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50 shadow-xl border border-gray-700">
                    {item.label}
                    <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-gray-900 dark:border-r-gray-800"></div>
                  </div>
                )}
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;

