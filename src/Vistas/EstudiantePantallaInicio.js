import React, { useEffect, useState } from "react";
import ConductorBienvenida from "../Componentes/EstudianteBienvenida";
import Encabezado from "../Componentes/Encabezado";
import BarraLateral from "../Componentes/BarraLateral";
import axios from "axios";
import EstudianteBienvenida from "../Componentes/EstudianteBienvenida";

function EstudiantePantallaInicio() {
    const menuItems = [
        { label: "Inicio", link: "/estudiante/inicio" },
        { label: "Seleccionar Ruta", link: "/estudiante/seleccionar-ruta" },
        { label: "Seleccionar Parada", link: "/estudiante/seleccionar-check" },
        { label: "Ver Estado de la Ruta", link: "/estudiante/ruta-check" },
      ];

  const [estudiante, setConductor] = useState(null);

  useEffect(() => {
    // Cargar datos del estudiante
    axios
      .get("http://localhost:3001/estudiantes/1")
      .then((response) => {
        console.log("Estudiante recibido:", response.data); // Depuración
        setConductor(response.data);
      })
      .catch((error) => {
        console.error("Error al cargar los datos del estudiante:", error);
      });
  }, []);

  const mensaje = `Bienvenido al Sistema del Transporte Estudiantil`;
  const imagen = "/polibus-logo-500h.png";

  return (
    <div>
      <Encabezado />
      <div className="app-contenido">
        {estudiante ? (
          <BarraLateral
            userName={estudiante.nombre + " " + estudiante.apellido}
            userRole={estudiante.rol}
            userIcon={estudiante.icono}
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
