import { Link, useLocation } from 'react-router-dom';

export default function Navegacion() {
  const location = useLocation();

  const enlaces = [
    { path: '/', label: 'Disponibilidad' },
    { path: '/admin/vehiculos', label: 'Vehículos (ABM)' },
    { path: '/admin/clientes', label: 'Clientes (ABM)' },
    { path: '/reservar', label: 'Nueva Reserva' },
    { path: '/mis-reservas', label: 'Mis Reservas' },
    { path: '/historial', label: 'Historial' },
  ];

  return (
    <nav
      style={{
        backgroundColor: '#1f2937',
        padding: '1rem 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span style={{ color: '#60a5fa', fontSize: '1.5rem', fontWeight: 'bold' }}>
          🚗 Rentar
        </span>
      </div>

      <ul
        style={{
          display: 'flex',
          listStyle: 'none',
          margin: 0,
          padding: 0,
          gap: '1.5rem',
        }}
      >
        {enlaces.map((enlace) => {
          const activo = location.pathname === enlace.path;
          return (
            <li key={enlace.path}>
              <Link
                to={enlace.path}
                style={{
                  color: activo ? '#60a5fa' : '#f3f4f6',
                  textDecoration: 'none',
                  fontWeight: activo ? 'bold' : 'normal',
                  borderBottom: activo ? '2px solid #60a5fa' : 'none',
                  paddingBottom: '4px',
                  transition: 'color 0.2s',
                }}
              >
                {enlace.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}