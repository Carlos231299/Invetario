import { useState, useEffect } from 'react';
import { supplierService } from '../services/supplierService.js';
import Card from '../components/Card.jsx';
import Button from '../components/Button.jsx';
import Input from '../components/Input.jsx';
import Modal from '../components/Modal.jsx';
import Table from '../components/Table.jsx';
import Loading from '../components/Loading.jsx';
import Alert from '../components/Alert.jsx';
import { useForm } from '../hooks/useForm.js';

const Suppliers = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState(null);
  const [alert, setAlert] = useState(null);
  const { values, handleChange, setValue, reset } = useForm({
    nombre: '',
    contacto: '',
    telefono: '',
    email: '',
    direccion: ''
  });

  useEffect(() => {
    loadSuppliers();
  }, []);

  const loadSuppliers = async () => {
    try {
      const response = await supplierService.getAll();
      setSuppliers(response.data.data);
    } catch (error) {
      setAlert({ type: 'error', message: 'Error al cargar proveedores' });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (supplier = null) => {
    if (supplier) {
      setEditingSupplier(supplier);
      Object.keys(supplier).forEach(key => {
        if (values.hasOwnProperty(key)) {
          setValue(key, supplier[key] || '');
        }
      });
    } else {
      setEditingSupplier(null);
      reset();
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingSupplier) {
        await supplierService.update(editingSupplier.id, values);
        setAlert({ type: 'success', message: 'Proveedor actualizado correctamente' });
      } else {
        await supplierService.create(values);
        setAlert({ type: 'success', message: 'Proveedor creado correctamente' });
      }
      setIsModalOpen(false);
      loadSuppliers();
    } catch (error) {
      setAlert({ type: 'error', message: error.response?.data?.message || 'Error al guardar proveedor' });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar este proveedor?')) return;
    try {
      await supplierService.delete(id);
      setAlert({ type: 'success', message: 'Proveedor eliminado correctamente' });
      loadSuppliers();
    } catch (error) {
      setAlert({ type: 'error', message: 'Error al eliminar proveedor' });
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Proveedores</h1>
        <Button onClick={() => handleOpenModal()}>Nuevo Proveedor</Button>
      </div>

      {alert && <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />}

      <Card>
        <Table
          headers={['Nombre', 'Contacto', 'Teléfono', 'Email', 'Acciones']}
          data={suppliers}
          renderRow={(supplier) => (
            <tr key={supplier.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{supplier.nombre}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{supplier.contacto || '-'}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{supplier.telefono || '-'}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{supplier.email || '-'}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                <Button variant="secondary" onClick={() => handleOpenModal(supplier)}>Editar</Button>
                <Button variant="danger" onClick={() => handleDelete(supplier.id)}>Eliminar</Button>
              </td>
            </tr>
          )}
        />
      </Card>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingSupplier ? 'Editar Proveedor' : 'Nuevo Proveedor'} size="lg">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Nombre" name="nombre" value={values.nombre} onChange={handleChange} required />
            <Input label="Contacto" name="contacto" value={values.contacto} onChange={handleChange} />
            <Input label="Teléfono" name="telefono" value={values.telefono} onChange={handleChange} />
            <Input label="Email" name="email" type="email" value={values.email} onChange={handleChange} />
            <div className="col-span-2">
              <Input label="Dirección" name="direccion" value={values.direccion} onChange={handleChange} />
            </div>
          </div>
          <div className="mt-6 flex justify-end space-x-3">
            <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
            <Button type="submit">{editingSupplier ? 'Actualizar' : 'Crear'}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Suppliers;

