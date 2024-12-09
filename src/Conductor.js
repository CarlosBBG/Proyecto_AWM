import React from 'react';
import Encabezado from './Componentes/Encabezado';
import ConductorMenu from './Componentes/ConductorMenu';
import ConductorRutaInicio from './Componentes/ConductorRutaInicio';
import ConductorRutaCheck from './Componentes/ConductorRutaCheck'; 
import './Conductor.css';

// Opciones de menú para ConductorMenu
const menuItems = [
  { label: 'Inicio', link: '#inicio' },
  { label: 'Iniciar Ruta', link: '#estudiantes' },
  { label: 'Ver Estado de la Ruta', link: '#conductores' },
];

//Conductor
const conductor = {
  nombre: 'Carlos Rivera',
  rol: 'Conductor',
  icono: 'https://cdn-icons-png.flaticon.com/128/1464/1464721.png',
};

//Mapa de la ruta inicial
const maapaInicialSrc = "https://www.google.com/maps/embed?pb=!1m28!1m12!1m3!1d43187.25868662508!2d-78.52596115282607!3d-0.24946750913633772!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m13!3e0!4m5!1s0x91d5a27340683463%3A0xdfb5eabd7bf000e1!2sEstacion%20Transferencia%20Ecovia%20-%20El%20Capul%C3%AD%2C%20Calle%205%2C%20Quito!3m2!1d-0.29960139999999996!2d-78.5420267!4m5!1s0x91d59a107e1cd44b%3A0x88a284f66939ed4!2sESCUELA%20POLIT%C3%89CNICA%20NACIONAL%2C%20Av.%20Ladr%C3%B3n%20de%20Guevara%20E11-253%2C%20Quito%20170143!3m2!1d-0.2124413!2d-78.4905842!5e0!3m2!1ses!2sec!4v1730851738101!5m2!1ses!2sec";

//Mapa del estado de la ruta
const mapaRutaSrc = "https://www.google.com/maps/embed?pb=!1m26!1m12!1m3!1d38602.92260910906!2d-78.51359211517057!3d-0.24759756750560769!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m11!3e0!4m3!3m2!1d-0.2795632!2d-78.51527229999999!4m5!1s0x91d59a107e1cd44b%3A0x88a284f66939ed4!2sESCUELA%20POLIT%C3%89CNICA%20NACIONAL%2C%20Av.%20Ladr%C3%B3n%20de%20Guevara%20E11-253%2C%20Quito%20170143!3m2!1d-0.2124413!2d-78.4905842!5e0!3m2!1ses!2sec!4v1730853412701!5m2!1ses!2sec"

// Lista de paradas para ConductorRutaCheck
const paradas = ['Parada 1', 'Parada 2', 'Parada 3', 'Parada 4', 'Parada 5'];

// Función para manejar el inicio de la ruta
const iniciarRuta = () => {
  console.log('La ruta ha sido iniciada.');
};

// Función para manejar la detención de la ruta
const detenerRuta = () => {
  console.log('La ruta ha sido detenida.');
};

function Conductor() {
  return (
    <div className="App">
      <Encabezado />
      <div className="app-contenido">
        <ConductorMenu
          userName={conductor.nombre}
          userRole={conductor.rol}
          userIcon={conductor.icono}
          menuItems={menuItems}
        />
        <ConductorRutaInicio
          claseContenedor="ruta-personalizada"
          tituloRuta="RUTA: CAPULÍ"
          mapaSrc={maapaInicialSrc}
          textoBoton="Comenzar"
          onIniciarRuta={iniciarRuta}
        />
      </div>
      <Encabezado />
      <div className="app-contenido">
        <ConductorMenu
          userName={conductor.nombre}
          userRole={conductor.rol}
          userIcon={conductor.icono}
          menuItems={menuItems}
        />
        <ConductorRutaCheck
          titulo="RUTA: CAPULÍ"
          paradas={paradas}
          onBotonClick={detenerRuta}
          mapaSrc={mapaRutaSrc}
        />
      </div>
    </div>
  );
}

export default Conductor;
