import React, { useEffect, useState } from "react";
import axios from "axios";
import ConductorRutaInicio from "../Componentes/ConductorRutaInicio";
import Encabezado from "../Componentes/Encabezado";
import { useNavigate } from "react-router-dom";
import BarraLateral from "../Componentes/BarraLateral";

function ConductorIniciarRuta() {
  const menuItems = [
    { label: "Inicio", link: "/conductor/inicio" },
    { label: "Iniciar Ruta", link: "/conductor/iniciar-ruta" },
    { label: "Ver Estado de la Ruta", link: "/conductor/ruta-check" },
  ];

  const [conductor, setConductor] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // 1) Revisar si en localStorage está el usuario logueado
    const storedUser = localStorage.getItem("usuario");
    if (!storedUser) {
      console.warn("No hay conductor en localStorage. Redirigiendo al login...");
      navigate("/"); // O como manejes el caso sin sesión
      return;
    }

    // 2) Parsear y extraer el ID del conductor
    const userData = JSON.parse(storedUser);
    const conductorId = userData.id; // Asumiendo que el back te lo mandó como "id"

    // 3) Llamar al backend para obtener toda la info del conductor, incluido su rutaData
    //    (Recuerda en el backend hacer el `include: ['rutaData']` si usas Sequelize)
    axios
      .get(`http://localhost:8000/conductores/${conductorId}`)
      .then((response) => {
        console.log("Conductor recibido:", response.data);
        setConductor(response.data);
      })
      .catch((error) => {
        console.error("Error al cargar los datos del conductor:", error);
      });
  }, [navigate]);

  // EJEMPLO: si ya configuraste el backend para que el "rutaData" venga incluido:
  // {
  //   id: 2,
  //   nombre: 'Ana',
  //   apellido: 'Martinez',
  //   email: 'ana.martinez@example.com',
  //   ...
  //   rutaData: {
  //     id: 2,
  //     nombre_ruta: 'Ruta Guamaní',
  //     recorrido: 'EPN - Trébol - Guamaní',
  //     ...
  //   }
  // }

  const iniciarRuta = () => {
    alert("La ruta ha sido iniciada.");
    navigate("/conductor/ruta-check");
  };

  const mapaInicialSrc =
  "https://lc.cx/7yZjV4";

  // Si quieres usar la ruta real del conductor en el título:
  const tituloRuta = conductor?.rutaData
    ? `RUTA: ${conductor.rutaData.nombre}`
    : "RUTA DESCONOCIDA";

  return (
    <div>
      <Encabezado />
      <div className="app-contenido">
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
          mapaSrc={mapaInicialSrc}
          textoBoton="Comenzar"
          onIniciarRuta={iniciarRuta}
        />
      </div>
    </div>
  );
}

export default ConductorIniciarRuta;
