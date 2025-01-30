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
  const [paradas, setParadas] = useState([]); // Inicializar como array vacío
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("usuario");
    if (!storedUser) {
      console.warn("No hay conductor en localStorage. Redirigiendo al login...");
      navigate("/"); 
      return;
    }

    const userData = JSON.parse(storedUser);
    const conductorId = userData.id;

    axios
  .get(`http://localhost:8000/conductores/${conductorId}/paradas`)
  .then((response) => {
    console.log("Paradas de la ruta recibidas:", response.data);
    // Accedemos al array de paradas dentro del objeto de respuesta
    if (response.data && Array.isArray(response.data.paradas)) {
      setParadas(response.data.paradas); // Guardar solo el array de paradas
    } else {
      console.error("La respuesta no contiene un array de paradas:", response.data);
      setParadas([]); // En caso de error, inicializar como un array vacío
    }
  })
  .catch((error) => {
    console.error("Error al cargar las paradas de la ruta:", error);
    setParadas([]); // Manejar el error y evitar que quede undefined
  });

    axios
      .get(`http://localhost:8000/conductores/${conductorId}`)
      .then((response) => {
        console.log("Conductor recibido:", response.data);
        setConductor(response.data);
      })
      .catch((error) => {
        console.error("Error al cargar los datos del conductor:", error);
      });
  }, []);

  const iniciarRuta = () => {
    alert("La ruta ha sido iniciada.");
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
          onIniciarRuta={iniciarRuta}
          paradas={paradas}
         
        />
      </div>
    </div>
  );
}

export default ConductorIniciarRuta;
