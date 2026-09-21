export default function Card({ title, children }) {
  return (
    <section
      style={{
        backgroundColor: '#ffffff',
        border: '1px solid #e5e7eb',
        borderRadius: '8px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)',
        padding: '24px',
        textAlign: 'left',
      }}
    >
      {title && (
        <h2 style={{ margin: '0 0 20px', color: '#1f2937', fontSize: '20px' }}>
          {title}
        </h2>
      )}
      {children}
    </section>
  );
}
