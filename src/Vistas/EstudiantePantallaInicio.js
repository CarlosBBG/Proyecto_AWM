import React, { useEffect, useState } from "react";
import Encabezado from "../Componentes/Encabezado";
import BarraLateral from "../Componentes/BarraLateral";
import axios from "axios";
import EstudianteBienvenida from "../Componentes/EstudianteBienvenida";
import "./EstudiantePantallaInicio.css";

function EstudiantePantallaInicio() {
  const menuItems = [
    { label: "Inicio", link: "/estudiante/inicio" },
    { label: "Seleccionar Ruta", link: "/estudiante/ruta" },
    { label: "Seleccionar Parada", link: "/estudiante/parada" },
    { label: "Ver Estado de la Ruta", link: "/estudiante/ruta-check" },
  ];

  const [estudiante, setEstudiante] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("usuario");
    if (!storedUser) {
      console.warn("No hay estudiante en localStorage. Redirigiendo...");
      window.location.href = "/";
      return;
    }

    const userData = JSON.parse(storedUser);
    const estudianteId = userData.id; // Asegúrate de que tu backend use esta clave

    axios
      .get(`http://localhost:8000/estudiantes/${estudianteId}`)
      .then((response) => {
        console.log("Estudiante recibido:", response.data);
        setEstudiante(response.data);
      })
      .catch((error) => {
        console.error("Error al cargar los datos del estudiante:", error);
      });
  }, []);

  const mensaje = "Bienvenido al Sistema del Transporte Estudiantil";
  const imagen = "/polibus-logo-500h.png";

  return (
    <div className="estudiante-inicio">
      <Encabezado />
      <div className="estudiante-inicio-container">
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
        <EstudianteBienvenida mensaje={mensaje} imagen={imagen} />
      </div>
    </div>
  );
}

export default EstudiantePantallaInicio;