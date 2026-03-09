import { useFinance } from '../context/FinanceContext'
import Filters from '../components/movements/Filters'
import MovementList from '../components/movements/MovementList'

export default function Movimientos({ onEdit }) {
  return (
    <div id="pantallaMovimientos">
      <Filters />
      <MovementList onEdit={onEdit} />
    </div>
  )
}