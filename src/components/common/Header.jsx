import { useFinance } from '../../context/FinanceContext'

export default function Header() {
  const { meses, mesActual, anioActual, setMesActual } = useFinance()

  return (
    <header className="header">
      <h1>💰 Cuentas · Mikha</h1>
      <div className="mes-selector">
        <select 
          value={mesActual} 
          onChange={(e) => setMesActual(parseInt(e.target.value))}
        >
          {meses.map((mes, idx) => (
            <option key={idx} value={idx}>{mes}</option>
          ))}
        </select>
        <span>{anioActual}</span>
      </div>
    </header>
  )
}