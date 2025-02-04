import './EstudianteRutaCheck.css';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { io } from "socket.io-client"; // 📌 Importamos socket.io
import BarraLateral from '../Componentes/BarraLateral';
import Encabezado from '../Componentes/Encabezado';
import MapaInteractivo from '../Componentes/MapaInteractivo';

const socket = io(`${process.env.REACT_APP_API_URL}`); // 📡 Conectamos con el servidor WebSockets

const EstudianteRutaCheck = () => {
  const [estudiante, setEstudiante] = useState(null);
  const [paradas, setParadas] = useState([]);
  const [rutaId, setRutaId] = useState(null); // Guardar el ID de la ruta

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

    // Cargar los datos del estudiante y obtener su ruta
    axios
      .get(`${process.env.REACT_APP_API_URL}/estudiantes/${estudianteId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        console.log("Estudiante recibido:", response.data);
        setEstudiante(response.data);
        setRutaId(response.data.ruta); // 📌 Guardamos el ID de la ruta del estudiante
      })
      .catch((error) => console.error("Error al cargar los datos del estudiante:", error));

    // Cargar las paradas del estudiante
    axios
      .get(`${process.env.REACT_APP_API_URL}/estudiantes/${estudianteId}/paradas`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        console.log("Paradas del estudiante recibidas:", response.data);
        setParadas(response.data);
      })
      .catch((error) => console.error("Error al cargar las paradas del estudiante:", error));
  }, []);

  useEffect(() => {
    if (rutaId) {
      // 📡 Escuchar actualizaciones en tiempo real de la ruta
      socket.on(`ruta-${rutaId}`, (data) => {
        console.log("📡 Actualización en ruta:", data);
        setParadas(data.paradasRecorridas);
      });

      // 📡 Notificación cuando la ruta termine
      socket.on(`ruta-${rutaId}-finalizada`, () => {
        alert("🚏 La ruta ha finalizado.");
      });

      return () => {
        socket.off(`ruta-${rutaId}`); // 🔴 Eliminamos el evento cuando se desmonta
        socket.off(`ruta-${rutaId}-finalizada`);
      };
    }
  }, [rutaId]); // 📌 Solo se ejecuta cuando `rutaId` cambia

  return (
    <div className="estudiante-ruta-check">
      <Encabezado />
      <div className="estudiante-ruta-check-container">
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
