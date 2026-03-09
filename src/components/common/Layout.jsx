export default function Layout({ children, title, onBack, onHome }) {
  return (
    <div className="pantalla-completa">
      <h2 className="pantalla-titulo">{title}</h2>
      {children}
      <div className="botones-inferiores">
        <button className="boton-inferior" onClick={onHome}>
          🏠 Inicio
        </button>
        <button className="boton-inferior" onClick={onBack}>
          🔧 Volver
        </button>
      </div>
    </div>
  )
}