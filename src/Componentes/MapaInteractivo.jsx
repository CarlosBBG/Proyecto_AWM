import React, { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, Marker, Polyline, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Configuración para íconos personalizados de Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const MapaInteractivo = ({ paradas }) => {
  const [rutaOptima, setRutaOptima] = useState([]); // Ruta óptima
  const mapRef = useRef(null); // Referencia al mapa

  useEffect(() => {
    if (paradas && paradas.length > 0) {
      // Convertir las paradas a coordenadas para enviar al backend
      const coordenadas = paradas.map((parada) => [
        parseFloat(parada.longitud),
        parseFloat(parada.latitud),
      ]);

      // Realizar la solicitud POST para obtener la ruta óptima
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

            // Ajustar el mapa para que muestre toda la ruta
            if (mapRef.current) {
              const bounds = L.latLngBounds(data.map(([lng, lat]) => [lat, lng])); // Crear los límites
              mapRef.current.fitBounds(bounds); // Ajustar los límites del mapa
            }
          } else {
            console.warn("La respuesta del backend está vacía o no contiene datos.");
          }
        })
        .catch((error) => {
          console.error("Error al cargar la ruta óptima:", error);
        });
    }
  }, [paradas]);

  return (
    <MapContainer
      ref={mapRef} // Pasar la referencia al contenedor del mapa
      center={[0, 0]} // Centro inicial (será ajustado automáticamente)
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
      {rutaOptima && rutaOptima.length > 0 && (
        <Polyline
          positions={rutaOptima.map(([lng, lat]) => [lat, lng])} // Convertir a [latitud, longitud]
          color="blue"
        />
      )}
    </MapContainer>
  );
};

export default MapaInteractivo;
