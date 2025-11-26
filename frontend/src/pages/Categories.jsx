import { useState, useEffect } from 'react';
import { categoryService } from '../services/categoryService.js';
import Card from '../components/Card.jsx';
import Button from '../components/Button.jsx';
import Input from '../components/Input.jsx';
import Modal from '../components/Modal.jsx';
import Table from '../components/Table.jsx';
import Loading from '../components/Loading.jsx';
import Alert from '../components/Alert.jsx';
import { useForm } from '../hooks/useForm.js';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [alert, setAlert] = useState(null);
  const { values, handleChange, setValue, reset } = useForm({ nombre: '', descripcion: '' });

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const response = await categoryService.getAll();
      setCategories(response.data.data);
    } catch (error) {
      setAlert({ type: 'error', message: 'Error al cargar categorías' });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (category = null) => {
    if (category) {
      setEditingCategory(category);
      setValue('nombre', category.nombre);
      setValue('descripcion', category.descripcion || '');
    } else {
      setEditingCategory(null);
      reset();
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        await categoryService.update(editingCategory.id, values);
        setAlert({ type: 'success', message: 'Categoría actualizada correctamente' });
      } else {
        await categoryService.create(values);
        setAlert({ type: 'success', message: 'Categoría creada correctamente' });
      }
      setIsModalOpen(false);
      loadCategories();
    } catch (error) {
      setAlert({ type: 'error', message: error.response?.data?.message || 'Error al guardar categoría' });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar esta categoría?')) return;
    try {
      await categoryService.delete(id);
      setAlert({ type: 'success', message: 'Categoría eliminada correctamente' });
      loadCategories();
    } catch (error) {
      setAlert({ type: 'error', message: 'Error al eliminar categoría' });
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Categorías</h1>
        <Button onClick={() => handleOpenModal()}>Nueva Categoría</Button>
      </div>

      {alert && <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />}

      <Card>
        <Table
          headers={['Nombre', 'Descripción', 'Acciones']}
          data={categories}
          renderRow={(category) => (
            <tr key={category.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{category.nombre}</td>
              <td className="px-6 py-4 text-sm text-gray-900">{category.descripcion || '-'}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                <Button variant="secondary" onClick={() => handleOpenModal(category)}>Editar</Button>
                <Button variant="danger" onClick={() => handleDelete(category.id)}>Eliminar</Button>
              </td>
            </tr>
          )}
        />
      </Card>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingCategory ? 'Editar Categoría' : 'Nueva Categoría'}>
        <form onSubmit={handleSubmit}>
          <Input label="Nombre" name="nombre" value={values.nombre} onChange={handleChange} required />
          <Input label="Descripción" name="descripcion" value={values.descripcion} onChange={handleChange} />
          <div className="mt-6 flex justify-end space-x-3">
            <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
            <Button type="submit">{editingCategory ? 'Actualizar' : 'Crear'}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Categories;

