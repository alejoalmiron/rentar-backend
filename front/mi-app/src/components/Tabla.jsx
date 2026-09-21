export default function Tabla({ columnas = [], datos = [], renderFila }) {
  if (!datos || datos.length === 0) {
    return (
      <div style={{
        padding: '2rem',
        textAlign: 'center',
        backgroundColor: '#ffffff',
        borderRadius: '8px',
        border: '1px solid #e5e7eb',
        color: '#6b7280'
      }}>
        No hay datos registrados para mostrar.
      </div>
    );
  }

  return (
    <div style={{ overflowX: 'auto', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
      <table style={{
        width: '100%',
        borderCollapse: 'collapse',
        backgroundColor: '#ffffff',
        textAlign: 'left',
        fontSize: '14px'
      }}>
        <thead>
          <tr style={{ backgroundColor: '#f3f4f6', borderBottom: '1px solid #e5e7eb' }}>
            {columnas.map((col, index) => (
              <th key={index} style={{ padding: '12px 16px', fontWeight: '600', color: '#374151' }}>
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {datos.map((item, index) => (
            <tr 
              key={item.id || index} 
              style={{ borderBottom: '1px solid #f3f4f6' }}
            >
              {renderFila(item)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}