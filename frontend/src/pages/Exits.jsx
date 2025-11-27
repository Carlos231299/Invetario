import { useState, useEffect } from 'react';
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
    try {
      await exitService.create(values);
      setAlert({ type: 'success', message: 'Salida registrada correctamente' });
      setIsModalOpen(false);
      reset();
      loadData();
    } catch (error) {
      setAlert({ type: 'error', message: error.response?.data?.message || 'Error al registrar salida' });
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Salidas</h1>
        <Button onClick={() => setIsModalOpen(true)}>Nueva Salida</Button>
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
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Producto</label>
            <select
              name="producto_id"
              value={values.producto_id}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-4"
              required
            >
              <option value="">Seleccionar producto...</option>
              {products.map(product => (
                <option key={product.id} value={product.id}>{product.nombre} (Stock: {product.stock})</option>
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
          />
          <Input
            label="Motivo"
            name="motivo"
            value={values.motivo}
            onChange={handleChange}
            required
          />
          <Input
            label="Observaciones"
            name="observaciones"
            value={values.observaciones}
            onChange={handleChange}
          />
          <div className="mt-6 flex justify-end space-x-3">
            <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
            <Button type="submit">Registrar Salida</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Exits;

