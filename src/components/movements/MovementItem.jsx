import { useState } from 'react'
import { useFinance } from '../../context/FinanceContext'
import { formatearMoneda } from '../../utils/formatters'

export default function MovementItem({ movement, onEdit }) {
  const [menuVisible, setMenuVisible] = useState(false)
  const { eliminarMovimiento } = useFinance()

  const getClaseTipo = (tipo) => {
    const clases = {
      'ingreso': 'ingreso',
      'gasto_variable': 'gasto-variable',
      'fijo1': 'fijo-i',
      'fijo2': 'fijo-ii',
      'fijo3': 'fijo-iii',
      'fijo4': 'fijo-iv'
    }
    return clases[tipo] || 'gasto-variable'
  }

  const getSigno = (tipo) => tipo === 'ingreso' ? '+' : '−'
  const getClaseSigno = (tipo) => tipo === 'ingreso' ? 'positivo' : 'negativo'

  const fecha = new Date(movement.fecha).toLocaleDateString('es-AR')
  
  let texto = movement.categoria
  if (movement.subcategoria) texto += ' · ' + movement.subcategoria
  if (movement.tarjeta) texto += ' · ' + movement.tarjeta + (movement.cuota ? ' ' + movement.cuota : '')

  const handleEliminar = () => {
    if (confirm('¿Eliminar este movimiento?')) {
      eliminarMovimiento(movement.id)
    }
    setMenuVisible(false)
  }

  const handleEditar = () => {
    onEdit(movement)
    setMenuVisible(false)
  }

  return (
    <li className={`item-mov ${getClaseTipo(movement.tipo)}`}>
      {/* Menú a la izquierda - CORRECCIÓN */}
      <div className="menu-mov" onClick={() => setMenuVisible(!menuVisible)}>
        <span>⋮</span>
        {menuVisible && (
          <div className="menu-desplegado-mov visible">
            <div className="menu-item-mov" onClick={handleEditar}>✏️ Editar</div>
            <div className="menu-item-mov" onClick={handleEliminar}>🗑️ Eliminar</div>
          </div>
        )}
      </div>

      {/* Contenido */}
      <div className="item-contenido">
        <div className="item-superior">
          <div className="item-info">
            <strong>{texto}</strong>
          </div>
          <div className={`item-monto ${getClaseSigno(movement.tipo)}`}>
            {getSigno(movement.tipo)} {formatearMoneda(movement.monto).replace('$ ', '')}
          </div>
        </div>
        <div className="item-fecha">{fecha}</div>
      </div>
    </li>
  )
}