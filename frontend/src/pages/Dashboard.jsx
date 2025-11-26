import { useEffect, useState } from 'react';
import { dashboardService } from '../services/dashboardService.js';
import Card from '../components/Card.jsx';
import Loading from '../components/Loading.jsx';
import Alert from '../components/Alert.jsx';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await dashboardService.getStats();
        setStats(response.data.data);
      } catch (err) {
        setError('Error al cargar estadísticas');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <Loading />;
  if (error) return <Alert type="error" message={error} />;
  if (!stats) return null;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <Card>
          <div className="text-center">
            <p className="text-gray-600 text-sm">Total Productos</p>
            <p className="text-3xl font-bold text-blue-600">{stats.productos.total}</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-gray-600 text-sm">Stock Bajo</p>
            <p className="text-3xl font-bold text-red-600">{stats.productos.stockBajo}</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-gray-600 text-sm">Categorías</p>
            <p className="text-3xl font-bold text-green-600">{stats.categorias}</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-gray-600 text-sm">Proveedores</p>
            <p className="text-3xl font-bold text-purple-600">{stats.proveedores}</p>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card title="Valor del Inventario">
          <p className="text-2xl font-bold text-gray-900">
            ${parseFloat(stats.inventario.valorTotal || 0).toLocaleString('es-MX', { minimumFractionDigits: 2 })}
          </p>
        </Card>
        <Card title="Movimientos del Mes">
          <div className="space-y-2">
            <p className="text-sm text-gray-600">
              Entradas: <span className="font-semibold text-green-600">{stats.movimientos.mesActual.entradas}</span>
            </p>
            <p className="text-sm text-gray-600">
              Salidas: <span className="font-semibold text-red-600">{stats.movimientos.mesActual.salidas}</span>
            </p>
          </div>
        </Card>
      </div>

      {stats.productosStockBajo.length > 0 && (
        <Card title="Productos con Stock Bajo" className="mb-6">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Código</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nombre</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock Mínimo</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {stats.productosStockBajo.map((producto) => (
                  <tr key={producto.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{producto.codigo}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{producto.nombre}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 font-semibold">{producto.stock}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{producto.stock_minimo}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      <Card title="Movimientos Recientes">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tipo</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Producto</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cantidad</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Usuario</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {stats.movimientos.recientes.map((movimiento) => (
                <tr key={movimiento.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(movimiento.fecha).toLocaleString('es-MX')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      movimiento.tipo === 'entrada' ? 'bg-green-100 text-green-800' :
                      movimiento.tipo === 'salida' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {movimiento.tipo}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{movimiento.producto_nombre}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{movimiento.cantidad}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{movimiento.usuario_nombre}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;

