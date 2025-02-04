import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Encabezado from '../Componentes/Encabezado';
import BarraLateral from '../Componentes/BarraLateral';
import FiltradoAgregado from '../Componentes/FiltradoAgregado';
import Tabla from '../Componentes/Tabla';
import AgregadoEditado from '../Componentes/AgregadoEditado';
import './AdministradorConductores.css';

const AdministradorConductores = () => {
  const [data, setData] = useState([]); // Lista de conductores desde el servidor
  const [filterType, setFilterType] = useState(''); // Columna seleccionada para filtrar
  const [filterText, setFilterText] = useState(''); // Texto del filtro
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentRecord, setCurrentRecord] = useState(null); // Registro seleccionado para editar o agregar
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState(null);
  const [administrador, setAdministrador] = useState(null);

  const columns = [
    { header: 'ID', accessor: 'id' },
    { header: 'Nombre', accessor: 'nombre' },
    { header: 'Apellido', accessor: 'apellido' },
    { header: 'Correo', accessor: 'correo' },
    { header: 'Cédula', accessor: 'cedula' },
    { header: 'Ruta', accessor: 'ruta' },
  ];

  const filterOptions = [
    { value: 'nombre', label: 'Nombre' },
    { value: 'apellido', label: 'Apellido' },
    { value: 'correo', label: 'Correo' },
    { value: 'cedula', label: 'Cédula' },
    { value: 'ruta', label: 'Ruta' },
  ];

  // Cargar datos del administrador
  useEffect(() => {
    const adminData = localStorage.getItem("usuario");
    const token = localStorage.getItem("token");

    if (adminData && token) {
      const parsedData = JSON.parse(adminData);
      setAdministrador(parsedData);

      // Opcional: Si necesitas hacer una solicitud al backend para obtener más datos del administrador
      axios.get(`${process.env.REACT_APP_API_URL}/administradores/${parsedData.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(response => {
        setAdministrador(response.data);
      })
      .catch(error => {
        console.error('Error al cargar los datos del administrador:', error);
      });
    } else {
      // Si no hay información en localStorage, redirigir al inicio de sesión
      window.location.href = "/";
    }
  }, []);

  // Cargar datos desde el servidor
  const fetchData = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/conductores`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const numericData = response.data.map((item) => ({
        ...item,
        id: Number(item.id), // Asegúrate de que el id sea un número
      }));
      setData(numericData);
    } catch (error) {
      console.error('Error al cargar los datos:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Filtrar datos según columna y texto
  const filteredData = data.filter((item) => {
    if (!filterType || !filterText) return true; // Si no hay filtro, muestra todo
    const valueToFilter = item[filterType]?.toString().toLowerCase() || '';
    return valueToFilter.includes(filterText.toLowerCase());
  });

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
      await axios.delete(`${process.env.REACT_APP_API_URL}/conductores/${recordToDelete}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchData(); // Recargar los datos después de eliminar
      setIsDeleteModalOpen(false);
      setRecordToDelete(null); // Limpiar estado
    } catch (error) {
      console.error('Error al eliminar el registro:', error);
    }
  };

  const cancelDelete = () => {
    setIsDeleteModalOpen(false);
    setRecordToDelete(null); // Limpiar estado
  };

  // Manejo de filtros
  const handleFilterApply = (selectedFilter, text) => {
    if (!selectedFilter) {
      alert('Selecciona un campo para filtrar.');
      return;
    }
    setFilterType(selectedFilter);
    setFilterText(text);
  };

  const handleClearFilter = () => {
    setFilterType('');
    setFilterText('');
  };

  // Manejo del modal
  const handleAddClick = () => {
    setCurrentRecord({
      id: null,
      nombre: '',
      apellido: '',
      correo: '',
      cedula: '',
      ruta: '',
      password: '',
    });
    setIsModalOpen(true);
  };

  const handleEditClick = (record) => {
    setCurrentRecord(record);
    setIsModalOpen(true);
  };

  const handleSave = async (newRecord) => {
    const token = localStorage.getItem('token');
    try {
      // Combinar los valores actuales con los nuevos
      const updatedRecord = { ...currentRecord, ...newRecord };

      // Validar campos obligatorios antes de enviar
      if (
        !updatedRecord.nombre ||
        !updatedRecord.apellido ||
        !updatedRecord.correo ||
        !updatedRecord.cedula ||
        !updatedRecord.ruta ||
        !updatedRecord.password
      ) {
        alert('Todos los campos son obligatorios.');
        return;
      }

      console.log('Datos enviados al backend:', updatedRecord);

      if (updatedRecord.id !== null) {
        // Actualizar un registro existente
        await axios.put(
          `${process.env.REACT_APP_API_URL}/conductores/${updatedRecord.id}`,
          updatedRecord,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } else {
        // Crear un nuevo registro
        await axios.post(`${process.env.REACT_APP_API_URL}/conductores`, updatedRecord, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }

      fetchData(); // Recargar datos después de guardar
      setIsModalOpen(false); // Cerrar modal
      setCurrentRecord(null); // Limpiar estado
    } catch (error) {
      console.error(
        'Error al guardar el registro:',
        error.response?.data || error.message
      );
    }
  };

  return (
    <div className="administrador-conductores">
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
            addLabel="Agregar conductor"
            onFilterApply={handleFilterApply}
            onAddClick={handleAddClick}
            onClearFilter={handleClearFilter}
            onFilterTextChange={setFilterText}
          />
          <Tabla
            columns={columns}
            data={filteredData}
            onEditClick={handleEditClick}
            onDeleteClick={openDeleteModal} // Utiliza el modal para eliminar
          />
        </div>
      </div>

      {isModalOpen && (
        <AgregadoEditado
          title={currentRecord?.id ? 'Editar Conductor' : 'Agregar Conductor'}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setCurrentRecord(null);
          }}
          onSave={(record) => handleSave(record)}
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
              onChange: (value) =>
                setCurrentRecord((prev) => ({ ...prev, correo: value })),
              validate: (value) =>
                /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value)
                  ? ''
                  : 'El correo no es válido.',
            },
            {
              label: 'Número de Cédula',
              name: 'cedula',
              value: currentRecord?.cedula || '',
              onChange: (value) => {
                if (/^\d{0,10}$/.test(value)) {
                  setCurrentRecord((prev) => ({ ...prev, cedula: value }));
                }
              },
              validate: (value) =>
                /^\d{10}$/.test(value)
                  ? ''
                  : 'La cédula debe tener exactamente 10 dígitos.',
            },
            // Campo nuevo: password
            {
              label: 'Password',
              name: 'password',
              type: 'password',
              value: currentRecord?.password || '',
              onChange: (value) =>
                setCurrentRecord((prev) => ({ ...prev, password: value })),
              validate: (value) => {
                if (value.length < 6) {
                  return 'La contraseña debe tener al menos 6 caracteres.';
                }
                return '';
              },
            },
            {
              label: 'Ruta',
              name: 'ruta',
              type: 'select',
              value: currentRecord?.ruta || '',
              onChange: (value) =>
                setCurrentRecord((prev) => ({ ...prev, ruta: value })),
              options: Array.from({ length: 18 }, (_, i) => (i + 1).toString()),
              validate: (value) => {
                // Opcionalmente, si no quieres validación cuando no cambia, podrías hacer algo distinto
                if (!value) {
                  return '';
                }
                return /^[1-9]$|^1[0-8]$/.test(value)
                  ? ''
                  : 'Debe seleccionar una ruta válida.';
              },
            },
          ]}
        />
      )}

      {isDeleteModalOpen && (
        <AgregadoEditado
          title="Confirmación de Eliminación"
          confirmationMode={true}
          confirmationMessage="¿Está seguro de que desea eliminar este conductor? Esta acción no se puede deshacer."
          isOpen={isDeleteModalOpen}
          onClose={cancelDelete}
          onConfirm={confirmDelete}
        />
      )}
    </div>
  );
};

export default AdministradorConductores;