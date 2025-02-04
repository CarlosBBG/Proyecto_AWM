import React, { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, Marker, Polyline, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// 🔹 MANTENER esta línea si antes funcionaba bien
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: null,
});

// Icono por defecto para los marcadores de paradas
const defaultIcon = new L.Icon({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: null,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

// Icono del bus
const busIcon = new L.Icon({
  iconUrl:
    "https://img.freepik.com/vector-gratis/etiqueta-engomada-historieta-autobus-escolar-fondo-blanco_1308-76579.jpg",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  shadowUrl: null,
});

// Ícono para paradas visitadas (verde)
const visitedIcon = new L.Icon({
  iconUrl: "https://maps.google.com/mapfiles/ms/icons/green-dot.png",
  iconRetinaUrl: "https://maps.google.com/mapfiles/ms/icons/green-dot.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const MapaInteractivo = ({ paradas, onParadaRecorrida, isActive }) => {
  const mapRef = useRef(null);

  // En este ejemplo usaremos la ruta óptima obtenida del backend para:
  // 1. Dibujar una polyline estática.
  // 2. Animar el marcador del bus a lo largo de esa ruta.
  const [rutaOptima, setRutaOptima] = useState([]);
  const [posicionBus, setPosicionBus] = useState(null);
  const [indiceRuta, setIndiceRuta] = useState(0);
  const [paradasRecorridas, setParadasRecorridas] = useState([]);

  // Para centrar el mapa solo una vez (al cargar la ruta)
  const [centrado, setCentrado] = useState(false);

  // 1) Cuando existan paradas, se consulta el endpoint para obtener la ruta óptima.
  // La ruta óptima es una secuencia de puntos (por ejemplo, [[lng, lat], [lng, lat], ...]).
  useEffect(() => {
    if (paradas && paradas.length > 0) {
      const coordsParaRutaOptima = paradas.map((p) => [
        parseFloat(p.longitud),
        parseFloat(p.latitud),
      ]);
      const API_URL = process.env.REACT_APP_API_URL;
      fetch(`${API_URL}/rutas/optima`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ coordenadas: coordsParaRutaOptima }),
      })
        .then((r) => r.json())
        .then((data) => {
          if (data && data.length > 0) {
            console.log("Ruta óptima recibida:", data);
            setRutaOptima(data);
            // Posición inicial del bus (tomamos el primer punto de la ruta óptima)
            setPosicionBus({ lat: data[0][1], lng: data[0][0] });
            setIndiceRuta(0);
            // Centrar el mapa una sola vez con los bounds de la ruta óptima
            if (!centrado && mapRef.current) {
              const bounds = L.latLngBounds(data.map(([lng, lat]) => [lat, lng]));
              mapRef.current.fitBounds(bounds);
              setCentrado(true);
            }
          } else {
            console.warn("La respuesta del backend está vacía.");
          }
        })
        .catch((error) => console.error("Error al cargar la ruta óptima:", error));
    }
  }, [paradas, centrado]);

  // 2) Dibujar la polyline estática utilizando la ruta óptima obtenida.
  // Si no se obtuvo la ruta óptima, se puede usar la secuencia de paradas (si se desea).
  const polylineRotaOptima =
    rutaOptima.length > 0
      ? rutaOptima.map(([lng, lat]) => [lat, lng])
      : paradas.map((p) => [parseFloat(p.latitud), parseFloat(p.longitud)]);

  // 3) Animar el bus a lo largo de la ruta óptima
  useEffect(() => {
    if (!isActive) return;
    if (rutaOptima.length <= 1) return;
    const start = rutaOptima[indiceRuta];
    const end = rutaOptima[indiceRuta + 1];
    if (!start || !end) return;
    const startTime = Date.now();
    const duracion = calcularDuracion(start, end);
    let reqId;
    const animarBus = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duracion, 1);
      const lat = start[1] + (end[1] - start[1]) * progress;
      const lng = start[0] + (end[0] - start[0]) * progress;
      setPosicionBus({ lat, lng });
      if (progress < 1) {
        reqId = requestAnimationFrame(animarBus);
      } else {
        if (indiceRuta < rutaOptima.length - 2) {
          setIndiceRuta(indiceRuta + 1);
        }
        verificarParadasRecorridas({ lat, lng });
      }
    };
    reqId = requestAnimationFrame(animarBus);
    return () => {
      cancelAnimationFrame(reqId);
    };
  }, [isActive, indiceRuta, rutaOptima]);

  // 4) Verificar si el bus pasa cerca de alguna parada (a menos de 30 metros)
  const verificarParadasRecorridas = (posBus) => {
    paradas.forEach((parada) => {
      const dist = calcularDistancia(
        posBus.lat,
        posBus.lng,
        parseFloat(parada.latitud),
        parseFloat(parada.longitud)
      );
      if (dist < 30 && !paradasRecorridas.includes(parada.id)) {
        setParadasRecorridas((prev) => [...prev, parada.id]);
        if (onParadaRecorrida) {
          onParadaRecorrida(parada.nombre);
        }
      }
    });
  };

  return (
    <MapContainer
      ref={mapRef}
      center={[0, 0]}
      zoom={13}
      style={{ height: "400px", width: "100%" }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {/* 4) Dibujar la polyline estática de la ruta óptima */}
      {polylineRotaOptima.length > 1 && (
        <Polyline
          positions={polylineRotaOptima}
          color="blue"
          weight={3}
          opacity={0.8}
          smoothFactor={1}
          lineJoin="round"
        />
      )}
      {/* 5) Marcadores de las paradas (usando defaultIcon o visitedIcon) */}
      {paradas.map((parada) => {
        const yaVisitada = paradasRecorridas.includes(parada.id);
        return (
          <Marker
            key={parada.id}
            position={[
              parseFloat(parada.latitud),
              parseFloat(parada.longitud),
            ]}
            icon={yaVisitada ? visitedIcon : defaultIcon}
          >
            <Popup>{parada.nombre}</Popup>
          </Marker>
        );
      })}
      {/* 6) Marcador del bus en movimiento */}
      {posicionBus && isActive && <BusMarker posicionBus={posicionBus} />}
    </MapContainer>
  );
};

const BusMarker = ({ posicionBus }) => {
  // Aquí no usamos flyTo para no recenterar el mapa, permitiendo zoom y pan
  return (
    <Marker position={[posicionBus.lat, posicionBus.lng]} icon={busIcon}>
      <Popup>🚌 Bus en movimiento</Popup>
    </Marker>
  );
};

function calcularDistancia(lat1, lng1, lat2, lng2) {
  const R = 6371000;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function calcularDuracion(start, end) {
  const distancia = calcularDistancia(start[1], start[0], end[1], end[0]);
  const velocidad = 60; // Velocidad en m/s (ajusta según necesites)
  return (distancia / velocidad) * 1000;
}

export default MapaInteractivo;
