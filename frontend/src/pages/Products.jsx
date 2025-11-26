import { useState, useEffect } from 'react';
import { productService } from '../services/productService.js';
import { categoryService } from '../services/categoryService.js';
import { supplierService } from '../services/supplierService.js';
import Card from '../components/Card.jsx';
import Button from '../components/Button.jsx';
import Input from '../components/Input.jsx';
import Modal from '../components/Modal.jsx';
import Table from '../components/Table.jsx';
import Loading from '../components/Loading.jsx';
import Alert from '../components/Alert.jsx';
import { useForm } from '../hooks/useForm.js';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [alert, setAlert] = useState(null);
  const { values, handleChange, setValue, reset } = useForm({
    codigo: '',
    nombre: '',
    descripcion: '',
    categoria_id: '',
    proveedor_id: '',
    stock: 0,
    stock_minimo: 0,
    precio_compra: 0,
    precio_venta: 0
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [productsRes, categoriesRes, suppliersRes] = await Promise.all([
        productService.getAll(),
        categoryService.getAll(),
        supplierService.getAll()
      ]);
      setProducts(productsRes.data.data);
      setCategories(categoriesRes.data.data);
      setSuppliers(suppliersRes.data.data);
    } catch (error) {
      setAlert({ type: 'error', message: 'Error al cargar datos' });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      Object.keys(product).forEach(key => {
        if (values.hasOwnProperty(key)) {
          setValue(key, product[key] || '');
        }
      });
    } else {
      setEditingProduct(null);
      reset();
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
    reset();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        await productService.update(editingProduct.id, values);
        setAlert({ type: 'success', message: 'Producto actualizado correctamente' });
      } else {
        await productService.create(values);
        setAlert({ type: 'success', message: 'Producto creado correctamente' });
      }
      handleCloseModal();
      loadData();
    } catch (error) {
      setAlert({ type: 'error', message: error.response?.data?.message || 'Error al guardar producto' });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar este producto?')) return;
    try {
      await productService.delete(id);
      setAlert({ type: 'success', message: 'Producto eliminado correctamente' });
      loadData();
    } catch (error) {
      setAlert({ type: 'error', message: 'Error al eliminar producto' });
    }
  };

  if (loading) return <Loading />;

  const headers = ['Código', 'Nombre', 'Categoría', 'Stock', 'Precio Compra', 'Precio Venta', 'Acciones'];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Productos</h1>
        <Button onClick={() => handleOpenModal()}>Nuevo Producto</Button>
      </div>

      {alert && (
        <Alert
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert(null)}
        />
      )}

      <Card>
        <Table
          headers={headers}
          data={products}
          renderRow={(product, index) => (
            <tr key={product.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.codigo}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.nombre}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.categoria_nombre || '-'}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.stock}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${product.precio_compra}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${product.precio_venta}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                <Button variant="secondary" size="sm" onClick={() => handleOpenModal(product)}>
                  Editar
                </Button>
                <Button variant="danger" size="sm" onClick={() => handleDelete(product.id)}>
                  Eliminar
                </Button>
              </td>
            </tr>
          )}
        />
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingProduct ? 'Editar Producto' : 'Nuevo Producto'}
        size="lg"
      >
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Código"
              name="codigo"
              value={values.codigo}
              onChange={handleChange}
              required
            />
            <Input
              label="Nombre"
              name="nombre"
              value={values.nombre}
              onChange={handleChange}
              required
            />
            <div className="col-span-2">
              <Input
                label="Descripción"
                name="descripcion"
                value={values.descripcion}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
              <select
                name="categoria_id"
                value={values.categoria_id}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value="">Seleccionar...</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Proveedor</label>
              <select
                name="proveedor_id"
                value={values.proveedor_id}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value="">Seleccionar...</option>
                {suppliers.map(sup => (
                  <option key={sup.id} value={sup.id}>{sup.nombre}</option>
                ))}
              </select>
            </div>
            <Input
              label="Stock"
              name="stock"
              type="number"
              value={values.stock}
              onChange={handleChange}
            />
            <Input
              label="Stock Mínimo"
              name="stock_minimo"
              type="number"
              value={values.stock_minimo}
              onChange={handleChange}
            />
            <Input
              label="Precio Compra"
              name="precio_compra"
              type="number"
              step="0.01"
              value={values.precio_compra}
              onChange={handleChange}
            />
            <Input
              label="Precio Venta"
              name="precio_venta"
              type="number"
              step="0.01"
              value={values.precio_venta}
              onChange={handleChange}
            />
          </div>
          <div className="mt-6 flex justify-end space-x-3">
            <Button type="button" variant="secondary" onClick={handleCloseModal}>
              Cancelar
            </Button>
            <Button type="submit">
              {editingProduct ? 'Actualizar' : 'Crear'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Products;

