export default function NavBar({ currentView, onNavigate }) {
  const tabs = [
    { id: 'resumen', label: 'Resumen' },
    { id: 'movimientos', label: 'Movimientos' },
    { id: 'herramientas', label: 'Herramientas' }
  ]

  return (
    <nav className="tabs" style={{ marginTop: '16px' }}>
      {tabs.map(tab => (
        <button
          key={tab.id}
          className={`tab ${currentView === tab.id ? 'active' : ''}`}
          onClick={() => onNavigate(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </nav>
  )
}