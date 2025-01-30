import React, { useEffect, useState } from "react";
import axios from "axios";
import Encabezado from "../Componentes/Encabezado";
import ConductorRutaCheckInicio from "../Componentes/ConductorRuta";
import BarraLateral from "../Componentes/BarraLateral";
import MapaInteractivo from "../Componentes/MapaInteractivo";
import "./ConductorRutaCheck.css";
import { useNavigate } from "react-router-dom";

function ConductorRutaCheck() {
  const menuItems = [
    { label: "Inicio", link: "/conductor/inicio" },
    { label: "Iniciar Ruta", link: "/conductor/iniciar-ruta" },
    { label: "Ver Estado de la Ruta", link: "/conductor/ruta-check" },
  ];

  const [conductor, setConductor] = useState(null);
  const [rutaInfo, setRutaInfo] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // 1) Revisar si en localStorage está el usuario logueado
    const storedUser = localStorage.getItem("usuario");
    if (!storedUser) {
      console.warn("No hay conductor en localStorage. Redirigiendo al login...");
      navigate("/"); // Redirigir al login si no hay usuario en sesión
      return;
    }

    // 2) Parsear y extraer el ID del conductor
    const userData = JSON.parse(storedUser);
    const conductorId = userData.id;

    // 3) Llamar al endpoint para obtener la ruta y paradas del conductor
    axios
      .get(`http://localhost:8000/conductores/${conductorId}/paradas`)
      .then((response) => {
        console.log("Datos de la ruta y paradas recibidos:", response.data);
        setRutaInfo(response.data); // Guardar la ruta y sus paradas
      })
      .catch((error) => {
        console.error("Error al cargar la información de la ruta:", error);
      });

    // 4) Llamar al endpoint para obtener el nombre de la ruta
    axios
      .get(`http://localhost:8000/conductores/${conductorId}`)
      .then((response) => {
        console.log("Nombre de la ruta recibido:", response.data);
        setConductor(response.data);
      })
      .catch((error) => {
        console.error("Error al cargar el nombre de la ruta:", error);
      });

    // Guardar datos básicos del conductor desde localStorage
    setConductor(userData);
  }, [navigate]);

  const detenerRuta = () => {
    alert("La ruta ha sido detenida.");
    navigate("/conductor/iniciar-ruta");
  };

  return (
    <div className="conductor-ruta-check">
      <Encabezado />
      <div className="conductor-ruta-check-container">
        {conductor ? (
          <BarraLateral
            userName={conductor.nombre + " " + conductor.apellido}
            userRole={"Conductor"}
            userIcon={
              "https://cdn-icons-png.flaticon.com/128/1464/1464721.png" // Puedes ajustar según la info del conductor
            }
            menuItems={menuItems}
          />
        ) : (
          <p>Cargando datos del conductor...</p>
        )}
        <div className="conductor-ruta-check-paradas">

        {rutaInfo && conductor && conductor.rutaData ? (
          <>
            <ConductorRutaCheckInicio
              titulo={conductor.rutaData.nombre} // Mostrar el nombre de la ruta
              paradas={rutaInfo.paradas.map((parada) => parada.nombre)} // Extraemos los nombres de las paradas
              onBotonClick={detenerRuta}
            />
            
            {/* Mapa Interactivo */}
            <MapaInteractivo paradas={rutaInfo.paradas} />
          </>
        ) : (
          <p>Cargando datos de la ruta y paradas...</p>
        )}
        </div>
      </div>
    </div>
  );
}

export default ConductorRutaCheck;
