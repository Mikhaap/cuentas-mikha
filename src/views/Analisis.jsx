import { useFinance } from '../context/FinanceContext'
import Layout from '../components/common/Layout'
import PieChart from '../components/charts/PieChart'

export default function Analisis({ onNavigate }) {
  const { getTotalesMes, porcentajeGV } = useFinance()

  const { totalIng, totalGV, totalViv, totalFijo2, totalCuotas, totalAhorro } = getTotalesMes()

  const totalFijos = totalViv + totalFijo2 + totalCuotas
  const totalVars = totalGV
  const totalAhorroCalc = totalAhorro

  const pctFijos = totalIng > 0 ? (totalFijos / totalIng) * 100 : 0
  const pctVars = totalIng > 0 ? (totalVars / totalIng) * 100 : 0
  const pctAhorro = totalIng > 0 ? (totalAhorroCalc / totalIng) * 100 : 0

  const getAlertaFijos = () => {
    if (pctFijos >= 45 && pctFijos <= 55) {
      return { tipo: 'success', texto: '✅ Fijos: dentro del ideal (50%)' }
    } else if (pctFijos > 55) {
      return { tipo: 'warning', texto: `⚠️ Fijos: +${(pctFijos - 50).toFixed(1)}% sobre el ideal` }
    } else {
      return { tipo: 'warning', texto: `📉 Fijos: ${(50 - pctFijos).toFixed(1)}% bajo el ideal` }
    }
  }

  const getAlertaAhorro = () => {
    if (pctAhorro >= 20) {
      return { tipo: 'success', texto: '✅ Ahorro: meta lograda (20%+)' }
    } else if (pctAhorro >= 15) {
      return { tipo: 'warning', texto: `📈 Ahorro: ${(20 - pctAhorro).toFixed(1)}% para llegar al 20%` }
    } else {
      return { tipo: 'danger', texto: `🔴 Ahorro: ${(20 - pctAhorro).toFixed(1)}% bajo la meta` }
    }
  }

  const alertaFijos = getAlertaFijos()
  const alertaAhorro = getAlertaAhorro()

  return (
    <Layout title="📊 Análisis mensual" onBack={() => onNavigate('herramientas')} onHome={() => onNavigate('resumen')}>
      <div className="chart-container">
        <PieChart data={{ totalIng, totalFijos, totalVars, totalAhorro: totalAhorroCalc }} />
      </div>

      <div className="chart-legend">
        <div className="legend-item">
          <div className="legend-text">
            <span className="legend-color" style={{ background: '#a65a5a' }}></span>
            <span className="legend-label">Fijos (ideal 50%)</span>
          </div>
          <span className="legend-value">{pctFijos.toFixed(1)}%</span>
        </div>
        <div className="legend-item">
          <div className="legend-text">
            <span className="legend-color" style={{ background: '#d9a066' }}></span>
            <span className="legend-label">Variables (ideal 30%)</span>
          </div>
          <span className="legend-value">{pctVars.toFixed(1)}%</span>
        </div>
        <div className="legend-item">
          <div className="legend-text">
            <span className="legend-color" style={{ background: '#6a7f6d' }}></span>
            <span className="legend-label">Ahorro (ideal 20%)</span>
          </div>
          <span className="legend-value">{pctAhorro.toFixed(1)}%</span>
        </div>
      </div>

      <div className="alertas-container">
        <div className={`alerta alerta-${alertaFijos.tipo}`}>
          {alertaFijos.texto}
        </div>
        <div className={`alerta alerta-${alertaAhorro.tipo}`}>
          {alertaAhorro.texto}
        </div>
      </div>

      <div className="info-box">
        <p style={{ fontWeight: 600, marginBottom: '8px', color: '#3e3a36' }}>💡 Referencia:</p>
        <p style={{ marginBottom: '4px' }}>• Fijos: Alquiler, servicios, cuotas, salud</p>
        <p style={{ marginBottom: '4px' }}>• Variables: Comida, salidas, ropa, etc.</p>
        <p>• Ahorro: Inversiones, reservas, plazos fijos</p>
      </div>
    </Layout>
  )
}