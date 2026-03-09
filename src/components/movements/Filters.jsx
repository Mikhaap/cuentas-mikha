import { useState } from 'react'
import { useFinance } from '../../context/FinanceContext'

export default function Filters() {
  const [menuVisible, setMenuVisible] = useState(false)
  const { filtroActual, setFiltroActual, textoBusqueda, setTextoBusqueda } = useFinance()

  const handleFiltroClick = (filtro) => {
    setFiltroActual(filtro)
    setMenuVisible(false)
  }

  return (
    <>
      <div className="filtros-rapidos">
        <button 
          className={`btn-filtro ${filtroActual === 'todos' ? 'activo' : ''}`}
          onClick={() => handleFiltroClick('todos')}
        >
          Todos
        </button>
        <button 
          className={`btn-filtro ${filtroActual === 'alumna' ? 'activo' : ''}`}
          onClick={() => handleFiltroClick('alumna')}
        >
          Alumnas
        </button>
        <button 
          className={`btn-filtro ${!['todos', 'alumna'].includes(filtroActual) ? 'activo' : ''}`}
          onClick={() => setMenuVisible(!menuVisible)}
        >
          Otros filtros ▼
        </button>
        
        {menuVisible && (
          <div className="menu-desplegable visible">
            <div className="menu-seccion">
              <div className="menu-seccion-titulo">📌 Ingresos</div>
              <div className="menu-item" onClick={() => handleFiltroClick('ingreso_escuela')}>Escuela</div>
              <div className="menu-item" onClick={() => handleFiltroClick('ingreso_alumna')}>Alumnas</div>
              <div className="menu-item" onClick={() => handleFiltroClick('ingreso_mesanterior')}>Mes anterior</div>
              <div className="menu-item" onClick={() => handleFiltroClick('ingreso_otras')}>Otras opciones</div>
            </div>
            <div className="menu-seccion">
              <div className="menu-seccion-titulo">📌 Gastos</div>
              <div className="menu-item" onClick={() => handleFiltroClick('gasto_variable')}>Gastos variables</div>
              <div className="menu-item" onClick={() => handleFiltroClick('fijo1')}>Fijos I (Vivienda)</div>
              <div className="menu-item" onClick={() => handleFiltroClick('fijo2')}>Fijos II (Salud y otros)</div>
              <div className="menu-item" onClick={() => handleFiltroClick('fijo3')}>Fijos III (Cuotas)</div>
              <div className="menu-item" onClick={() => handleFiltroClick('fijo4')}>Fijos IV (Ahorro)</div>
            </div>
          </div>
        )}
      </div>

      <input 
        type="text" 
        className="buscador" 
        placeholder="🔍 Buscar (ej: psicóloga, carne, julia...)"
        value={textoBusqueda}
        onChange={(e) => setTextoBusqueda(e.target.value)}
      />
    </>
  )
}