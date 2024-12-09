import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import InicioSesion from "./Componentes/InicioSesion";
import ConductorIniciarRuta from "./Vistas/ConductorIniciarRuta";
import ConductorPantallaInicio from "./Vistas/ConductorPantallaInicio";
import ConductorRutaCheck from "./Vistas/ConductorRutaCheck";
import "./App.css";
import AdministradorBienvenida from "./Vistas/AdministradorBienvenida";
import AdministradorConductores from "./Vistas/AdministradorConductores";
import AdministradorEstudiantes from "./Vistas/AdministradorEstudiantes";
import AdministradorRutas from "./Vistas/AdministradorRutas";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Rutas */}
          <Route path="/" element={<InicioSesion/>} />
          <Route path="/administrador/inicio" element={<AdministradorBienvenida />} />
          <Route path="/administrador/conductores" element={<AdministradorConductores />} />
          <Route path="/administrador/estudiantes" element={<AdministradorEstudiantes />} />
          <Route path="/administrador/rutas" element={<AdministradorRutas />} />
          <Route path="/conductor/inicio" element={<ConductorPantallaInicio />} />
          <Route path="/conductor/iniciar-ruta" element={<ConductorIniciarRuta />} />
          <Route path="/conductor/ruta-check" element={<ConductorRutaCheck />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
