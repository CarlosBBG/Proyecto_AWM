import React, { useState } from "react";
import "./RegistroEstudiante.css";

const RegistroEstudiante = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    correo: "",
    codigoUnico: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let error = "";
    let validValue = value;

    switch (name) {
      case "nombre":
      case "apellido":
        if (/\d/.test(value)) {
          error = "Este campo no puede contener números.";
          validValue = value.replace(/\d/g, "");
        }
        break;
      case "correo":
        if (value.includes("@")) {
          validValue = value.split("@")[0] + "@epn.edu.ec";
        }
        break;
      case "codigoUnico":
        if (!/^\d*$/.test(value)) {
          error = "Solo se permiten números.";
          validValue = value.replace(/\D/g, "");
        } else if (value.length > 9) {
          error = "El código único debe tener exactamente 9 números.";
          validValue = value.slice(0, 9);
        }
        break;
      case "password":
        if (
          value.length < 8 ||
          !/[A-Z]/.test(value) ||
          !/\d/.test(value) ||
          !/[!@#$%^&*(),.?":{}|<>]/.test(value)
        ) {
          error =
            "La contraseña debe tener al menos 8 caracteres, una letra mayúscula, un número y un carácter especial.";
        }
        break;
      default:
        break;
    }

    setErrors({ ...errors, [name]: error });
    setFormData({ ...formData, [name]: validValue });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  
    const formErrors = {};
  
    // Usa directamente el estado formData
    const trimmedData = {
      nombre: formData.nombre.trim(),
      apellido: formData.apellido.trim(),
      correo: formData.correo.trim(),
      codigoUnico: formData.codigoUnico.trim(),
      password: formData.password.trim(),
    };
  
    // Valida los campos
    if (!trimmedData.nombre) formErrors.nombre = "El nombre es requerido.";
    if (!trimmedData.apellido) formErrors.apellido = "El apellido es requerido.";
    if (!trimmedData.correo) formErrors.correo = "El correo es requerido.";
    if (!/^\d{9}$/.test(trimmedData.codigoUnico))
      formErrors.codigoUnico = "El código único debe tener 9 números.";
    if (!trimmedData.password)
      formErrors.password = "La contraseña es requerida.";
  
    setErrors(formErrors);
  
    // Si no hay errores, llama al prop `onSubmit`
    if (Object.keys(formErrors).length === 0) {
      if (onSubmit) {
        onSubmit(trimmedData);
      } else {
        console.error("El prop `onSubmit` no está definido.");
      }
    }
  };
  
  return (
    <div className="registro-estudiante-container">
      <div className="form-container">
        <h1>Registro de Estudiantes</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nombre</label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              placeholder="Ingrese su nombre"
            />
            {errors.nombre && <span className="error">{errors.nombre}</span>}
          </div>
          <div className="form-group">
            <label>Apellido</label>
            <input
              type="text"
              name="apellido"
              value={formData.apellido}
              onChange={handleChange}
              placeholder="Ingrese su apellido"
            />
            {errors.apellido && <span className="error">{errors.apellido}</span>}
          </div>
          <div className="form-group">
            <label>Correo Institucional</label>
            <input
              type="email"
              name="correo"
              value={formData.correo}
              onChange={handleChange}
              placeholder="Ingrese su correo"
            />
            {errors.correo && <span className="error">{errors.correo}</span>}
          </div>
          <div className="form-group">
            <label>Código Único</label>
            <input
              type="text"
              name="codigoUnico"
              value={formData.codigoUnico}
              onChange={handleChange}
              placeholder="Ingrese su código único"
            />
            {errors.codigoUnico && <span className="error">{errors.codigoUnico}</span>}
          </div>
          <div className="form-group password-container">
            <label>Contraseña</label>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Ingrese su contraseña"
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
            {errors.password && <span className="error">{errors.password}</span>}
          </div>
          <button type="submit" className="submit-btn">
            Registrar
          </button>
        </form>
      </div>
      <div className="bus-image">
        <img src={`${process.env.PUBLIC_URL}/polibus-logo-500h.png`} alt="School Bus" />
      </div>
    </div>
  );
};

export default RegistroEstudiante;
