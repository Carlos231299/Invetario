import { useState, useEffect } from 'react';
import { userService } from '../services/userService.js';
import Card from '../components/Card.jsx';
import Button from '../components/Button.jsx';
import Input from '../components/Input.jsx';
import Modal from '../components/Modal.jsx';
import Table from '../components/Table.jsx';
import Loading from '../components/Loading.jsx';
import Alert from '../components/Alert.jsx';
import { useForm } from '../hooks/useForm.js';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [alert, setAlert] = useState(null);
  const { values, handleChange, setValue, reset } = useForm({
    nombre: '',
    email: '',
    password: '',
    rol: 'Operador'
  });

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const response = await userService.getAll();
      setUsers(response.data.data);
    } catch (error) {
      setAlert({ type: 'error', message: 'Error al cargar usuarios' });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (user = null) => {
    if (user) {
      setEditingUser(user);
      setValue('nombre', user.nombre);
      setValue('email', user.email);
      setValue('rol', user.rol);
      setValue('password', '');
    } else {
      setEditingUser(null);
      reset();
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = { ...values };
      if (editingUser && !data.password) {
        delete data.password;
      }
      if (editingUser) {
        await userService.update(editingUser.id, data);
        setAlert({ type: 'success', message: 'Usuario actualizado correctamente' });
      } else {
        await userService.create(data);
        setAlert({ type: 'success', message: 'Usuario creado correctamente' });
      }
      setIsModalOpen(false);
      loadUsers();
    } catch (error) {
      setAlert({ type: 'error', message: error.response?.data?.message || 'Error al guardar usuario' });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de desactivar este usuario?')) return;
    try {
      await userService.delete(id);
      setAlert({ type: 'success', message: 'Usuario desactivado correctamente' });
      loadUsers();
    } catch (error) {
      setAlert({ type: 'error', message: 'Error al desactivar usuario' });
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Usuarios</h1>
        <Button onClick={() => handleOpenModal()}>Nuevo Usuario</Button>
      </div>

      {alert && <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />}

      <Card>
        <Table
          headers={['Nombre', 'Email', 'Rol', 'Estado', 'Acciones']}
          data={users}
          renderRow={(user) => (
            <tr key={user.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.nombre}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.email}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.rol}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                <span className={`px-2 py-1 rounded-full text-xs ${user.activo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {user.activo ? 'Activo' : 'Inactivo'}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                <Button variant="secondary" onClick={() => handleOpenModal(user)}>Editar</Button>
                <Button variant="danger" onClick={() => handleDelete(user.id)}>Desactivar</Button>
              </td>
            </tr>
          )}
        />
      </Card>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingUser ? 'Editar Usuario' : 'Nuevo Usuario'}>
        <form onSubmit={handleSubmit}>
          <Input label="Nombre" name="nombre" value={values.nombre} onChange={handleChange} required />
          <Input label="Email" name="email" type="email" value={values.email} onChange={handleChange} required />
          <Input
            label={editingUser ? 'Nueva Contraseña (dejar vacío para no cambiar)' : 'Contraseña'}
            name="password"
            type="password"
            value={values.password}
            onChange={handleChange}
            required={!editingUser}
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Rol</label>
            <select
              name="rol"
              value={values.rol}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            >
              <option value="Operador">Operador</option>
              <option value="Admin">Admin</option>
            </select>
          </div>
          <div className="mt-6 flex justify-end space-x-3">
            <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
            <Button type="submit">{editingUser ? 'Actualizar' : 'Crear'}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Users;

