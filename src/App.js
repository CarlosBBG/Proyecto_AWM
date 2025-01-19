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
import EstudiantePantallaInicio from "./Vistas/EstudiantePantallaInicio";
import RegistroEstudiantes from "./Vistas/RegistroEstudiantes";
import EstudianteSeleccionParada from "./Vistas/EstudianteSeleccionParada";
import EstudianteSeleccionRuta from "./Vistas/EstudianteSeleccionRuta";
import EstudianteRutaCheck from "./Vistas/EstudianteRutaCheck";
function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Rutas */}
          <Route path="/" element={<InicioSesion/>} />
          <Route path="/registro" element={<RegistroEstudiantes/>} />
          <Route path="/estudiante/inicio" element={<EstudiantePantallaInicio/>} />
          <Route path="/administrador/inicio" element={<AdministradorBienvenida />} />
          <Route path="/administrador/conductores" element={<AdministradorConductores />} />
          <Route path="/administrador/estudiantes" element={<AdministradorEstudiantes />} />
          <Route path="/administrador/rutas" element={<AdministradorRutas />} />
          <Route path="/conductor/inicio" element={<ConductorPantallaInicio />} />
          <Route path="/conductor/iniciar-ruta" element={<ConductorIniciarRuta />} />
          <Route path="/conductor/ruta-check" element={<ConductorRutaCheck />} />
          <Route path="/estudiante/parada" element={<EstudianteSeleccionParada/>}/>
          <Route path="/estudiante/ruta" element={<EstudianteSeleccionRuta/>}/>
          <Route path="/estudiante/ruta-check" element={<EstudianteRutaCheck/>}/>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
