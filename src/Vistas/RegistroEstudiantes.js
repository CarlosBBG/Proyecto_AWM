import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import RegistroEstudiante from "../Componentes/RegistroEstudiante";
import axios from "axios";

const RegistroEstudiantes = () => {
  const [successMessage, setSuccessMessage] = useState(""); // Estado para el mensaje de éxito
  const navigate = useNavigate(); // Hook para redirigir

  const handleStudentRegistration = async (data) => {
    try {
      // Obtiene la lista actual de estudiantes
      const response = await axios.get("http://localhost:3001/estudiantes");
      const estudiantes = response.data;

      // Genera un nuevo ID
      const newId =
        estudiantes.length > 0
          ? String(Math.max(...estudiantes.map((item) => Number(item.id))) + 1)
          : "1";

      // Crea el nuevo registro
      const recordToAdd = { id: newId, ...data };

      // Agrega el nuevo registro a la base de datos
      await axios.post("http://localhost:3001/estudiantes", recordToAdd);

      // Muestra el mensaje de éxito y redirige
      setSuccessMessage("Estudiante registrado exitosamente!");
      setTimeout(() => {
        setSuccessMessage(""); // Limpia el mensaje después de 3 segundos
        navigate("/"); // Redirige al inicio
      }, 3000);
    } catch (error) {
      console.error("Error al registrar al estudiante:", error);
      alert("Hubo un error al registrar al estudiante.");
    }
  };

  return (
    <div className="app-container">
      {successMessage && <div className="success-message">{successMessage}</div>}
      <RegistroEstudiante onSubmit={handleStudentRegistration} />
    </div>
  );
};

export default RegistroEstudiantes;
