import React, { Component } from 'react';
import './ConductorRutaCheck.css';

class ConductorRutaCheckInicio extends Component {
  

  render() {
    const { titulo, claseContenedor, paradas, onBotonClick, mapaSrc } = this.props;

    return (
      <div className={`ruta-check ${claseContenedor}`}>
        <h1 className="ruta-titulo">{titulo}</h1>
        <div className="ruta-contenido">
          <div className="paradas-contenedor">
          <h1>¡Paradas por las que ya pasó!</h1>
            {paradas.map((parada, index) => (
              <h2 key={index} className="parada">{parada}</h2>
            ))}
            <button className="boton-detener" onClick={onBotonClick}>
              Detener Ruta
            </button>
          </div>
          <iframe
            src={mapaSrc}
            title="Mapa de la ruta"
            width="600"
            height="450"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="mapa-google"
          ></iframe>
        </div>
      </div>
    );
  }
}

export default ConductorRutaCheckInicio;
