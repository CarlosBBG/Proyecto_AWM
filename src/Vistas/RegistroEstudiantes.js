import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import RegistroEstudiante from "../Componentes/RegistroEstudiante";
import axios from "axios";

const RegistroEstudiantes = () => {
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  const handleStudentRegistration = async (data) => {
    try {
      // Deja que el backend genere el ID
      await axios.post(`${process.env.REACT_APP_API_URL}/estudiantes`, data);

      setSuccessMessage("Estudiante registrado exitosamente!");
      setTimeout(() => {
        setSuccessMessage("");
        navigate("/");
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
