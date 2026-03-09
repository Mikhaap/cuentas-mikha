import { useState } from 'react'
import { useFinance } from '../context/FinanceContext'
import Layout from '../components/common/Layout'
import { formatearMoneda, formatearNumeroInput } from '../utils/formatters'

export default function EnCaja({ onNavigate }) {
  const { 
    billeteras, 
    agregarBilletera, 
    eliminarBilletera,
    actualizarSaldoBilletera,
    saldosBilleteras,
    mesActual,
    anioActual,
    getTotalCaja,
    getDiferenciaCaja,
    registrarMargenError,
    getTotalesMes
  } = useFinance()

  const [nuevaBilletera, setNuevaBilletera] = useState('')

  const mesKey = `${anioActual}-${mesActual}`
  const totalReal = getTotalCaja()
  const { disponible } = getTotalesMes()
  const diferencia = getDiferenciaCaja()

  const getSignoDiferencia = () => {
    if (diferencia > 0) return '💰 sobrante'
    if (diferencia < 0) return '🔴 faltante'
    return '✅ coincide'
  }

  const handleAgregarBilletera = () => {
    const nombre = prompt('Nombre de la nueva billetera:')
    if (nombre && nombre.trim()) {
      agregarBilletera(nombre.trim())
    }
  }

  const handleRegistrarMargen = () => {
    const resultado = registrarMargenError()
    if (!resultado) {
      alert('No hay diferencia. Todo coincide.')
      return
    }
    
    const { tipo, monto, diferencia: dif } = resultado
    const mensaje = dif > 0 
      ? `⚠️ Se registró un INGRESO de $${monto.toLocaleString('es-AR')} por sobrante en caja.`
      : `✅ Se registró un GASTO de $${monto.toLocaleString('es-AR')} por faltante en caja.`
    alert(mensaje)
  }

  const handleMontoChange = (billetera, valor) => {
    const numeros = valor.replace(/\D/g, '')
    const monto = parseFloat(numeros) || 0
    actualizarSaldoBilletera(billetera, monto)
  }

  return (
    <Layout 
      title="💰 En Caja" 
      onBack={() => onNavigate('herramientas')}
      onHome={() => onNavigate('resumen')}
    >
      <div id="billeterasContainer">
        {billeteras.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#7f6b5a', padding: '16px' }}>
            No hay billeteras. Agregá una con el botón de abajo.
          </p>
        ) : (
          billeteras.map((b, index) => {
            const saldo = saldosBilleteras[mesKey]?.[b] || 0
            return (
              <div key={b} className="fila-billetera">
                <input 
                  type="text" 
                  value={b} 
                  readOnly
                  placeholder="Nombre"
                />
                <input 
                  type="text" 
                  className="monto-con-formato"
                  value={saldo ? formatearNumeroInput(saldo.toString()) : ''}
                  placeholder="$0"
                  onChange={(e) => handleMontoChange(b, e.target.value)}
                  onBlur={(e) => e.target.value = formatearMoneda(saldosBilleteras[mesKey]?.[b] || 0).replace('$ ', '')}
                  onFocus={(e) => e.target.value = saldosBilleteras[mesKey]?.[b] || ''}
                />
                <button onClick={() => eliminarBilletera(index)}>🗑️</button>
              </div>
            )
          })
        )}
      </div>

      <button className="btn-herramienta" onClick={handleAgregarBilletera}>
        ➕ Agregar billetera
      </button>

      <div className="total-diferencia">
        <div>
          <span>TOTAL REAL:</span>
          <span>{formatearMoneda(totalReal)}</span>
        </div>
        <div>
          <span>DISPONIBLE APP:</span>
          <span>{formatearMoneda(disponible)}</span>
        </div>
        <div>
          <span>DIFERENCIA:</span>
          <span>{formatearMoneda(Math.abs(diferencia))} ({getSignoDiferencia()})</span>
        </div>
      </div>

      {/* CORRECCIÓN: Botón centrado */}
      <div className="btn-centrado">
        <button className="btn-herramienta" onClick={handleRegistrarMargen}>
          📝 Registrar margen de error
        </button>
      </div>
    </Layout>
  )
}