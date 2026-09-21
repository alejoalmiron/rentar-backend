export default function Boton({ children, onClick, type = "button", variante = "primario" }) {
  const estilosVariantes = {
    primario: { backgroundColor: '#2563eb', color: '#ffffff' },  // Azul
    secundario: { backgroundColor: '#6b7280', color: '#ffffff' },// Gris
    peligro: { backgroundColor: '#dc2626', color: '#ffffff' }   // Rojo
  };

  const estiloSeleccionado = estilosVariantes[variante] || estilosVariantes.primario;

  return (
    <button
      type={type}
      onClick={onClick}
      style={{
        padding: '10px 18px',
        borderRadius: '6px',
        border: 'none',
        fontWeight: '600',
        cursor: 'pointer',
        fontSize: '14px',
        ...estiloSeleccionado // Se aplica el color correspondiente
      }}
    >
      {children}
    </button>
  )
};