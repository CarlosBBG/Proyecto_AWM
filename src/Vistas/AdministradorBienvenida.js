import React, { useState, useEffect } from "react";
import axios from "axios";
import Encabezado from "../Componentes/Encabezado";
import BarraLateral from "../Componentes/BarraLateral";
import MenuAdministrador from "../Componentes/MenuAdministrador";
import "./AdministradorBienvenida.css";

function AdministradorBienvenida() {
  const [administrador, setAdministrador] = useState(null);

  useEffect(() => {
    // Recuperar la información del administrador almacenada en localStorage
    const adminData = localStorage.getItem("usuario");
    const token = localStorage.getItem("token");

    if (adminData && token) {
      const parsedData = JSON.parse(adminData);
      setAdministrador(parsedData);

      // Opcional: Si necesitas hacer una solicitud al backend para obtener más datos del administrador
      axios.get(`http://localhost:8000/administradores/${parsedData.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(response => {
        setAdministrador(response.data);
      })
      .catch(error => {
        console.error('Error al cargar los datos del administrador:', error);
      });
    } else {
      // Si no hay información en localStorage, redirigir al inicio de sesión
      window.location.href = "/";
    }
  }, []);

  const menuItems = [
    { label: "Inicio", link: "/administrador/inicio" },
    { label: "Estudiantes", link: "/administrador/estudiantes" },
    { label: "Conductores", link: "/administrador/conductores" },
    { label: "Rutas", link: "/administrador/rutas" },
  ];

  return (
    <div className="app-container">
      <Encabezado />
      <div className="app-body">
        {administrador ? (
          <BarraLateral
            userName={`${administrador.nombre} ${administrador.apellido}`}
            userRole="Administrador"
            userIcon="https://cdn-icons-png.flaticon.com/512/5322/5322033.png"
            menuItems={menuItems}
          />
        ) : (
          <p>Cargando datos del administrador...</p>
        )}
        <MenuAdministrador />
      </div>
    </div>
  );
}

export default AdministradorBienvenida;