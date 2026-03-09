import { useState, useEffect } from 'react'
import { useFinance } from '../context/FinanceContext'
import Layout from '../components/common/Layout'
import { formatearMoneda } from '../utils/formatters'
import * as XLSX from 'xlsx'

export default function InformeAnual({ onNavigate }) {
  const { movimientos, meses } = useFinance()
  const [anioSeleccionado, setAnioSeleccionado] = useState(new Date().getFullYear())
  const [informe, setInforme] = useState(null)

  const años = [...new Set(movimientos.map(m => new Date(m.fecha).getFullYear()))].sort((a, b) => b - a)
  if (años.length === 0) años.push(new Date().getFullYear())

  useEffect(() => {
    generarInforme()
  }, [anioSeleccionado, movimientos])

  const generarInforme = () => {
    let totalIngresos = 0
    let totalGastos = 0
    let totalAhorro = 0
    let gastosPorCategoria = {}
    let ingresosPorCategoria = {}
    let subcategoriasPorCategoria = {}
    let ahorroPorMes = new Array(12).fill(0)

    for (let mes = 0; mes < 12; mes++) {
      const movsMes = movimientos.filter(m => {
        if (!m.fecha) return false
        const d = new Date(m.fecha)
        return d.getMonth() === mes && d.getFullYear() === anioSeleccionado
      })

      movsMes.forEach(m => {
        if (m.tipo === 'ingreso') {
          totalIngresos += m.monto
          ingresosPorCategoria[m.categoria] = (ingresosPorCategoria[m.categoria] || 0) + m.monto
        } else {
          totalGastos += m.monto
          if (m.tipo === 'fijo4') {
            totalAhorro += m.monto
            ahorroPorMes[mes] += m.monto
          }
          
          gastosPorCategoria[m.tipo] = (gastosPorCategoria[m.tipo] || 0) + m.monto
          
          if (m.subcategoria) {
            if (!subcategoriasPorCategoria[m.tipo]) subcategoriasPorCategoria[m.tipo] = {}
            subcategoriasPorCategoria[m.tipo][m.subcategoria] = 
              (subcategoriasPorCategoria[m.tipo][m.subcategoria] || 0) + m.monto
          }
        }
      })
    }

    setInforme({
      totalIngresos,
      totalGastos,
      totalAhorro,
      gastosPorCategoria,
      ingresosPorCategoria,
      subcategoriasPorCategoria,
      ahorroPorMes
    })
  }

  const exportarExcel = () => {
    const mesesCortos = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
    let datos = [['Mes', 'Ingresos', 'Gastos variables', 'Vivienda (Fijos I)', 'Salud y otros (Fijos II)', 'Cuotas (Fijos III)', 'Ahorros (Fijos IV)', 'Ahorro neto']]

    for (let mes = 0; mes < 12; mes++) {
      const movsMes = movimientos.filter(m => {
        if (!m.fecha) return false
        const d = new Date(m.fecha)
        return d.getMonth() === mes && d.getFullYear() === anioSeleccionado
      })

      let ingresos = 0, gv = 0, f1 = 0, f2 = 0, f3 = 0, f4 = 0
      movsMes.forEach(m => {
        if (m.tipo === 'ingreso') ingresos += m.monto
        else if (m.tipo === 'gasto_variable') gv += m.monto
        else if (m.tipo === 'fijo1') f1 += m.monto
        else if (m.tipo === 'fijo2') f2 += m.monto
        else if (m.tipo === 'fijo3') f3 += m.monto
        else if (m.tipo === 'fijo4') f4 += m.monto
      })

      datos.push([mesesCortos[mes], ingresos, gv, f1, f2, f3, f4, f4])
    }

    const wb = XLSX.utils.book_new()
    const ws = XLSX.utils.aoa_to_sheet(datos)
    XLSX.utils.book_append_sheet(wb, ws, 'Informe Anual')
    XLSX.writeFile(wb, `informe_${anioSeleccionado}.xlsx`)
  }

  const toggleSubcategoria = (key) => {
    const div = document.getElementById(`subcat-${key}`)
    const icon = document.getElementById(`icon-${key}`)
    if (div.style.display === 'none') {
      div.style.display = 'block'
      icon.innerText = '▼'
    } else {
      div.style.display = 'none'
      icon.innerText = '▶'
    }
  }

  if (!informe) return <Layout title="📈 Informe Anual" onBack={() => onNavigate('herramientas')} onHome={() => onNavigate('resumen')}><div className="loading">Cargando...</div></Layout>

  const { totalIngresos, totalGastos, totalAhorro, gastosPorCategoria, ingresosPorCategoria, subcategoriasPorCategoria, ahorroPorMes } = informe

  let ahorroAcumulado = 0

  const ordenCategorias = [
    { key: 'gasto_variable', nombre: 'Gastos variables' },
    { key: 'fijo1', nombre: 'Gastos fijos I (Vivienda)' },
    { key: 'fijo2', nombre: 'Gastos fijos II (Salud y otros)' },
    { key: 'fijo3', nombre: 'Gastos fijos III (Cuotas)' },
    { key: 'fijo4', nombre: 'Gastos fijos IV (Ahorros)' }
  ]

  return (
    <Layout title="📈 Informe Anual" onBack={() => onNavigate('herramientas')} onHome={() => onNavigate('resumen')}>
      <div className="informe-header">
        <select value={anioSeleccionado} onChange={(e) => setAnioSeleccionado(parseInt(e.target.value))}>
          {años.map(a => <option key={a} value={a}>{a}</option>)}
        </select>
        <button className="btn-exportar" onClick={exportarExcel}>📤 Excel</button>
      </div>

      <div className="informe-contenido">
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span>💰 Ingresos totales:</span>
          <span>{formatearMoneda(totalIngresos)}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span>💸 Gastos totales:</span>
          <span>{formatearMoneda(totalGastos)}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
          <span>📦 Ahorro neto anual:</span>
          <span>{formatearMoneda(totalAhorro)}</span>
        </div>

        <hr style={{ margin: '12px 0', borderColor: '#d9c9b8' }} />
        
        <p style={{ fontWeight: 600, marginBottom: '12px' }}>📊 Evolución mensual</p>
        
        <div style={{ display: 'grid', gridTemplateColumns: '100px 1fr 1fr', gap: '16px', fontWeight: 600, marginBottom: '8px', paddingLeft: '4px' }}>
          <span>Mes</span>
          <span style={{ textAlign: 'right' }}>Ahorro</span>
          <span style={{ textAlign: 'right' }}>Acumulado</span>
        </div>

        {meses.map((mes, idx) => {
          const ahorroMes = ahorroPorMes[idx]
          ahorroAcumulado += ahorroMes
          const icono = ahorroMes < 0 ? '⚠️' : '✅'
          return (
            <div key={idx} style={{ display: 'grid', gridTemplateColumns: '100px 1fr 1fr', gap: '16px', fontSize: '0.9rem', marginBottom: '6px', paddingLeft: '4px' }}>
              <span>{mes}</span>
              <span style={{ textAlign: 'right' }}>{icono} {formatearMoneda(ahorroMes)}</span>
              <span style={{ textAlign: 'right' }}>{formatearMoneda(ahorroAcumulado)}</span>
            </div>
          )
        })}

        <hr style={{ margin: '16px 0', borderColor: '#d9c9b8' }} />
        <p style={{ fontWeight: 600, marginBottom: '8px' }}>📊 Distribución del gasto</p>

        {ordenCategorias.map(({ key, nombre }) => {
          const total = gastosPorCategoria[key] || 0
          const porcentaje = totalGastos > 0 ? Math.round((total / totalGastos) * 100) : 0
          return (
            <div key={key} className="categoria-expandible">
              <div className="categoria-header" onClick={() => toggleSubcategoria(key)}>
                <span>{nombre}</span>
                <span>{formatearMoneda(total)} ({porcentaje}%) <span id={`icon-${key}`}>▶</span></span>
              </div>
              <div id={`subcat-${key}`} style={{ display: 'none' }}>
                {subcategoriasPorCategoria[key] ? (
                  Object.entries(subcategoriasPorCategoria[key])
                    .sort((a, b) => b[1] - a[1])
                    .map(([subcat, monto]) => {
                      const porcentajeSub = totalGastos > 0 ? Math.round((monto / totalGastos) * 100) : 0
                      return (
                        <div key={subcat} className="subcategoria">
                          <span>{subcat}</span>
                          <span>{formatearMoneda(monto)} ({porcentajeSub}%)</span>
                        </div>
                      )
                    })
                ) : (
                  <div className="subcategoria" style={{ color: '#999' }}>Sin subcategorías</div>
                )}
              </div>
            </div>
          )
        })}

        <hr style={{ margin: '16px 0', borderColor: '#d9c9b8' }} />
        <p style={{ fontWeight: 600, marginBottom: '8px' }}>📊 Desglose de ingresos</p>

        {Object.entries(ingresosPorCategoria).sort((a, b) => b[1] - a[1]).map(([cat, monto]) => {
          const porcentaje = totalIngresos > 0 ? Math.round((monto / totalIngresos) * 100) : 0
          return (
            <div key={cat} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '4px' }}>
              <span>{cat}</span>
              <span>{formatearMoneda(monto)} ({porcentaje}%)</span>
            </div>
          )
        })}
      </div>
    </Layout>
  )
}