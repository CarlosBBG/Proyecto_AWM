import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Encabezado from '../Componentes/Encabezado';
import BarraLateral from '../Componentes/BarraLateral';
import FiltradoAgregado from '../Componentes/FiltradoAgregado';
import Tabla from '../Componentes/Tabla';
import AgregadoEditado from '../Componentes/AgregadoEditado';
import './AdministradorEstudiantes.css';

const AdministradorEstudiantes = () => {
  const [data, setData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentRecord, setCurrentRecord] = useState(null);
  const [filterType, setFilterType] = useState('');
  const [filterText, setFilterText] = useState('');
  const [administrador, setAdministrador] = useState(null);

  // Estado para el modal de confirmación de eliminación
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState(null);

  const columns = [
    { header: 'ID', accessor: 'id' },
    { header: 'Nombre', accessor: 'nombre' },
    { header: 'Apellido', accessor: 'apellido' },
    { header: 'Correo', accessor: 'correo' },
    { header: 'Código Único', accessor: 'codigoUnico' },
    { header: 'Ruta', accessor: 'ruta' },
  ];

  const filterOptions = [
    { value: 'nombre', label: 'Nombre' },
    { value: 'apellido', label: 'Apellido' },
    { value: 'correo', label: 'Correo' },
    { value: 'codigoUnico', label: 'Código Único' },
    { value: 'ruta', label: 'Ruta' },
  ];

  const fetchData = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get('http://localhost:8000/estudiantes', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setData(response.data);
    } catch (error) {
      console.error('Error al cargar los datos:', error);
    }
  };

  const fetchAdminData = () => {
    const adminData = localStorage.getItem('usuario');
    if (adminData) {
      setAdministrador(JSON.parse(adminData));
    } else {
      window.location.href = '/'; // Redirigir al inicio de sesión si no hay datos
    }
  };

  useEffect(() => {
    fetchAdminData();
    fetchData();
  }, []);

  const handleSave = async (newRecord) => {
    const token = localStorage.getItem('token');
    try {
      const recordToAdd = {
        nombre: newRecord.nombre,
        apellido: newRecord.apellido,
        correo: newRecord.correo,
        password: newRecord.password,
        codigoUnico: newRecord.codigoUnico,
        ruta: newRecord.ruta,
      };

      if (currentRecord && currentRecord.id !== null) {
        const updatedRecord = { ...recordToAdd, id: currentRecord.id };
        console.log('Datos enviados para actualizar:', updatedRecord);
        await axios.put(`http://localhost:8000/estudiantes/${currentRecord.id}`, updatedRecord, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      } else {
        console.log('Datos enviados para crear:', recordToAdd);
        await axios.post('http://localhost:8000/estudiantes', recordToAdd, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }
      fetchData();
      setIsModalOpen(false);
      setCurrentRecord(null);
    } catch (error) {
      console.error('Error al guardar el registro:', error);
    }
  };

  const openDeleteModal = (id) => {
    if (!id || typeof id !== 'number') {
      console.error('ID inválido:', id);
      return;
    }
    setRecordToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    const token = localStorage.getItem('token');
    try {
      if (!recordToDelete) {
        console.error('No hay un ID válido para eliminar.');
        return;
      }
      await axios.delete(`http://localhost:8000/estudiantes/${recordToDelete}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchData();
      setIsDeleteModalOpen(false);
      setRecordToDelete(null);
    } catch (error) {
      console.error('Error al eliminar el registro:', error);
    }
  };

  const cancelDelete = () => {
    setIsDeleteModalOpen(false);
    setRecordToDelete(null);
  };

  const handleFilterApply = (selectedFilter, text) => {
    setFilterType(selectedFilter);
    setFilterText(text);
  };

  const handleClearFilter = () => {
    setFilterType('');
    setFilterText('');
  };

  const filteredData = data.filter((item) => {
    if (!filterType || !filterText) return true;
    const valueToFilter = item[filterType]?.toString().toLowerCase() || '';
    return valueToFilter.includes(filterText.toLowerCase());
  });

  const handleAddClick = () => {
    setCurrentRecord({
      id: null,
      nombre: '',
      apellido: '',
      correo: '',
      password: '',
      codigoUnico: '',
      ruta: '',
    });
    setIsModalOpen(true);
  };

  const handleEditClick = (record) => {
    setCurrentRecord(record);
    setIsModalOpen(true);
  };

  return (
    <div className="administrador-estudiantes">
      <Encabezado />
      <div className="contenido-principal">
        {administrador && (
          <BarraLateral
            userName={`${administrador.nombre} ${administrador.apellido}`}
            userRole="Administrador"
            userIcon="https://cdn-icons-png.flaticon.com/512/5322/5322033.png"
            menuItems={[
              { label: 'Inicio', link: '/administrador/inicio' },
              { label: 'Estudiantes', link: '/administrador/estudiantes' },
              { label: 'Conductores', link: '/administrador/conductores' },
              { label: 'Rutas', link: '/administrador/rutas' },
            ]}
          />
        )}
        <div className="contenido-tabla">
          <FiltradoAgregado
            filterOptions={filterOptions}
            filterText={filterText}
            addLabel="Agregar estudiante"
            onFilterApply={handleFilterApply}
            onAddClick={handleAddClick}
            onClearFilter={handleClearFilter}
            onFilterTextChange={setFilterText}
          />

          <Tabla
            columns={columns}
            data={filteredData}
            onEditClick={handleEditClick}
            onDeleteClick={openDeleteModal}
          />
        </div>
      </div>

      {isModalOpen && (
        <AgregadoEditado
          title={currentRecord?.id ? 'Editar Estudiante' : 'Agregar Estudiante'}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setCurrentRecord(null);
          }}
          onSave={handleSave}
          fields={[
            {
              label: 'Nombre',
              name: 'nombre',
              value: currentRecord?.nombre || '',
              onChange: (value) => {
                if (/^[A-Za-zÁÉÍÓÚáéíóúÑñ]+$/.test(value) || value === '') {
                  setCurrentRecord((prev) => ({ ...prev, nombre: value }));
                }
              },
              validate: (value) =>
                /^[A-Za-zÁÉÍÓÚáéíóúÑñ]+$/.test(value)
                  ? ''
                  : 'El nombre solo debe contener letras.',
            },
            {
              label: 'Apellido',
              name: 'apellido',
              value: currentRecord?.apellido || '',
              onChange: (value) => {
                if (/^[A-Za-zÁÉÍÓÚáéíóúÑñ]+$/.test(value) || value === '') {
                  setCurrentRecord((prev) => ({ ...prev, apellido: value }));
                }
              },
              validate: (value) =>
                /^[A-Za-zÁÉÍÓÚáéíóúÑñ]+$/.test(value)
                  ? ''
                  : 'El apellido solo debe contener letras.',
            },
            {
              label: 'Correo',
              name: 'correo',
              value: currentRecord?.correo || '',
              onChange: (value) => {
                if (value.includes('@') && !value.endsWith('@epn.edu.ec')) {
                  value = value.split('@')[0] + '@epn.edu.ec';
                }
                setCurrentRecord((prev) => ({ ...prev, correo: value }));
              },
              validate: (value) =>
                /^[a-zA-Z0-9._%+-]+@epn\.edu\.ec$/.test(value)
                  ? ''
                  : 'Debe ingresar un correo válido con @epn.edu.ec.',
            },
            {
              label: 'Password',
              name: 'password',
              type: 'password',
              value: currentRecord?.password || '',
              onChange: (value) => {
                setCurrentRecord((prev) => ({ ...prev, password: value }));
              },
              validate: (value) =>
                value.length >= 6
                  ? ''
                  : 'La contraseña debe tener al menos 6 caracteres.',
            },
            {
              label: 'Código Único',
              name: 'codigoUnico',
              value: currentRecord?.codigoUnico || '',
              onChange: (value) => {
                if (/^\d{0,9}$/.test(value)) {
                  setCurrentRecord((prev) => ({ ...prev, codigoUnico: value }));
                }
              },
              validate: (value) =>
                /^\d{9}$/.test(value)
                  ? ''
                  : 'El código único debe contener exactamente 9 números.',
            },
            {
              label: 'Ruta',
              name: 'ruta',
              type: 'select',
              value: currentRecord?.ruta?.toString() || '',
              onChange: (value) => {
                setCurrentRecord((prev) => ({ ...prev, ruta: value.toString() }));
              },
              options: Array.from({ length: 18 }, (_, i) => (i + 1).toString()),
              validate: (value) =>
                /^[1-9]$|^1[0-8]$/.test(value)
                  ? ''
                  : 'Debe seleccionar una ruta válida.',
            },
          ]}
        />
      )}

      {isDeleteModalOpen && (
        <AgregadoEditado
          title="Confirmación de Eliminación"
          confirmationMode={true}
          confirmationMessage="¿Está seguro de que desea eliminar este estudiante? Esta acción no se puede deshacer."
          isOpen={isDeleteModalOpen}
          onClose={cancelDelete}
          onConfirm={confirmDelete}
        />
      )}
    </div>
  );
};

export default AdministradorEstudiantes;