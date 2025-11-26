import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();

  const menuItems = [
    { path: '/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/products', label: 'Productos', icon: '📦' },
    { path: '/categories', label: 'Categorías', icon: '📁' },
    { path: '/suppliers', label: 'Proveedores', icon: '🏢' },
    { path: '/entries', label: 'Entradas', icon: '⬆️' },
    { path: '/exits', label: 'Salidas', icon: '⬇️' },
    { path: '/movements', label: 'Movimientos', icon: '📋' },
    { path: '/users', label: 'Usuarios', icon: '👥' }
  ];

  return (
    <aside className="w-64 bg-gray-800 min-h-screen">
      <nav className="mt-5 px-2">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center px-4 py-3 text-gray-300 rounded-lg mb-1 transition-colors ${
                isActive
                  ? 'bg-gray-900 text-white'
                  : 'hover:bg-gray-700 hover:text-white'
              }`}
            >
              <span className="mr-3">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;

