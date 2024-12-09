import React from "react";
import './ConductorBienvenida.css';

const ConductorBienvenida = ({mensaje, imagen}) => {
  return (
    <div className="conductor-bienvenida-container">
      <p className="conductor-bienvenida-mensaje">{mensaje}</p>
      <p className="conductor-bienvenida-mensaje">¡Aquí podrás iniciar y ver el detalle de tu ruta asignada!</p>
      <img src={imagen} alt="PoliBus-Logo" />
    </div>
  );
}


export default ConductorBienvenida;