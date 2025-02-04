import './EstudianteRutaCheck.css';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { io } from "socket.io-client"; 
import BarraLateral from '../Componentes/BarraLateral';
import Encabezado from '../Componentes/Encabezado';
import MapaInteractivo from '../Componentes/MapaInteractivo';

const socket = io(`${process.env.REACT_APP_API_URL}`);

const EstudianteRutaCheck = () => {
  const [estudiante, setEstudiante] = useState(null);
  const [paradas, setParadas] = useState([]);
  const [rutaId, setRutaId] = useState(null);
  const [simulacionActiva, setSimulacionActiva] = useState(localStorage.getItem("simulacionEnCurso") === "true");

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
      .get(`${process.env.REACT_APP_API_URL}/estudiantes/${estudianteId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        console.log("Estudiante recibido:", response.data);
        setEstudiante(response.data);
        setRutaId(response.data.ruta);
      })
      .catch((error) => console.error("Error al cargar los datos del estudiante:", error));

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
      socket.on(`ruta-${rutaId}`, (data) => {
        console.log("📡 Actualización en ruta:", data);
        setParadas(data.paradasRecorridas);
      });

      socket.on(`ruta-${rutaId}-finalizada`, () => {
        alert("🚏 La ruta ha finalizado.");
        localStorage.setItem("simulacionEnCurso", "false");
        setSimulacionActiva(false);
      });

      return () => {
        socket.off(`ruta-${rutaId}`);
        socket.off(`ruta-${rutaId}-finalizada`);
      };
    }
  }, [rutaId]);

  // 🔹 Escuchar cambios en localStorage para actualizar el estado en tiempo real
  useEffect(() => {
    const checkSimulacion = () => {
      setSimulacionActiva(localStorage.getItem("simulacionEnCurso") === "true");
    };

    window.addEventListener("storage", checkSimulacion);
    return () => {
      window.removeEventListener("storage", checkSimulacion);
    };
  }, []);

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
            <MapaInteractivo
              paradas={paradas}
              isActive={simulacionActiva} // 🔹 Solo muestra el bus si la simulación está activa
            />
          </div>
        </section>
      </div>
    </div>
  );
};

export default EstudianteRutaCheck;
