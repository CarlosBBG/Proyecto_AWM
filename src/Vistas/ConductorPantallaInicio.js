import React, { useEffect, useState } from "react";
import ConductorBienvenida from "../Componentes/ConductorBienvenida";
import Encabezado from "../Componentes/Encabezado";
import BarraLateral from "../Componentes/BarraLateral";
import axios from "axios";

function ConductorPantallaInicio() {
  const menuItems = [
    { label: "Inicio", link: "/conductor/inicio" },
    { label: "Iniciar Ruta", link: "/conductor/iniciar-ruta" },
    { label: "Ver Estado de la Ruta", link: "/conductor/ruta-check" },
  ];

  const [conductor, setConductor] = useState(null);

  useEffect(() => {
    // Cargar datos del conductor
    axios
      .get("http://localhost:3001/conductores/1")
      .then((response) => {
        console.log("Conductor recibido:", response.data); // Depuración
        setConductor(response.data);
      })
      .catch((error) => {
        console.error("Error al cargar los datos del conductor:", error);
      });
  }, []);

  const mensaje = `Bienvenido al Sistema del Transporte Estudiantil`;
  const imagen = "/polibus-logo-500h.png";

  return (
    <div>
      <Encabezado />
      <div className="app-contenido">
        {conductor ? (
          <BarraLateral
            userName={conductor.nombre + " " + conductor.apellido}
            userRole={conductor.rol}
            userIcon={conductor.icono}
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
