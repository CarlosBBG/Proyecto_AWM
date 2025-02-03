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
      // Hacer la solicitud POST a /api/login (o la ruta que uses en tu backend)
      const response = await axios.post('http://localhost:8000/login', {
        correo: email,
        password: password,
      });

      // El servidor responde con el usuario y el token
      const { token, ...user } = response.data;
      console.log('Usuario logueado:', user);

      // Guardar el usuario y el token en localStorage
      localStorage.setItem('usuario', JSON.stringify(user));
      localStorage.setItem('token', token);

      // Redirigir según el role
      if (user.role === 'admin') {
        navigate('/administrador/inicio');
      } else if (user.role === 'conductor') {
        navigate('/conductor/inicio');
      } else if (user.role === 'estudiante') {
        navigate('/estudiante/inicio');
      } else {
        // Fallback si en un futuro agregas más roles
        alert('Rol desconocido');
      }
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      if (error.response && error.response.status === 401) {
        alert('Correo o contraseña incorrectos');
      } else {
        alert('Ocurrió un error en el servidor');
      }
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
            <span className="inicio-sesion-link" onClick={() => navigate("/registro")}>Regístrate</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default InicioSesion;