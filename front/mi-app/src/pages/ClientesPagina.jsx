import { useState, useEffect, useCallback } from 'react';
import Card from '../components/Card';
import CampoTexto from '../components/CampoTexto';
import Boton from '../components/Boton';
import Tabla from '../components/Tabla';

import { getClientes, crearCliente } from '../service/ConectarAlBackend';

export default function ClientesPagina() {
  const [clientes, setClientes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [enviando, setEnviando] = useState(false);

  const [dni, setDni] = useState('');
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [email, setEmail] = useState('');
  const [telefono, setTelefono] = useState('');

  const cargarListaClientes = useCallback(async () => {
    try {
      setCargando(true);
      const data = await getClientes();
      setClientes(Array.isArray(data) ? data : []);
    } catch {
      alert('Error al obtener la lista de clientes desde el servidor.');
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    Promise.resolve().then(cargarListaClientes);
  }, [cargarListaClientes]);

  const handleAgregarCliente = async (e) => {
    e.preventDefault();

    if (!dni || !nombre || !apellido || !email) {
      alert('Por favor, completá los campos obligatorios.');
      return;
    }

    setEnviando(true);

    const nuevoCliente = {
      dni: dni.trim(),
      nombre: nombre.trim(),
      apellido: apellido.trim(),
      email: email.trim(),
      telefono: telefono.trim()
    };

    try {
      await crearCliente(nuevoCliente);
      alert('¡Cliente registrado con éxito!');

      setDni('');
      setNombre('');
      setApellido('');
      setEmail('');
      setTelefono('');

      await cargarListaClientes();
    } catch {
      alert('Error al registrar el cliente. Verificá que el DNI o Email no estén duplicados.');
    } finally {
      setEnviando(false);
    }
  };

  const columnas = [
    { header: 'DNI', accessor: 'dni' },
    { header: 'Nombre', accessor: 'nombre' },
    { header: 'Apellido', accessor: 'apellido' },
    { header: 'Email', accessor: 'email' },
    { header: 'Teléfono', accessor: 'telefono' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Formulario de Alta de Cliente */}
      <Card title="Administración de Clientes (ABM - REST)">
        <form onSubmit={handleAgregarCliente}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginBottom: '20px' }}>
            <CampoTexto 
              label="DNI *" 
              placeholder="Ej: 38999111" 
              value={dni} 
              onChange={(e) => setDni(e.target.value)} 
            />
            <CampoTexto 
              label="Nombre *" 
              placeholder="Ej: Juan" 
              value={nombre} 
              onChange={(e) => setNombre(e.target.value)} 
            />
            <CampoTexto 
              label="Apellido *" 
              placeholder="Ej: Pérez" 
              value={apellido} 
              onChange={(e) => setApellido(e.target.value)} 
            />
            <CampoTexto 
              label="Email *" 
              type="email" 
              placeholder="Ej: juan.perez@email.com" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
            />
            <CampoTexto 
              label="Teléfono" 
              placeholder="Ej: 1122334455" 
              value={telefono} 
              onChange={(e) => setTelefono(e.target.value)} 
            />
          </div>

          <Boton type="submit" disabled={enviando}>
            {enviando ? 'Guardando...' : 'Agregar Cliente'}
          </Boton>
        </form>
      </Card>

      {/* Listado de Clientes */}
      <Card title={`Listado de Clientes Registrados (${clientes.length})`}>
        {cargando ? (
          <p style={{ textAlign: 'center', color: '#6b7280' }}>Cargando clientes...</p>
        ) : (
          <Tabla columnas={columnas} datos={clientes} />
        )}
      </Card>
    </div>
  );
}