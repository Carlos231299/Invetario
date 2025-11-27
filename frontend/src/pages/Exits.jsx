import { useState, useEffect } from 'react';
import { ArrowTrendingDownIcon } from '@heroicons/react/24/outline';
import { exitService } from '../services/exitService.js';
import { productService } from '../services/productService.js';
import Card from '../components/Card.jsx';
import Button from '../components/Button.jsx';
import Input from '../components/Input.jsx';
import Modal from '../components/Modal.jsx';
import Table from '../components/Table.jsx';
import Loading from '../components/Loading.jsx';
import Alert from '../components/Alert.jsx';
import { useForm } from '../hooks/useForm.js';

const Exits = () => {
  const [exits, setExits] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [alert, setAlert] = useState(null);
  const { values, handleChange, reset } = useForm({
    producto_id: '',
    cantidad: '',
    motivo: '',
    observaciones: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [exitsRes, productsRes] = await Promise.all([
        exitService.getAll(),
        productService.getAll()
      ]);
      
      if (exitsRes?.data?.success && exitsRes.data.data) {
        setExits(Array.isArray(exitsRes.data.data) ? exitsRes.data.data : []);
      } else {
        setExits([]);
      }
      
      if (productsRes?.data?.success && productsRes.data.data) {
        setProducts(Array.isArray(productsRes.data.data) ? productsRes.data.data : []);
      } else {
        setProducts([]);
      }
    } catch (error) {
      console.error('Error al cargar datos:', error);
      setAlert({ 
        type: 'error', 
        message: error.response?.data?.message || 'Error al cargar datos. Por favor, intenta nuevamente.' 
      });
      setExits([]);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validaciones
    if (!values.producto_id || values.producto_id === '') {
      setAlert({ type: 'error', message: 'Por favor, selecciona un producto' });
      return;
    }
    
    const cantidad = parseInt(values.cantidad);
    if (!values.cantidad || isNaN(cantidad) || cantidad <= 0) {
      setAlert({ type: 'error', message: 'La cantidad debe ser un número mayor a 0' });
      return;
    }

    if (!values.motivo || values.motivo.trim() === '') {
      setAlert({ type: 'error', message: 'Por favor, ingresa un motivo para la salida' });
      return;
    }

    // Verificar stock disponible
    const selectedProduct = products.find(p => p.id === parseInt(values.producto_id));
    if (selectedProduct && selectedProduct.stock < cantidad) {
      setAlert({ 
        type: 'error', 
        message: `Stock insuficiente. Stock disponible: ${selectedProduct.stock}, cantidad solicitada: ${cantidad}` 
      });
      return;
    }

    setLoading(true);
    setAlert(null);

    try {
      const payload = {
        producto_id: parseInt(values.producto_id),
        cantidad: cantidad,
        motivo: values.motivo.trim(),
        observaciones: values.observaciones?.trim() || ''
      };

      console.log('Enviando salida:', payload);
      
      const response = await exitService.create(payload);
      
      console.log('Respuesta del servidor:', response);
      
      if (response?.data?.success) {
        setAlert({ type: 'success', message: response.data.message || 'Salida registrada correctamente' });
        setIsModalOpen(false);
        reset();
        setTimeout(() => {
          loadData();
        }, 500);
      } else {
        const errorMsg = response?.data?.message || 
                        response?.data?.errors?.[0]?.msg || 
                        'Error al registrar salida';
        setAlert({ type: 'error', message: errorMsg });
      }
    } catch (error) {
      console.error('Error completo al registrar salida:', error);
      console.error('Error response:', error.response);
      
      let errorMessage = 'Error al registrar salida. Por favor, verifica los datos e intenta nuevamente.';
      
      if (error.response?.data) {
        if (error.response.data.message) {
          errorMessage = error.response.data.message;
        } else if (error.response.data.errors && Array.isArray(error.response.data.errors)) {
          errorMessage = error.response.data.errors.map(e => e.msg || e.message).join(', ');
        }
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setAlert({ type: 'error', message: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Salidas</h1>
          <p className="text-gray-600 dark:text-gray-400">Gestiona las salidas de productos del inventario</p>
        </div>
        <Button 
          onClick={() => setIsModalOpen(true)}
          className="bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 shadow-lg hover:shadow-xl transition-all"
        >
          <ArrowTrendingDownIcon className="h-5 w-5 mr-2" />
          Nueva Salida
        </Button>
      </div>

      {alert && <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />}

      <Card>
        <Table
          headers={['Fecha', 'Producto', 'Cantidad', 'Motivo', 'Usuario', 'Observaciones']}
          data={exits}
          renderRow={(exit) => (
            <tr key={exit.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {new Date(exit.fecha).toLocaleString('es-MX')}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{exit.producto_nombre}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{exit.cantidad}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{exit.motivo}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{exit.usuario_nombre}</td>
              <td className="px-6 py-4 text-sm text-gray-900">{exit.observaciones || '-'}</td>
            </tr>
          )}
        />
      </Card>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Nueva Salida">
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Producto <span className="text-red-500">*</span>
              </label>
              <select
                name="producto_id"
                value={values.producto_id}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 dark:bg-gray-800 dark:text-white transition-all"
                required
                disabled={loading}
              >
                <option value="">Seleccionar producto...</option>
                {products.map(product => (
                  <option key={product.id} value={product.id}>
                    {product.nombre} (Stock: {product.stock})
                  </option>
                ))}
              </select>
            </div>
            <Input
              label="Cantidad"
              name="cantidad"
              type="number"
              min="1"
              value={values.cantidad}
              onChange={handleChange}
              required
              disabled={loading}
            />
            <Input
              label="Motivo"
              name="motivo"
              value={values.motivo}
              onChange={handleChange}
              required
              disabled={loading}
            />
            <Input
              label="Observaciones"
              name="observaciones"
              value={values.observaciones}
              onChange={handleChange}
              disabled={loading}
            />
          </div>
          <div className="mt-6 flex justify-end space-x-3">
            <Button 
              type="button" 
              variant="secondary" 
              onClick={() => setIsModalOpen(false)}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Registrando...' : 'Registrar Salida'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Exits;

