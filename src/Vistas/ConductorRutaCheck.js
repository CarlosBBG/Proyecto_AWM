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
  const [paradasRecorridas, setParadasRecorridas] = useState([]);
  const navigate = useNavigate();

  // Saber si la simulación está activa
  const [simulacionActiva, setSimulacionActiva] = useState(false);

  useEffect(() => {
    // 1) Revisar si en localStorage está el usuario logueado
    const storedUser = localStorage.getItem("usuario");
    const token = localStorage.getItem("token");
    if (!storedUser || !token) {
      console.warn("No hay conductor o token en localStorage. Redirigiendo al login...");
      navigate("/");
      return;
    }

    const userData = JSON.parse(storedUser);
    const conductorId = userData.id;

    // 2) Obtener la ruta y paradas del conductor
    axios
      .get(`${process.env.REACT_APP_API_URL}/conductores/${conductorId}/paradas`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        console.log("Datos de la ruta y paradas recibidos:", response.data);
        setRutaInfo(response.data);
      })
      .catch((error) => {
        console.error("Error al cargar la información de la ruta:", error);
      });

    // 3) Obtener el nombre de la ruta
    axios
      .get(`${process.env.REACT_APP_API_URL}/conductores/${conductorId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        console.log("Nombre de la ruta recibido:", response.data);
        setConductor(response.data);
      })
      .catch((error) => {
        console.error("Error al cargar el nombre de la ruta:", error);
      });

    // 4) Revisar si la simulación está activa en localStorage
    const simulacionEnCurso = localStorage.getItem("simulacionEnCurso");
    if (simulacionEnCurso === "true") {
      setSimulacionActiva(true);
    }
  }, [navigate]);

  /** Esta función se llama cuando el bus pasa cerca de una parada */
  const handleParadaRecorrida = (nombreParada) => {
    setParadasRecorridas((prev) => {
      if (!prev.includes(nombreParada)) {
        return [...prev, nombreParada];
      }
      return prev;
    });
  };

  /** Cuando el conductor hace clic en "Detener Ruta" */
  const detenerRuta = () => {
    // Limpieza
    localStorage.removeItem("simulacionEnCurso");
    localStorage.removeItem("paradaActual");
    setSimulacionActiva(false);
    setParadasRecorridas([]);
    alert("La ruta ha sido detenida.");
    navigate("/conductor/iniciar-ruta");
  };

  /** Revisar si ya se recorrieron todas las paradas */
  useEffect(() => {
    if (rutaInfo?.paradas?.length > 0) {
      if (paradasRecorridas.length === rutaInfo.paradas.length) {
        // Fin de la ruta
        alert("🚏 Fin de la ruta. Redirigiendo a la pantalla de inicio...");
        detenerRuta();
      }
    }
  }, [paradasRecorridas, rutaInfo]);

  return (
    <div className="conductor-ruta-check">
      <Encabezado />
      <div className="conductor-ruta-check-container">
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
        
        <div className="conductor-ruta-check-paradas">
          {rutaInfo && conductor && conductor.rutaData ? (
            <>
              <ConductorRutaCheckInicio
                titulo={conductor.rutaData.nombre}
                paradas={paradasRecorridas}
                onBotonClick={detenerRuta}
              />
              {/* 
                Mapa Interactivo 
                - Paradas estáticas
                - Bus se mueve si simulacionActiva es true
              */}
              <MapaInteractivo
                paradas={rutaInfo.paradas}
                onParadaRecorrida={handleParadaRecorrida}
                isActive={simulacionActiva} // PASAMOS EL ESTADO 
              />
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
