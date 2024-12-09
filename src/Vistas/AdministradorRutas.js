import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Encabezado from '../Componentes/Encabezado';
import BarraLateral from '../Componentes/BarraLateral';
import FiltradoAgregado from '../Componentes/FiltradoAgregado';
import Tabla from '../Componentes/Tabla';
import AgregadoEditado from '../Componentes/AgregadoEditado';
import './AdministradorRutas.css';

const AdministradorRutas = () => {
  const [data, setData] = useState([]);
  const [filterType, setFilterType] = useState('');
  const [filterText, setFilterText] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentRecord, setCurrentRecord] = useState(null);
  const [recordToDelete, setRecordToDelete] = useState(null);
  const [administrador, setAdministrador] = useState(null);

  const columns = [
    { header: 'ID', accessor: 'id' },
    { header: 'Ruta', accessor: 'ruta' },
    { header: 'Recorrido', accessor: 'recorrido' },
    { header: 'Paradas', accessor: 'paradas' },
  ];

  const filterOptions = [
    { value: 'id', label: 'ID' },
    { value: 'ruta', label: 'Ruta' },
    { value: 'recorrido', label: 'Recorrido' },
    { value: 'paradas', label: 'Paradas' },
  ];

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:3001/rutas');
      const numericData = response.data.map((item) => ({
        ...item,
        id: Number(item.id),
      }));
      setData(numericData);
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

  const filteredData = data.filter((item) => {
    if (!filterType || !filterText) return true;
    const valueToFilter = item[filterType]?.toString().toLowerCase() || '';
    return valueToFilter.includes(filterText.toLowerCase());
  });

  const handleFilterApply = (selectedFilter, text) => {
    setFilterType(selectedFilter);
    setFilterText(text);
  };

  const handleClearFilter = () => {
    setFilterType('');
    setFilterText('');
  };

  const handleAddClick = () => {
    setCurrentRecord({
      id: null,
      ruta: '',
      recorrido: '',
      paradas: '',
    });
    setIsModalOpen(true);
  };

  const handleEditClick = (record) => {
    setCurrentRecord(record);
    setIsModalOpen(true);
  };

  const handleSave = async (newRecord) => {
    try {
      if (currentRecord && currentRecord.id !== null) {
        const updatedRecord = { ...newRecord, id: String(currentRecord.id) };
        await axios.put(`http://localhost:3001/rutas/${currentRecord.id}`, updatedRecord);
      } else {
        const newId = data.length > 0 ? String(Math.max(...data.map((item) => Number(item.id))) + 1) : '1';
        const recordToAdd = { id: newId, ...newRecord };
        await axios.post('http://localhost:3001/rutas', recordToAdd);
      }
      fetchData();
      setIsModalOpen(false);
      setCurrentRecord(null);
    } catch (error) {
      console.error('Error al guardar el registro:', error);
    }
  };

  const openDeleteModal = (id) => {
    setRecordToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`http://localhost:3001/rutas/${recordToDelete}`);
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

  return (
    <div className="administrador-rutas">
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
            addLabel="Agregar ruta"
            onFilterApply={handleFilterApply}
            onAddClick={handleAddClick}
            onClearFilter={handleClearFilter}
            onFilterTextChange={setFilterText}
          />
          <div className="scroll-container">
            <Tabla
              columns={columns}
              data={filteredData}
              onEditClick={handleEditClick}
              onDeleteClick={openDeleteModal}
            />
          </div>
        </div>
      </div>
      {isModalOpen && (
        <AgregadoEditado
          title={currentRecord?.id ? 'Editar Ruta' : 'Agregar Ruta'}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setCurrentRecord(null);
          }}
          onSave={(record) => handleSave(record)}
          fields={[
            {
              label: 'Ruta',
              name: 'ruta',
              value: currentRecord?.ruta || '',
              onChange: (value) => setCurrentRecord((prev) => ({ ...prev, ruta: value })),
              validate: (value) =>
                /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/.test(value) ? '' : 'La ruta solo debe contener letras.',
            },
            {
              label: 'Recorrido',
              name: 'recorrido',
              value: currentRecord?.recorrido || '',
              multiline: true,
              className: 'campo-amplio',
              onChange: (value) => setCurrentRecord((prev) => ({ ...prev, recorrido: value })),
              validate: (value) =>
                /^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9\s.,():-]+$/.test(value)
                  ? ''
                  : 'El recorrido solo puede contener letras, números, comas, puntos y guiones.',
            },
            {
              label: 'Paradas',
              name: 'paradas',
              value: currentRecord?.paradas || '',
              multiline: true,
              className: 'campo-amplio',
              onChange: (value) => setCurrentRecord((prev) => ({ ...prev, paradas: value })),
              validate: (value) =>
                /^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9\s.,-]+$/.test(value)
                  ? ''
                  : 'Las paradas solo pueden contener letras, números, comas, puntos y guiones.',
            },
          ]}
        />
      )}
      {isDeleteModalOpen && (
        <AgregadoEditado
          title="Confirmación de Eliminación"
          confirmationMode={true}
          confirmationMessage="¿Está seguro de que desea eliminar esta ruta? Esta acción no se puede deshacer."
          isOpen={isDeleteModalOpen}
          onClose={cancelDelete}
          onConfirm={confirmDelete}
        />
      )}
    </div>
  );
};

export default AdministradorRutas;
