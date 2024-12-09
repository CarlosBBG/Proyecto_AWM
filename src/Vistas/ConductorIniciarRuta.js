import React, { useEffect, useState } from "react";
import axios from "axios";
import ConductorRutaInicio from "../Componentes/ConductorRutaInicio";
import Encabezado from "../Componentes/Encabezado";
import { useNavigate } from "react-router-dom";
import BarraLateral from "../Componentes/BarraLateral";

function ConductorIniciarRuta() {
  // Opciones de menú para ConductorMenu
  const menuItems = [
    { label: "Inicio", link: "/conductor/inicio" },
    { label: "Iniciar Ruta", link: "/conductor/iniciar-ruta" },
    { label: "Ver Estado de la Ruta", link: "/conductor/ruta-check" },
  ];

  // Datos del conductor
  const [conductor, setConductor] = useState(null); // Inicializa como null

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

  const mapaInicialSrc =
    "https://www.google.com/maps/embed?pb=!1m28!1m12!1m3!1d43187.25868662508!2d-78.52596115282607!3d-0.24946750913633772!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m13!3e0!4m5!1s0x91d5a27340683463%3A0xdfb5eabd7bf000e1!2sEstacion%20Transferencia%20Ecovia%20-%20El%20Capul%C3%AD%2C%20Calle%205%2C%20Quito!3m2!1d-0.29960139999999996!2d-78.5420267!4m5!1s0x91d59a107e1cd44b%3A0x88a284f66939ed4!2sESCUELA%20POLIT%C3%89CNICA%20NACIONAL%2C%20Av.%20Ladr%C3%B3n%20de%20Guevara%20E11-253%2C%20Quito%20170143!3m2!1d-0.2124413!2d-78.4905842!5e0!3m2!1ses!2sec";


    const navigate = useNavigate();

  // Funciones de manejo de eventos
  const iniciarRuta = () => {
    alert("La ruta ha sido iniciada.");
    navigate("/conductor/ruta-check");
  };

  return (
    <div>
      {/* Encabezado */}
      <Encabezado />

      {/* Ruta Inicio */}
      <div className="app-contenido">
        {/* Render condicional para evitar errores */}
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

        <ConductorRutaInicio
          claseContenedor="ruta-personalizada"
          tituloRuta="RUTA: CAPULÍ"
          mapaSrc={mapaInicialSrc}
          textoBoton="Comenzar"
          onIniciarRuta={iniciarRuta}
        />
      </div>
    </div>
  );
}

export default ConductorIniciarRuta;
