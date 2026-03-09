import { useFinance } from '../../context/FinanceContext'
import MovementItem from './MovementItem'

export default function MovementList({ onEdit }) {
  const { getMovimientosFiltrados, getTotalFiltro, getNombreFiltro, filtroActual } = useFinance()
  
  const movimientos = getMovimientosFiltrados()

  if (movimientos.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">📭</div>
        <p>No hay movimientos</p>
      </div>
    )
  }

  return (
    <>
      {filtroActual !== 'todos' && (
        <div className="total-filtro">
          <span>🔍 Mostrando: {getNombreFiltro()}</span>
          <span>💰 Total: {new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(getTotalFiltro())}</span>
        </div>
      )}
      
      <ul className="lista-movimientos">
        {movimientos.slice(0, 100).map(m => (
          <MovementItem key={m.id} movement={m} onEdit={onEdit} />
        ))}
      </ul>
    </>
  )
}