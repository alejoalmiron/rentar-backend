import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navegacion from './components/Navegacion';

import DisponibilidadPagina from './pages/DisponibilidadPagina';
import NuevaReservaPagina from './pages/NuevaReservaPagina';
import ReservasPagina from './pages/ReservasPagina';
import HistorialPagina from './pages/HistorialPagina';
import VehiculosPagina from './pages/VehiculosPagina';
import ClientesPagina from './pages/ClientesPagina';

export default function App() {
  return (
    <Router>
      <Navegacion />
      <main style={{ 
        padding: '2rem', 
        backgroundColor: '#f9fafb', 
        minHeight: 'calc(100vh - 65px)',
        boxSizing: 'border-box'
      }}>
        <Routes>
          <Route path="/" element={<DisponibilidadPagina />} />
          <Route path="/reservar" element={<NuevaReservaPagina />} />
          <Route path="/mis-reservas" element={<ReservasPagina />} />
          <Route path="/historial" element={<HistorialPagina />} />
          <Route path="/admin/vehiculos" element={<VehiculosPagina />} />
          <Route path="/admin/clientes" element={<ClientesPagina />} />
        </Routes>
      </main>
    </Router>
  );
}