import React, { useEffect, useState } from "react";
import ConductorBienvenida from "../Componentes/ConductorBienvenida";
import Encabezado from "../Componentes/Encabezado";
import BarraLateral from "../Componentes/BarraLateral";
import "./ConductorPantallaInicio.css";
import axios from "axios";

function ConductorPantallaInicio() {
  const menuItems = [
    { label: "Inicio", link: "/conductor/inicio" },
    { label: "Iniciar Ruta", link: "/conductor/iniciar-ruta" },
    { label: "Ver Estado de la Ruta", link: "/conductor/ruta-check" },
  ];

  const [conductor, setConductor] = useState(null);

  useEffect(() => {
    // 1) Revisar si en localStorage está el usuario
    const storedUser = localStorage.getItem("usuario");
    if (!storedUser) {
      // No hay usuario logueado, podrías redirigir al login
      console.warn("No hay conductor en localStorage. Redirigiendo...");
      // navigate("/") o algo similar
      return;
    }

    // 2) Parsear y tomar el id
    const userData = JSON.parse(storedUser);
    const conductorId = userData.id;  // Asumiendo que en el backend es "id"

    // 3) Hacer la consulta GET usando el ID real
    axios
      .get(`http://localhost:8000/conductores/${conductorId}`)
      .then((response) => {
        console.log("Conductor recibido:", response.data);
        setConductor(response.data);
      })
      .catch((error) => {
        console.error("Error al cargar datos del conductor:", error);
      });
  }, []);

  const mensaje = `Bienvenido al Sistema de Transporte Estudiantil`;
  const imagen = "/polibus-logo-500h.png";

  return (
    <div className="conductor-inicio">
      <Encabezado />
      <div className="conductor-inicio-container">
        {conductor ? (
          <BarraLateral
            userName={`${conductor.nombre} ${conductor.apellido}`}
            userRole={conductor.role || "Conductor"}
            userIcon="https://cdn-icons-png.flaticon.com/128/1464/1464721.png"
            menuItems={menuItems}
          />
        ) : (
          <p>Cargando datos del conductor...</p>
        )}
        <ConductorBienvenida mensaje={mensaje} imagen={imagen} />
      </div>
    </div>
  );
}

export default ConductorPantallaInicio;
