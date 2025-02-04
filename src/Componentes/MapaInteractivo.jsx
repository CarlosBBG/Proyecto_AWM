import React, { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, Marker, Polyline, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Configuración para íconos personalizados de Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const busIcon = new L.Icon({
  iconUrl: "https://img.freepik.com/vector-gratis/etiqueta-engomada-historieta-autobus-escolar-fondo-blanco_1308-76579.jpg?t=st=1738635777~exp=1738639377~hmac=92dd9331daf1393887c3bc695283fcbfee2e4aa41b386e53e7d95b5889c2bc32&w=996", // Ícono amarillo
  iconSize: [32, 32], 
  iconAnchor: [16, 32], 
});

const MapaInteractivo = ({ paradas }) => {
  const [rutaOptima, setRutaOptima] = useState([]); // Ruta óptima
  const [posicionBus, setPosicionBus] = useState(null);
  const mapRef = useRef(null); // Referencia al mapa

  useEffect(() => {
    if (paradas && paradas.length > 0) {
      // Obtener la ruta óptima desde el backend
      const coordenadas = paradas.map((parada) => [
        parseFloat(parada.longitud),
        parseFloat(parada.latitud),
      ]);

      fetch("http://localhost:8000/rutas/optima", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ coordenadas }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data && data.length > 0) {
            console.log("Ruta óptima recibida:", data);
            setRutaOptima(data);
            if (mapRef.current) {
              const bounds = L.latLngBounds(data.map(([lng, lat]) => [lat, lng]));
              mapRef.current.fitBounds(bounds);
            }
          } else {
            console.warn("La respuesta del backend está vacía.");
          }
        })
        .catch((error) => console.error("Error al cargar la ruta óptima:", error));
    }
  }, [paradas]);

  // Actualizar la posición del bus conforme avanza la simulación
  useEffect(() => {
    const actualizarPosicionBus = () => {
      const indexActual = parseInt(localStorage.getItem("paradaActual")) || 0;
      if (paradas && indexActual < paradas.length) {
        setPosicionBus({
          lat: parseFloat(paradas[indexActual].latitud),
          lng: parseFloat(paradas[indexActual].longitud),
        });
      }
    };

    actualizarPosicionBus(); // Llamar inmediatamente para la primera actualización

    // Escuchar cambios en localStorage para actualizar la posición del bus
    const interval = setInterval(() => {
      actualizarPosicionBus();
    }, 5000); // Se actualiza cada 5 segundos

    return () => clearInterval(interval); // Limpieza del intervalo
  }, [paradas]);

  return (
    <MapContainer
      ref={mapRef}
      center={[0, 0]}
      zoom={13}
      style={{ height: "400px", width: "100%" }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      {/* Marcadores de las paradas */}
      {paradas &&
        paradas.map((parada) => (
          <Marker key={parada.id} position={[parseFloat(parada.latitud), parseFloat(parada.longitud)]}>
            <Popup>{parada.nombre}</Popup>
          </Marker>
        ))}

      {/* Dibujar la línea de la ruta óptima */}
      {rutaOptima.length > 0 && (
        <Polyline positions={rutaOptima.map(([lng, lat]) => [lat, lng])} color="blue" />
      )}

      {/* Marcador del bus */}
      {posicionBus && <BusMarker posicionBus={posicionBus} />}
    </MapContainer>
  );
};

// Componente para centrar el mapa en la posición del bus
const BusMarker = ({ posicionBus }) => {
  const map = useMap();

  useEffect(() => {
    if (posicionBus) {
      map.flyTo([posicionBus.lat, posicionBus.lng], map.getZoom(), {
        animate: true,
        duration: 1.5, // Suavizar el movimiento
      });
    }
  }, [posicionBus, map]);

  return (
    <Marker position={[posicionBus.lat, posicionBus.lng]} icon={busIcon}>
      <Popup>🚌 Bus en movimiento</Popup>
    </Marker>
  );
};

export default MapaInteractivo;
