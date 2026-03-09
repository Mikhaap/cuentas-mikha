import { useFinance } from '../context/FinanceContext'
import { formatearMoneda } from '../utils/formatters'
import ProgressBar from '../components/charts/ProgressBar'

export default function Resumen({ onNavigate }) {
  const { 
    getTotalesMes, 
    porcentajeGV, 
    meses, 
    mesActual, 
    anioActual,
    setFiltroActual 
  } = useFinance()

  const {
    totalIng,
    totalGV,
    totalViv,
    totalFijo2,
    totalCuotas,
    totalAhorro,
    totalGastos,
    disponible
  } = getTotalesMes()

  const topeGV = totalIng * (porcentajeGV / 100)
  const porcentajeGastado = topeGV > 0 ? (totalGV / topeGV) * 100 : 0

  const handleNavigateMovimientos = (filtro) => {
    setFiltroActual(filtro)
    onNavigate('movimientos')
  }

  return (
    <div id="pantallaResumen">
      <div 
        className="bloque-verde" 
        onClick={() => onNavigate('encaja')}
      >
        <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>Disponible</div>
        <div style={{ fontSize: '2.2rem', fontWeight: 700 }}>
          {formatearMoneda(disponible)}
        </div>
      </div>

      <div className="resumen-botones">
        <div 
          className="resumen-boton" 
          onClick={() => handleNavigateMovimientos('ingreso')}
        >
          <div className="resumen-boton-label">Ingresos</div>
          <div className="resumen-boton-monto">{formatearMoneda(totalIng)}</div>
        </div>
        <div 
          className="resumen-boton" 
          onClick={() => handleNavigateMovimientos('gasto')}
        >
          <div className="resumen-boton-label">Gastos</div>
          <div className="resumen-boton-monto">{formatearMoneda(totalGastos)}</div>
        </div>
        <div 
          className="resumen-boton" 
          onClick={() => handleNavigateMovimientos('fijo4')}
        >
          <div className="resumen-boton-label">Ahorros</div>
          <div className="resumen-boton-monto">{formatearMoneda(totalAhorro)}</div>
        </div>
      </div>

      <div 
        className="gastos-variables-card" 
        onClick={() => handleNavigateMovimientos('gasto_variable')}
      >
        <div className="fila-gastos">
          <span className="gastos-titulo">Gastos Variables</span>
          <span className="gastos-monto">{formatearMoneda(totalGV)}</span>
        </div>
        <div className="tope-info">
          Tope: {formatearMoneda(topeGV)} ({Math.round(porcentajeGV)}% de ingresos)
        </div>
        <ProgressBar 
          actual={totalGV} 
          maximo={topeGV} 
          porcentaje={porcentajeGastado} 
        />
      </div>

      <div 
        className="bloque-bordo" 
        onClick={() => handleNavigateMovimientos('fijo1')}
      >
        <span className="fijo-izquierda">Fijos I</span>
        <span className="fijo-centro">Vivienda</span>
        <span className="fijo-derecha">{formatearMoneda(totalViv)}</span>
      </div>

      <div 
        className="bloque-bordo" 
        onClick={() => handleNavigateMovimientos('fijo2')}
      >
        <span className="fijo-izquierda">Fijos II</span>
        <span className="fijo-centro">Salud y otros</span>
        <span className="fijo-derecha">{formatearMoneda(totalFijo2)}</span>
      </div>

      <div 
        className="bloque-bordo" 
        onClick={() => handleNavigateMovimientos('fijo3')}
      >
        <span className="fijo-izquierda">Fijos III</span>
        <span className="fijo-centro">Cuotas</span>
        <span className="fijo-derecha">{formatearMoneda(totalCuotas)}</span>
      </div>

      <div 
        className="bloque-bordo" 
        onClick={() => handleNavigateMovimientos('fijo4')}
      >
        <span className="fijo-izquierda">Fijos IV</span>
        <span className="fijo-centro">Ahorros</span>
        <span className="fijo-derecha">{formatearMoneda(totalAhorro)}</span>
      </div>
    </div>
  )
}