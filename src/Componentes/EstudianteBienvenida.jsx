import React from "react";
import './EstudianteBienvenida.css';

const EstudianteBienvenida = ({mensaje, imagen}) => {
  return (
    <div className="estudiante-bienvenida-container">
      <p className="estudiante-bienvenida-mensaje">{mensaje}</p>
      <p className="estudiante-bienvenida-mensaje">¡Aquí podrás ver el detalle de las rutas de los Polibuses y seguir su recorrido!</p>
      <img src={imagen} alt="PoliBus-Logo" />
    </div>
  );
}


export default EstudianteBienvenida;