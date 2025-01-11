import React, { useEffect, useState } from "react";
import axios from "axios";
import Encabezado from "../Componentes/Encabezado";
import ConductorRutaCheckInicio from "../Componentes/ConductorRuta";
import { useNavigate } from "react-router-dom";
import BarraLateral from "../Componentes/BarraLateral";

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

  const mapaRutaSrc =
    "https://www.google.com/maps/embed?pb=!1m26!1m12!1m3!1d38602.92260910906!2d-78.51359211517057!3d-0.24759756750560769!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m11!3e0!4m3!3m2!1d-0.2795632!2d-78.51527229999999!4m5!1s0x91d59a107e1cd44b%3A0x88a284f66939ed4!2sESCUELA%20POLIT%C3%A9CNICA%20NACIONAL%2C%20Av.%20Ladr%C3%B3n%20de%20Guevara%20E11-253%2C%20Quito%20170143!3m2!1d-0.2124413!2d-78.4905842!5e0!3m2!1ses!2sec";

  return (
    <div>
      <Encabezado />
      <div className="app-contenido">
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

        {rutaInfo && conductor && conductor.rutaData ? (
          <ConductorRutaCheckInicio
            titulo={`RUTA: ${conductor.rutaData.nombre}`} // Mostrar el nombre de la ruta
            paradas={rutaInfo.paradas.map((parada) => parada.nombre)} // Extraemos los nombres de las paradas
            onBotonClick={detenerRuta}
            mapaSrc={mapaRutaSrc} // Mapa estático o dinámico
          />
        ) : (
          <p>Cargando datos de la ruta y paradas...</p>
        )}
      </div>
    </div>
  );
}

export default ConductorRutaCheck;
