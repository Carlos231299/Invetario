import { useState, useEffect } from 'react';
import { movementService } from '../services/movementService.js';
import Card from '../components/Card.jsx';
import Table from '../components/Table.jsx';
import Loading from '../components/Loading.jsx';
import Alert from '../components/Alert.jsx';

const Movements = () => {
  const [movements, setMovements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadMovements();
  }, []);

  const loadMovements = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await movementService.getAll();
      
      if (response?.data?.success && response.data.data) {
        setMovements(Array.isArray(response.data.data) ? response.data.data : []);
      } else {
        setMovements([]);
      }
    } catch (err) {
      console.error('Error al cargar movimientos:', err);
      setError(err.response?.data?.message || 'Error al cargar movimientos. Por favor, intenta nuevamente.');
      setMovements([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />;
  if (error) return <Alert type="error" message={error} />;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Historial de Movimientos</h1>

      <Card>
        <Table
          headers={['Fecha', 'Tipo', 'Producto', 'Cantidad', 'Usuario', 'Detalle']}
          data={movements}
          renderRow={(movement) => (
            <tr key={movement.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {new Date(movement.fecha).toLocaleString('es-MX')}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                <span className={`px-2 py-1 rounded-full text-xs ${
                  movement.tipo === 'entrada' ? 'bg-green-100 text-green-800' :
                  movement.tipo === 'salida' ? 'bg-red-100 text-red-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {movement.tipo}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{movement.producto_nombre || '-'}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{movement.cantidad || '-'}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{movement.usuario_nombre || '-'}</td>
              <td className="px-6 py-4 text-sm text-gray-900">{movement.detalle || '-'}</td>
            </tr>
          )}
        />
      </Card>
    </div>
  );
};

export default Movements;

