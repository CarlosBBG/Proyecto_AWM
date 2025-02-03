import './EstudianteRutaCheck.css';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import BarraLateral from '../Componentes/BarraLateral';
import Encabezado from '../Componentes/Encabezado';
import MapaInteractivo from '../Componentes/MapaInteractivo';

const EstudianteRutaCheck = () => {
  const [estudiante, setEstudiante] = useState(null);
  const [paradas, setParadas] = useState([]);

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

    // Cargar los datos del estudiante y después las paradas del estudiante
    axios
      .get(`http://localhost:8000/estudiantes/${estudianteId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        console.log("Estudiante recibido:", response.data);
        setEstudiante(response.data);
      })
      .catch((error) => {
        console.error("Error al cargar los datos del estudiante:", error);
      });

    // Cargar las paradas del estudiante
    axios
      .get(`http://localhost:8000/estudiantes/${estudianteId}/paradas`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        console.log("Paradas del estudiante recibidas:", response.data);
        setParadas(response.data);
      })
      .catch((error) => {
        console.error("Error al cargar las paradas del estudiante:", error);
      });
  }, []);

  return (
    <div className="estudiante-ruta-check">
      <Encabezado />
      <div className="estudiante-ruta-check-container">
        {estudiante ? (
          <BarraLateral
            userName={`${estudiante.nombre} ${estudiante.apellido}`}
            userRole={estudiante.rol || "Estudiante"}
            userIcon={
              estudiante.icono || "https://cdn-icons-png.flaticon.com/128/3135/3135810.png"
            }
            menuItems={menuItems}
          />
        ) : (
          <p>Cargando datos del estudiante...</p>
        )}
        <section className="pantalla-estudiante-seleccion-de-parada-container4">
          <div className="MapaInteractivo">
            <h1>SIGA EL ESTADO DE LA RUTA</h1>
            <MapaInteractivo paradas={paradas} />
          </div>
        </section>
      </div>
    </div>
  );
};

export default EstudianteRutaCheck;