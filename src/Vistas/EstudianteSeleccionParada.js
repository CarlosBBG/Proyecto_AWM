import './EstudianteSeleccionParada.css';
import React, { useState, useEffect } from 'react';
import BarraLateral from '../Componentes/BarraLateral';
import Encabezado from '../Componentes/Encabezado';
import axios from 'axios';

function EstudianteSeleccionParada() {
    const [paradas, setParadas] = useState([]);
    const [asientosDisponibles, setAsientosDisponibles] = useState(null);
    const [selectedParadaId, setSelectedParadaId] = useState(null);
    const [pendingParadaId, setPendingParadaId] = useState(null);
    const [estudiante, setEstudiante] = useState(null);

    const menuItems = [
        { label: "Inicio", link: "/estudiante/inicio" },
        { label: "Seleccionar Ruta", link: "/estudiante/ruta" },
        { label: "Seleccionar Parada", link: "/estudiante/parada" },
        { label: "Ver Estado de la Ruta", link: "/estudiante/ruta-check" },
    ];

    useEffect(() => {
        const storedUser = localStorage.getItem("usuario");
        if (!storedUser) {
            console.warn("No hay estudiante en localStorage. Redirigiendo...");
            window.location.href = "/";
            return;
        }

        const userData = JSON.parse(storedUser);
        const estudianteId = userData.id;

        axios
            .get(`http://localhost:8000/estudiantes/${estudianteId}`)
            .then((response) => {
                console.log("Estudiante recibido:", response.data);
                setEstudiante(response.data);
                setSelectedParadaId(response.data.parada);

                if (!response.data.ruta) {
                    console.warn("El estudiante no tiene una ruta asignada.");
                    return;
                }

                return axios.get(`http://localhost:8000/estudiantes/${estudianteId}/paradas`);
            })
            .then((response) => {
                if (response?.data) {
                    console.log("Paradas cargadas:", response.data);
                    setParadas(response.data);

                    if (response.data.length > 0) {
                        const rutaId = response.data[0].ruta;
                        return axios.get(`http://localhost:8000/rutas/${rutaId}`);
                    }
                }
            })
            .then((response) => {
                if (response?.data) {
                    console.log("Datos de la ruta recibidos:", response.data);
                    setAsientosDisponibles(response.data.asientos_disponibles);
                }
            })
            .catch((error) => {
                console.error("Error al cargar datos:", error);
            });
    }, []);

    const handleParadaClick = (id) => {
        if (pendingParadaId === id) {
            setPendingParadaId(null);
        } else {
            setPendingParadaId(id);
        }
    };

    const handleAccept = () => {
        if (!pendingParadaId) return;
    
        axios
            .put(`http://localhost:8000/estudiantes/${estudiante.id}/paradas`, { parada: pendingParadaId })
            .then((response) => {
                console.log(`Parada ${pendingParadaId} asignada al estudiante ${estudiante.id}.`);
                
                const { message } = response.data;
    
                // Actualizar el estado del estudiante y la parada seleccionada
                setSelectedParadaId(pendingParadaId);
                setPendingParadaId(null);
    
                // Si el número de asientos fue afectado, lo actualizamos
                if (!message.includes('Parada actualizada correctamente')) {
                    setAsientosDisponibles((prev) => Math.max(0, prev - 1));
                }
    
                alert(message);
            })
            .catch((error) => {
                console.error("Error al actualizar la parada:", error.response?.data?.message || error.message);
                alert(error.response?.data?.message || "Hubo un problema al actualizar la parada.");
            });
    };
    

    const handleCancel = () => {
        setPendingParadaId(null);
    };

    const handleRemoveSelection = () => {
        axios
            .put(`http://localhost:8000/estudiantes/${estudiante.id}/paradas`, { parada: null })
            .then(() => {
                console.log(`Parada eliminada para el estudiante ${estudiante.id}.`);
                setSelectedParadaId(null);

                // Incrementar los asientos disponibles
                setAsientosDisponibles((prev) => prev + 1);
                alert("Selección de parada eliminada correctamente.");
            })
            .catch((error) => {
                console.error("Error al eliminar la selección de parada:", error);
                alert("Hubo un problema al eliminar la selección de parada.");
            });
    };

    return (
        <div className="App">
            <Encabezado />
            <div className="app-contenido">
                {estudiante ? (
                    <BarraLateral
                        userName={`${estudiante.nombre} ${estudiante.apellido}`}
                        userRole={estudiante.rol || "Estudiante"}
                        userIcon={estudiante.icono || "https://cdn-icons-png.flaticon.com/128/2991/2991148.png"}
                        menuItems={menuItems}
                    />
                ) : (
                    <p>Cargando datos del estudiante...</p>
                )}
                <section className="pantalla-estudiante-seleccion-de-parada-container4">
                    <div className="container">
                        {!estudiante?.ruta ? (
                            <h2 style={{ color: 'red' }}>
                                Primero debe seleccionar una ruta para poder ver las paradas.
                            </h2>
                        ) : (
                            <>
                                <h1>Seleccione su parada:</h1>
                                {paradas.map((parada) => (
                                    <div
                                        key={parada.id}
                                        className={`bus-stop-card ${selectedParadaId === parada.id ? 'selected' : ''}`}
                                        onClick={() => handleParadaClick(parada.id)}
                                        style={{
                                            backgroundColor:
                                                pendingParadaId === parada.id
                                                    ? '#FFD700'
                                                    : selectedParadaId === parada.id
                                                    ? '#32A94C'
                                                    : '#c5b6e0',
                                        }}
                                    >
                                        <h2>{parada.nombre}</h2>
                                        {pendingParadaId === parada.id && (
                                            <div className="action-buttons">
                                                <button className="accept-button" onClick={handleAccept}>
                                                    Aceptar
                                                </button>
                                                <button className="cancel-button" onClick={handleCancel}>
                                                    Cancelar
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                ))}
                                {selectedParadaId && (
                                    <button className="remove-button" onClick={handleRemoveSelection}>
                                        Quitar selección de parada
                                    </button>
                                )}
                                {asientosDisponibles !== null && (
                                    <p id="seats-available" className="seats-available">
                                        Asientos disponibles: {asientosDisponibles}
                                    </p>
                                )}
                            </>
                        )}
                    </div>
                </section>
            </div>
        </div>
    );
}

export default EstudianteSeleccionParada;
