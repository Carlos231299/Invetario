import { useState, useEffect } from 'react';
import Card from '../components/Card.jsx';
import Alert from '../components/Alert.jsx';
import { 
  BellIcon, 
  CheckCircleIcon, 
  XCircleIcon,
  InformationCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState('unread'); // all, unread, read
  const [expandedId, setExpandedId] = useState(null);

  // Notificaciones de ejemplo (en producción vendrían del backend)
  useEffect(() => {
    const mockNotifications = [
      {
        id: 1,
        type: 'success',
        title: 'Producto agregado',
        message: 'El producto "Martillo" ha sido agregado exitosamente',
        details: 'Producto: Martillo\nCódigo: MART-001\nCategoría: Herramientas\nStock inicial: 50 unidades\nPrecio de compra: $15,000\nPrecio de venta: $25,000',
        timestamp: new Date(Date.now() - 1000 * 60 * 5),
        read: false,
        actionUrl: '/products'
      },
      {
        id: 2,
        type: 'warning',
        title: 'Stock bajo',
        message: 'El producto "Clavos" tiene stock bajo (5 unidades)',
        details: 'Producto: Clavos\nCódigo: CLAV-002\nStock actual: 5 unidades\nStock mínimo: 20 unidades\nDéficit: 15 unidades\nSe recomienda realizar una orden de compra.',
        timestamp: new Date(Date.now() - 1000 * 60 * 30),
        read: false,
        actionUrl: '/products'
      },
      {
        id: 3,
        type: 'info',
        title: 'Nueva entrada',
        message: 'Se registró una nueva entrada de 50 unidades',
        details: 'Producto: Pintura Blanca\nCantidad: 50 unidades\nProveedor: Pinturas Colombia\nUsuario: Carlos Bastidas\nFecha: ' + new Date(Date.now() - 1000 * 60 * 60 * 2).toLocaleString(),
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
        read: true,
        actionUrl: '/entries'
      },
      {
        id: 4,
        type: 'error',
        title: 'Error en salida',
        message: 'No se pudo registrar la salida: stock insuficiente',
        details: 'Producto: Tornillos\nStock disponible: 10 unidades\nCantidad solicitada: 25 unidades\nDéficit: 15 unidades\nPor favor, verifica el stock disponible antes de realizar la salida.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5),
        read: true,
        actionUrl: '/exits'
      }
    ];
    setNotifications(mockNotifications);
  }, []);

  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircleIcon className="h-6 w-6 text-green-500" />;
      case 'error':
        return <XCircleIcon className="h-6 w-6 text-red-500" />;
      case 'warning':
        return <ExclamationTriangleIcon className="h-6 w-6 text-yellow-500" />;
      default:
        return <InformationCircleIcon className="h-6 w-6 text-blue-500" />;
    }
  };

  const getBgColor = (type) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200';
      default:
        return 'bg-blue-50 border-blue-200';
    }
  };

  const markAsRead = (id) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
    // Si el filtro es solo sin leer, cambiar a todas después de marcar como leída
    if (filter === 'unread') {
      setTimeout(() => setFilter('all'), 500);
    }
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
    // Cambiar filtro a todas después de marcar todas como leídas
    setTimeout(() => setFilter('all'), 500);
  };

  const deleteNotification = (id) => {
    setNotifications(notifications.filter(n => n.id !== id));
    if (expandedId === id) {
      setExpandedId(null);
    }
  };

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const filteredNotifications = notifications.filter(n => {
    if (filter === 'unread') return !n.read;
    if (filter === 'read') return n.read;
    return true;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  const formatTime = (date) => {
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 1) return 'Hace un momento';
    if (minutes < 60) return `Hace ${minutes} minuto${minutes > 1 ? 's' : ''}`;
    if (hours < 24) return `Hace ${hours} hora${hours > 1 ? 's' : ''}`;
    return `Hace ${days} día${days > 1 ? 's' : ''}`;
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Notificaciones</h1>
          {unreadCount > 0 && (
            <p className="text-sm text-gray-500 mt-1">
              {unreadCount} notificación{unreadCount > 1 ? 'es' : ''} sin leer
            </p>
          )}
        </div>
        <div className="flex space-x-2">
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
            >
              Marcar todas como leídas
            </button>
          )}
        </div>
      </div>

      {/* Filtros */}
      <div className="mb-4 flex space-x-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            filter === 'all' 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Todas
        </button>
        <button
          onClick={() => setFilter('unread')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            filter === 'unread' 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Sin leer ({unreadCount})
        </button>
        <button
          onClick={() => setFilter('read')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            filter === 'read' 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Leídas
        </button>
      </div>

      <Card>
        {filteredNotifications.length === 0 ? (
          <div className="text-center py-12">
            <BellIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No hay notificaciones</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 rounded-lg border ${getBgColor(notification.type)} ${
                  !notification.read ? 'ring-2 ring-blue-500' : ''
                } cursor-pointer hover:shadow-md transition-shadow`}
                onClick={() => toggleExpand(notification.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1">
                    <div className="mt-1">
                      {getIcon(notification.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-gray-900">{notification.title}</h3>
                        <div className="flex items-center space-x-2">
                          {!notification.read && (
                            <span className="px-2 py-1 bg-blue-600 text-white text-xs rounded-full">
                              Nuevo
                            </span>
                          )}
                          {notification.details && (
                            <span className="text-xs text-gray-500">
                              {expandedId === notification.id ? '▼' : '▶'}
                            </span>
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                      {expandedId === notification.id && notification.details && (
                        <div className="mt-3 p-3 bg-white bg-opacity-50 rounded-lg border border-gray-200">
                          <p className="text-sm text-gray-700 whitespace-pre-line">{notification.details}</p>
                          {notification.actionUrl && (
                            <a
                              href={notification.actionUrl}
                              onClick={(e) => e.stopPropagation()}
                              className="mt-2 inline-block text-sm text-blue-600 hover:text-blue-800 font-medium"
                            >
                              Ver detalles →
                            </a>
                          )}
                        </div>
                      )}
                      <p className="text-xs text-gray-500 mt-2">{formatTime(notification.timestamp)}</p>
                    </div>
                  </div>
                  <div className="flex space-x-2 ml-4" onClick={(e) => e.stopPropagation()}>
                    {!notification.read && (
                      <button
                        onClick={() => markAsRead(notification.id)}
                        className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Marcar como leída"
                      >
                        <CheckCircleIcon className="h-5 w-5" />
                      </button>
                    )}
                    <button
                      onClick={() => deleteNotification(notification.id)}
                      className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Eliminar"
                    >
                      <XCircleIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};

export default Notifications;

