import { useState, useEffect } from 'react';
import { entryService } from '../services/entryService.js';
import { productService } from '../services/productService.js';
import Card from '../components/Card.jsx';
import Button from '../components/Button.jsx';
import Input from '../components/Input.jsx';
import Modal from '../components/Modal.jsx';
import Table from '../components/Table.jsx';
import Loading from '../components/Loading.jsx';
import Alert from '../components/Alert.jsx';
import { useForm } from '../hooks/useForm.js';

const Entries = () => {
  const [entries, setEntries] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [alert, setAlert] = useState(null);
  const { values, handleChange, reset } = useForm({
    producto_id: '',
    cantidad: '',
    observaciones: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [entriesRes, productsRes] = await Promise.all([
        entryService.getAll(),
        productService.getAll()
      ]);
      setEntries(entriesRes.data.data);
      setProducts(productsRes.data.data);
    } catch (error) {
      setAlert({ type: 'error', message: 'Error al cargar datos' });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await entryService.create(values);
      setAlert({ type: 'success', message: 'Entrada registrada correctamente' });
      setIsModalOpen(false);
      reset();
      loadData();
    } catch (error) {
      setAlert({ type: 'error', message: error.response?.data?.message || 'Error al registrar entrada' });
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Entradas</h1>
        <Button onClick={() => setIsModalOpen(true)}>Nueva Entrada</Button>
      </div>

      {alert && <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />}

      <Card>
        <Table
          headers={['Fecha', 'Producto', 'Cantidad', 'Usuario', 'Observaciones']}
          data={entries}
          renderRow={(entry) => (
            <tr key={entry.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {new Date(entry.fecha).toLocaleString('es-MX')}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{entry.producto_nombre}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{entry.cantidad}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{entry.usuario_nombre}</td>
              <td className="px-6 py-4 text-sm text-gray-900">{entry.observaciones || '-'}</td>
            </tr>
          )}
        />
      </Card>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Nueva Entrada">
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
            label="Observaciones"
            name="observaciones"
            value={values.observaciones}
            onChange={handleChange}
          />
          <div className="mt-6 flex justify-end space-x-3">
            <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
            <Button type="submit">Registrar Entrada</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Entries;

