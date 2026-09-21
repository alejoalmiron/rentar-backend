import React, { useState, useEffect } from 'react';
import Card from '../components/Card';
import CampoTexto from '../components/CampoTexto';
import Boton from '../components/Boton';

import { getVehiculos, getClientes, crearReserva } from '../service/ConectarAlBackend';

export default function NuevaReservaPagina() {
  const [vehiculos, setVehiculos] = useState([]);
  const [clientes, setClientes] = useState([]);
  
  const [clienteDni, setClienteDni] = useState('');
  const [vehiculoPatente, setVehiculoPatente] = useState('');
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');

  const [cargando, setCargando] = useState(true);
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    async function cargarDatosIniciales() {
      try {
        setCargando(true);
        const [listaVehiculos, listaClientes] = await Promise.all([
          getVehiculos(),
          getClientes()
        ]);
        
        setVehiculos(Array.isArray(listaVehiculos) ? listaVehiculos : []);
        setClientes(Array.isArray(listaClientes) ? listaClientes : []);
      } catch (error) {
        alert('Error al cargar datos de clientes y vehículos desde el servidor.');
      } finally {
        setCargando(false);
      }
    }

    cargarDatosIniciales();
  }, []);

  const handleCrearReserva = async (e) => {
    e.preventDefault();

    if (!clienteDni || !vehiculoPatente || !fechaInicio || !fechaFin) {
      alert('Por favor, completá todos los campos obligatorios.');
      return;
    }

    setEnviando(true);

    const nuevaReservaData = {
      clienteDni,
      vehiculoPatente,
      fechaInicio,
      fechaFin
    };

    try {
      await crearReserva(nuevaReservaData);
      alert('¡Reserva creada exitosamente!');

      setClienteDni('');
      setVehiculoPatente('');
      setFechaInicio('');
      setFechaFin('');
    } catch (error) {
      alert('Error al procesar la reserva. Verificá si las fechas o la disponibilidad son válidas.');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <Card title="Nueva Reserva (Alta - REST)">
      {cargando ? (
        <p style={{ textAlign: 'center', color: '#6b7280' }}>Cargando datos del sistema...</p>
      ) : (
        <form onSubmit={handleCrearReserva}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '15px', marginBottom: '20px' }}>
            
            {/* Seleccionar Cliente */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <label style={{ fontWeight: '600', fontSize: '14px', color: '#374151' }}>Cliente *</label>
              <select
                value={clienteDni}
                onChange={(e) => setClienteDni(e.target.value)}
                style={{
                  padding: '10px',
                  borderRadius: '6px',
                  border: '1px solid #d1d5db',
                  fontSize: '14px',
                  backgroundColor: '#ffffff'
                }}
              >
                <option value="">Seleccionar Cliente</option>
                {clientes.map((c) => (
                  <option key={c.dni} value={c.dni}>
                    {c.apellido}, {c.nombre} (DNI: {c.dni})
                  </option>
                ))}
              </select>
            </div>

            {/* Seleccionar Vehículo */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <label style={{ fontWeight: '600', fontSize: '14px', color: '#374151' }}>Vehículo *</label>
              <select
                value={vehiculoPatente}
                onChange={(e) => setVehiculoPatente(e.target.value)}
                style={{
                  padding: '10px',
                  borderRadius: '6px',
                  border: '1px solid #d1d5db',
                  fontSize: '14px',
                  backgroundColor: '#ffffff'
                }}
              >
                <option value="">Seleccionar Vehículo</option>
                {vehiculos.map((v) => (
                  <option key={v.patente} value={v.patente}>
                    {v.marca} {v.modelo} - [{v.patente}]
                  </option>
                ))}
              </select>
            </div>

            {/* Fechas */}
            <CampoTexto 
              label="Fecha de Inicio *" 
              type="date" 
              value={fechaInicio} 
              onChange={(e) => setFechaInicio(e.target.value)} 
            />

            <CampoTexto 
              label="Fecha Fin *" 
              type="date" 
              value={fechaFin} 
              onChange={(e) => setFechaFin(e.target.value)} 
            />

          </div>

          <Boton type="submit" disabled={enviando}>
            {enviando ? 'Procesando...' : 'Confirmar Reserva'}
          </Boton>
        </form>
      )}
    </Card>
  );
}