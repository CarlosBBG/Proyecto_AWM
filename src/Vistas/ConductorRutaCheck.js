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
    const token = localStorage.getItem("token");
    if (!storedUser || !token) {
      console.warn("No hay conductor o token en localStorage. Redirigiendo al login...");
      navigate("/"); // Redirigir al login si no hay usuario en sesión
      return;
    }

    // 2) Parsear y extraer el ID del conductor
    const userData = JSON.parse(storedUser);
    const conductorId = userData.id;

    // 3) Llamar al endpoint para obtener la ruta y paradas del conductor
    axios
      .get(`${process.env.REACT_APP_API_URL}/conductores/${conductorId}/paradas`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        console.log("Datos de la ruta y paradas recibidos:", response.data);
        setRutaInfo(response.data); // Guardar la ruta y sus paradas
      })
      .catch((error) => {
        console.error("Error al cargar la información de la ruta:", error);
      });

    // 4) Llamar al endpoint para obtener el nombre de la ruta
    axios
      .get(`${process.env.REACT_APP_API_URL}/conductores/${conductorId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
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

  const [paradasRecorridas, setParadasRecorridas] = useState([]);
  const [indiceParada, setIndiceParada] = useState(0);
  const [simulacionActiva, setSimulacionActiva] = useState(false);

  useEffect(() => {
    const simulacionEnCurso = localStorage.getItem("simulacionEnCurso");
  
    if (simulacionEnCurso === "true" && rutaInfo?.paradas?.length > 0) {
      setSimulacionActiva(true);
      let index = parseInt(localStorage.getItem("paradaActual")) || 0;
      setIndiceParada(index);
  
      const interval = setInterval(() => {
        // Verificar que rutaInfo y paradas existan antes de acceder
        if (!rutaInfo || !rutaInfo.paradas || rutaInfo.paradas.length === 0) {
          console.error("No hay información de paradas disponible.");
          clearInterval(interval);
          setSimulacionActiva(false);
          return;
        }
      
        // 🛑 **Verificamos que aún haya paradas disponibles**
        if (index < rutaInfo.paradas.length) {
          setParadasRecorridas((prev) => [...prev, rutaInfo.paradas[index]?.nombre || "Parada desconocida"]);
          index++;
          setIndiceParada(index);
          localStorage.setItem("paradaActual", index);
        } 
      
        // 🛑 **Si el bus llegó a la última parada, detenemos la simulación**
        if (index >= rutaInfo.paradas.length) {
          clearInterval(interval);
          setSimulacionActiva(false);
          localStorage.removeItem("simulacionEnCurso");
          localStorage.removeItem("paradaActual");
      
          // ⏳ **Esperar 1 segundo antes de mostrar la alerta y redirigir**
          setTimeout(() => {
            alert("🚏 Fin de la ruta. Redirigiendo a la pantalla de inicio...");
            navigate("/conductor/iniciar-ruta");
          }, 1000);
        }
      }, 5000);      
  
      return () => clearInterval(interval); // Limpieza del intervalo al desmontar
    }
  }, [rutaInfo]);

  const detenerRuta = () => {
    localStorage.removeItem("simulacionEnCurso");
    localStorage.removeItem("paradaActual");
    setSimulacionActiva(false);
    setParadasRecorridas([]);
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
  {/* Mensaje de fin de la ruta */}
  {paradasRecorridas.length === rutaInfo?.paradas?.length && (
    <h2 style={{ color: "green", textAlign: "center", fontSize: "20px" }}>
      🚏 Fin de la ruta
    </h2>
  )}
    {rutaInfo && conductor && conductor.rutaData ? (
            <>
              <ConductorRutaCheckInicio
                titulo={conductor.rutaData.nombre} // Mostrar el nombre de la ruta
                paradas={paradasRecorridas} // Solo mostrar paradas recorridas                
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