import React from 'react';
import './ConductorRutaCheck.css';

const ConductorRutaCheck = ({ titulo, claseContenedor, paradas, onBotonClick, mapaSrc }) => {
  return (
    <div className={`ruta-check ${claseContenedor}`}>
      <h1 className="ruta-titulo">{titulo}</h1>
      <div className="ruta-contenido">
        <div className="paradas-contenedor">
          <h1>¡Paradas por las que ya pasó!</h1>
          {paradas.map((parada, index) => (
            <div
              key={index}
              className={`parada ${index < 2 ? 'primera-parada' : ''}`}
            >
              <span>{parada}</span>
              {index < 2 && (
                <img
                  src="https://cdn-icons-png.flaticon.com/128/8215/8215539.png"
                  alt="Visto"
                  className="parada-icono"
                />
              )}
            </div>
          ))}
          <button className="boton-detener" onClick={onBotonClick}>
            Detener Ruta
          </button>
        </div>
        <iframe
          src={mapaSrc}
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
};

export default ConductorRutaCheck;
