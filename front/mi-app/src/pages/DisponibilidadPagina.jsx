import React, { useState } from 'react';
import Card from '../components/Card';
import CampoTexto from '../components/CampoTexto';
import Boton from '../components/Boton';
import Tabla from '../components/Tabla';

import { consultarGraphQL } from '../service/ConectarAlBackend';

export default function DisponibilidadPagina() {
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [tipo, setTipo] = useState('');
  const [marca, setMarca] = useState('');
  const [modelo, setModelo] = useState('');
  const [precioMin, setPrecioMin] = useState('');
  const [precioMax, setPrecioMax] = useState('');

  const [resultados, setResultados] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [buscado, setBuscado] = useState(false);

  const QUERY_DISPONIBILIDAD = `
    query ObtenerDisponibilidad(
      $fechaInicio: String!, 
      $fechaFin: String!, 
      $tipo: String, 
      $marca: String, 
      $modelo: String, 
      $precioMin: Float, 
      $precioMax: Float
    ) {
      vehiculosDisponibles(
        fechaInicio: $fechaInicio, 
        fechaFin: $fechaFin, 
        tipo: $tipo, 
        marca: $marca, 
        modelo: $modelo, 
        precioMin: $precioMin, 
        precioMax: $precioMax
      ) {
        patente
        marca
        modelo
        anio
        color
        tipo
        precioDiario
      }
    }
  `;

  const handleBuscar = async (e) => {
    e.preventDefault();
    if (!fechaInicio || !fechaFin) {
      alert('Las fechas de inicio y fin son obligatorias.');
      return;
    }

    setCargando(true);
    setBuscado(true);

    try {
      const variables = {
        fechaInicio,
        fechaFin,
        tipo: tipo || null,
        marca: marca || null,
        modelo: modelo || null,
        precioMin: precioMin ? parseFloat(precioMin) : null,
        precioMax: precioMax ? parseFloat(precioMax) : null,
      };

      const respuesta = await consultarGraphQL(QUERY_DISPONIBILIDAD, variables);
      
      if (respuesta?.data?.vehiculosDisponibles) {
        setResultados(respuesta.data.vehiculosDisponibles);
      } else {
        setResultados([]);
      }
    } catch (error) {
      alert('Error al conectar con el servidor GraphQL');
    } finally {
      setCargando(false);
    }
  };

  const columnas = [
    { header: 'Patente', accessor: 'patente' },
    { header: 'Marca', accessor: 'marca' },
    { header: 'Modelo', accessor: 'modelo' },
    { header: 'Año', accessor: 'anio' },
    { header: 'Color', accessor: 'color' },
    { header: 'Tipo', accessor: 'tipo' },
    { header: 'Precio Diario', accessor: (row) => `$${row.precioDiario}` },
  ];

  return (
    <Card title="Consultar Disponibilidad de Vehículos">
      <form onSubmit={handleBuscar}>
        <Boton type="submit" disabled={cargando}>
          {cargando ? 'Buscando...' : 'Buscar Disponibles'}
        </Boton>
      </form>

      {buscado && (
        <div style={{ marginTop: '20px' }}>
          <h3>Vehículos Disponibles ({resultados.length})</h3>
          <Tabla columnas={columnas} datos={resultados} />
        </div>
      )}
    </Card>
  );
}