import React from 'react';
import './ConductorRutaInicio.css';
import MapaInteractivo from './MapaInteractivo';

const ConductorRutaInicio = ({ claseContenedor, tituloRuta, textoBoton, onIniciarRuta, paradas }) => {
  return (
    <div className={`conductor-ruta-inicio-contenedor ${claseContenedor}`}>
      <div className="conductor-ruta-inicio-max-ancho">
        <h1 className="conductor-ruta-inicio-titulo">{tituloRuta}</h1>
        <button className="conductor-ruta-inicio-boton" onClick={onIniciarRuta}>
          {textoBoton}
        </button>
      </div>
      <div className="conductor-ruta-inicio-mapa-contenedor">
        <MapaInteractivo paradas={paradas} />
      </div>
    </div>
  );
};

export default ConductorRutaInicio;
