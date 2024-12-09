import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./InicioSesion.css";

const InicioSesion = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      // Consultar conductores
      const conductoresResponse = await axios.get(
        `http://localhost:3001/conductores`
      );
      const conductores = conductoresResponse.data;

      // Validar si es conductor
      const conductor = conductores.find(
        (c) => c.correo === email && c.password === password
      );

      if (conductor) {
        console.log("Conductor encontrado:", conductor);
        localStorage.setItem("usuario", JSON.stringify(conductor));
        navigate("/conductor/inicio");
        return;
      }

      // Consultar administradores
      const administradoresResponse = await axios.get(
        `http://localhost:3001/administradores`
      );
      const administradores = administradoresResponse.data;

      // Validar si es administrador
      const administrador = administradores.find(
        (a) => a.correo === email && a.password === password
      );

      if (administrador) {
        console.log("Administrador encontrado:", administrador);
        localStorage.setItem("usuario", JSON.stringify(administrador));
        navigate("/administrador/inicio");
        return;
      }

      // Si no se encuentra, mostrar error
      alert("Correo o contraseña incorrectos");

    } catch (error) {
      console.error("Error al validar las credenciales:", error);
    }
  };

  return (
    <div className="inicio-sesion-contenedor">
      <div className="inicio-sesion-max-ancho">
        <div className="inicio-sesion-logo">
          <img
            src="https://ici2st.epn.edu.ec/eventosAnteriores/ICI2ST2023/images/ici2st2023/Logo_EPN.png"
            alt="Logo EPN"
            className="inicio-sesion-logo-epn"
          />
          <h2 className="inicio-sesion-titulo-principal">
            SISTEMA DE TRANSPORTE ESTUDIANTIL
          </h2>
          <img
            src="/polibus-logo-500h.png"
            alt="Icono Transporte"
            className="inicio-sesion-logo-secundario"
          />
        </div>
        <div className="inicio-sesion-formulario">
          <h2 className="inicio-sesion-titulo">Iniciar Sesión</h2>
          <form className="inicio-sesion-campos" onSubmit={handleLogin}>
            <div className="inicio-sesion-campo">
              <label htmlFor="email">Correo</label>
              <input
                type="email"
                id="email"
                placeholder="alguien@example.com"
                required
                className="inicio-sesion-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="inicio-sesion-campo">
              <label htmlFor="password">Contraseña</label>
              <input
                type="password"
                id="password"
                placeholder="Contraseña"
                required
                className="inicio-sesion-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button type="submit" className="inicio-sesion-boton">
              Ingresar
            </button>
          </form>
          <p className="inicio-sesion-registro">
            ¿No estás registrado?{" "}
            <span className="inicio-sesion-link">Regístrate</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default InicioSesion;
