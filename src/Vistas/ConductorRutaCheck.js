import React, { useEffect, useState } from "react";
import axios from "axios";
import Encabezado from "../Componentes/Encabezado";
import ConductorRutaCheckInicio from "../Componentes/ConductorRuta";
import { useNavigate } from "react-router-dom";
import BarraLateral from "../Componentes/BarraLateral";

function ConductorRutaCheck() {
  // Opciones de menú para ConductorMenu
  const menuItems = [
    { label: "Inicio", link: "/conductor/inicio" },
    { label: "Iniciar Ruta", link: "/conductor/iniciar-ruta" },
    { label: "Ver Estado de la Ruta", link: "/conductor/ruta-check" },
  ];

  const [conductor, setConductor] = useState(null); // Datos del conductor
  const [ruta, setRuta] = useState(null); // Datos de la ruta (incluye paradas)

  useEffect(() => {
    // Cargar datos del conductor
    axios
      .get("http://localhost:3001/conductores/1")
      .then((response) => {
        console.log("Conductor recibido:", response.data); // Depuración
        setConductor(response.data);

        // Cargar la ruta asociada al conductor
        return axios.get(`http://localhost:3001/rutas1/${response.data.ruta}`);
      })
      .then((response) => {
        console.log("Ruta recibida:", response.data); // Depuración
        setRuta(response.data);
      })
      .catch((error) => {
        console.error("Error al cargar los datos:", error);
      });
  }, []);

  const mapaRutaSrc =
    "https://www.google.com/maps/embed?pb=!1m26!1m12!1m3!1d38602.92260910906!2d-78.51359211517057!3d-0.24759756750560769!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m11!3e0!4m3!3m2!1d-0.2795632!2d-78.51527229999999!4m5!1s0x91d59a107e1cd44b%3A0x88a284f66939ed4!2sESCUELA%20POLIT%C3%89CNICA%20NACIONAL%2C%20Av.%20Ladr%C3%B3n%20de%20Guevara%20E11-253%2C%20Quito%20170143!3m2!1d-0.2124413!2d-78.4905842!5e0!3m2!1ses!2sec";

    const navigate = useNavigate();

  const detenerRuta = () => {
    //Me muestre un mensaje de alerta
    alert("La ruta ha sido detenida.");
    //Me redirija a la pantalla de Iniciar Ruta usando navigate
    navigate("/conductor/iniciar-ruta");
  };

  return (
    <div>
      <Encabezado />
      <div className="app-contenido">
        {/* Mostrar datos del conductor solo si existen */}
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

        {/* Mostrar las paradas de la ruta solo si existen */}
        {ruta ? (
          <ConductorRutaCheckInicio
            titulo={`RUTA: ${ruta.ruta}`}
            paradas={ruta.paradas.map((parada) => parada.nombre)} // Extrae los nombres de las paradas
            onBotonClick={detenerRuta}
            mapaSrc={mapaRutaSrc} // Ajusta según sea necesario
          />
        ) : (
          <p>Cargando datos de la ruta...</p>
        )}
      </div>
    </div>
  );
}

export default ConductorRutaCheck;
