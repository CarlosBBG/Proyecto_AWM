import './EstudianteSeleccionRuta.css';
import React, { useState, useEffect } from 'react';
import BarraLateral from '../Componentes/BarraLateral';
import Encabezado from '../Componentes/Encabezado';
import axios from "axios";

const EstudianteSeleccionRuta = () => {
  const [rutas, setRutas] = useState([]);
  const [estudiante, setEstudiante] = useState(null);
  const [selectedRutaId, setSelectedRutaId] = useState(null);
  const [pendingRutaId, setPendingRutaId] = useState(null);

  const menuItems = [
    { label: "Inicio", link: "/estudiante/inicio" },
    { label: "Seleccionar Ruta", link: "/estudiante/ruta" },
    { label: "Seleccionar Parada", link: "/estudiante/parada" },
    { label: "Ver Estado de la Ruta", link: "/estudiante/ruta-check" },
  ];

  useEffect(() => {
    const storedUser = localStorage.getItem("usuario");
    const token = localStorage.getItem("token");
    if (!storedUser || !token) {
      console.warn("No hay estudiante o token en localStorage. Redirigiendo...");
      window.location.href = "/";
      return;
    }

    const userData = JSON.parse(storedUser);
    const estudianteId = userData.id;

    axios
      .get(`http://localhost:8000/estudiantes/${estudianteId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        console.log("Estudiante recibido:", response.data);
        setEstudiante(response.data);
        setSelectedRutaId(response.data.ruta); // Ruta inicial del estudiante
      })
      .catch((error) => {
        console.error("Error al cargar los datos del estudiante:", error);
      });
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios.get('http://localhost:8000/rutas', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        console.log("Rutas cargadas:", response.data);
        setRutas(response.data);
      })
      .catch((error) => {
        console.error("Error al cargar las rutas:", error);
      });
  }, []);

  const handleRutaClick = (id) => {
    if (!estudiante) {
      alert("No se encontró información del estudiante.");
      return;
    }

    // Guardar la referencia del botón seleccionado y centrarlo
    const rutaElement = document.getElementById(`ruta-${id}`);
    if (rutaElement) {
      rutaElement.scrollIntoView({ behavior: "smooth", block: "center" });
    }

    if (pendingRutaId === id) {
      setPendingRutaId(null);
    } else {
      setPendingRutaId(id);
    }
  };

  const handleAccept = () => {
    const token = localStorage.getItem("token");
    if (!pendingRutaId || !token) return;

    axios
      .put(`http://localhost:8000/estudiantes/${estudiante.id}/ruta`, { ruta: pendingRutaId }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
        console.log(`Ruta ${pendingRutaId} asignada al estudiante ${estudiante.id}.`);
        setSelectedRutaId(pendingRutaId);
        setPendingRutaId(null);
        alert("Ruta actualizada exitosamente.");
      })
      .catch((error) => {
        console.error("Error al actualizar la ruta:", error);
        alert("Hubo un problema al actualizar la ruta. Intente nuevamente.");
      });
  };

  const handleCancel = () => {
    setPendingRutaId(null);
  };

  const handleRemoveRuta = () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    axios
      .put(`http://localhost:8000/estudiantes/${estudiante.id}/ruta`, { ruta: null }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
        console.log(`Ruta eliminada del estudiante ${estudiante.id}.`);
        setSelectedRutaId(null);
        alert("Ruta eliminada exitosamente.");
      })
      .catch((error) => {
        console.error("Error al eliminar la ruta:", error);
        alert("Hubo un problema al eliminar la ruta. Intente nuevamente.");
      });
  };

  return (
    <div className="estudiante-seleccionar-ruta">
      <Encabezado />
      <div className="estudiante-seleccionar-ruta-container">
        {estudiante ? (
          <BarraLateral
            userName={`${estudiante.nombre} ${estudiante.apellido}`}
            userRole={estudiante.rol || "Estudiante"}
            userIcon={estudiante.icono || "https://cdn-icons-png.flaticon.com/128/3135/3135810.png"}
            menuItems={menuItems}
          />
        ) : (
          <p>Cargando datos del estudiante...</p>
        )}
        <section className="pantalla-estudiante-seleccion-de-parada-container4">
          <h1>Seleccione su ruta:</h1>
          <div className="container">
            {rutas.map((ruta) => (
              <div
                key={ruta.id}
                id={`ruta-${ruta.id}`} // Agregamos un id para referenciarlo
                className={`route-card ${selectedRutaId === ruta.id ? 'selected' : ''}`}
                onClick={() => handleRutaClick(ruta.id)}
                style={{
                  backgroundColor:
                    pendingRutaId === ruta.id
                      ? '#FFD700' // Amarillo para selección temporal
                      : selectedRutaId === ruta.id
                        ? '#32A94C' // Verde confirmado
                        : '#c5b6e0', // Por defecto
                }}
              >
                <h2>{ruta.nombre}</h2>
                {pendingRutaId === ruta.id && (
                  <div className="action-buttons">
                    <button className="accept-button" onClick={handleAccept}>
                      Aceptar
                    </button>
                    <button className="cancel-button" onClick={handleCancel}>
                      Cancelar
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
          {selectedRutaId && (
            <button className="remove-button" onClick={handleRemoveRuta}>
              Quitar Ruta
            </button>
          )}
        </section>
      </div>
    </div>
  );
};

export default EstudianteSeleccionRuta;