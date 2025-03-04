import React, { useEffect, useState } from "react";
import axios from "axios";
import ConductorRutaInicio from "../Componentes/ConductorRutaInicio";
import Encabezado from "../Componentes/Encabezado";
import BarraLateral from "../Componentes/BarraLateral";
import { useNavigate } from "react-router-dom";
import "./ConductorIniciarRuta.css";

function ConductorIniciarRuta() {
  const menuItems = [
    { label: "Inicio", link: "/conductor/inicio" },
    { label: "Iniciar Ruta", link: "/conductor/iniciar-ruta" },
    { label: "Ver Estado de la Ruta", link: "/conductor/ruta-check" },
  ];

  const [conductor, setConductor] = useState(null);
  const [paradas, setParadas] = useState([]); 
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("usuario");
    const token = localStorage.getItem("token");
    if (!storedUser || !token) {
      console.warn("No hay conductor o token en localStorage. Redirigiendo al login...");
      navigate("/");
      return;
    }

    const userData = JSON.parse(storedUser);
    const conductorId = userData.id;

    axios
      .get(`${process.env.REACT_APP_API_URL}/conductores/${conductorId}/paradas`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        console.log("Paradas de la ruta recibidas:", response.data);
        if (response.data && Array.isArray(response.data.paradas)) {
          setParadas(response.data.paradas);
        } else {
          console.error("La respuesta no contiene un array de paradas:", response.data);
          setParadas([]);
        }
      })
      .catch((error) => {
        console.error("Error al cargar las paradas de la ruta:", error);
        setParadas([]);
      });

    axios
      .get(`${process.env.REACT_APP_API_URL}/conductores/${conductorId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        console.log("Conductor recibido:", response.data);
        setConductor(response.data);
      })
      .catch((error) => {
        console.error("Error al cargar los datos del conductor:", error);
      });
  }, [navigate]);

  const iniciarSimulacion = () => {
    // Activa la simulación
    localStorage.setItem("simulacionEnCurso", "true");
    localStorage.setItem("paradaActual", "0");
    
    navigate("/conductor/ruta-check");
  };

  const tituloRuta = conductor?.rutaData
    ? `RUTA: ${conductor.rutaData.nombre}`
    : "RUTA DESCONOCIDA";

  return (
    <div className="iniciar-ruta">
      <Encabezado />
      <div className="ruta-container">
        {conductor ? (
          <BarraLateral
            userName={conductor.nombre + " " + conductor.apellido}
            userRole={"Conductor"}
            userIcon={"https://cdn-icons-png.flaticon.com/128/1464/1464721.png"}
            menuItems={menuItems}
          />
        ) : (
          <p>Cargando datos del conductor...</p>
        )}

        <ConductorRutaInicio
          claseContenedor="ruta-personalizada"
          tituloRuta={tituloRuta}
          textoBoton="Comenzar"
          onIniciarRuta={iniciarSimulacion}
          paradas={paradas}
        />
      </div>
    </div>
  );
}

export default ConductorIniciarRuta;
