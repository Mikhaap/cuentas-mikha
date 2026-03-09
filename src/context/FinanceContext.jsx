import { createContext, useContext, useState, useEffect } from 'react'

const FinanceContext = createContext()

const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 
               'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']

const categorias = {
  ingreso: ['Escuela', 'Alumna', 'Mes anterior', 'Otras opciones'],
  gasto_variable: ['Carnes y huevos', 'Verduras y frutas', 'Dietética', 'Comida hecha', 
                   'Supermercado', 'Higiene personal', 'Viajes o vacaciones', 
                   'Limpieza del hogar', 'Hogar y mantenimiento', 'Salidas, espectáculos', 
                   'Ropa', 'Otras opciones'],
  fijo1: ['Alquiler', 'Expensas', 'Impuesto provincial', 'Impuesto municipal', 
          'Agua', 'Electricidad', 'Gas', 'Internet y celular', 'Seguro del hogar', 
          'Administrativo', 'Otras opciones'],
  fijo2: ['Salud', 'Educación', 'Transporte', 'Suscripción', 'Otros'],
  fijo3: ['Naranja', 'Mercado Crédito', 'UEPC Planilla', 'Banco de la gente', 'Otro'],
  fijo4: ['Plazo fijo', 'Reservas MP', 'Horizonte', 'Invertir online', 'Otras opciones']
}

export function FinanceProvider({ children }) {
  const [movimientos, setMovimientos] = useState([])
  const [billeteras, setBilleteras] = useState([])
  const [saldosBilleteras, setSaldosBilleteras] = useState({})
  const [porcentajeGV, setPorcentajeGV] = useState(27.5)
  const [mesActual, setMesActual] = useState(new Date().getMonth())
  const [anioActual, setAnioActual] = useState(new Date().getFullYear())
  const [filtroActual, setFiltroActual] = useState('todos')
  const [textoBusqueda, setTextoBusqueda] = useState('')

  // Cargar datos de localStorage
  useEffect(() => {
    const movs = localStorage.getItem('finanzas_mov')
    const billets = localStorage.getItem('finanzas_billeteras')
    const saldos = localStorage.getItem('finanzas_saldos')
    const porc = localStorage.getItem('finanzas_porcentaje')

    if (movs) setMovimientos(JSON.parse(movs))
    if (billets) setBilleteras(JSON.parse(billets))
    if (saldos) setSaldosBilleteras(JSON.parse(saldos))
    if (porc) setPorcentajeGV(parseFloat(porc))
  }, [])

  // Guardar en localStorage
  useEffect(() => {
    localStorage.setItem('finanzas_mov', JSON.stringify(movimientos))
  }, [movimientos])

  useEffect(() => {
    localStorage.setItem('finanzas_billeteras', JSON.stringify(billeteras))
  }, [billeteras])

  useEffect(() => {
    localStorage.setItem('finanzas_saldos', JSON.stringify(saldosBilleteras))
  }, [saldosBilleteras])

  useEffect(() => {
    localStorage.setItem('finanzas_porcentaje', porcentajeGV.toString())
  }, [porcentajeGV])

  const getMovimientosMes = () => {
    return movimientos.filter(m => {
      if (!m.fecha) return false
      const d = new Date(m.fecha)
      return d.getMonth() === mesActual && d.getFullYear() === anioActual
    })
  }

  const getTotalesMes = () => {
    const movsMes = getMovimientosMes()
    let totalIng = 0, totalGV = 0, totalViv = 0, totalFijo2 = 0, totalCuotas = 0, totalAhorro = 0

    movsMes.forEach(m => {
      if (m.tipo === 'ingreso') totalIng += m.monto
      else if (m.tipo === 'gasto_variable') totalGV += m.monto
      else if (m.tipo === 'fijo1') totalViv += m.monto
      else if (m.tipo === 'fijo2') totalFijo2 += m.monto
      else if (m.tipo === 'fijo3') totalCuotas += m.monto
      else if (m.tipo === 'fijo4') totalAhorro += m.monto
    })

    const totalGastos = totalGV + totalViv + totalFijo2 + totalCuotas
    const disponible = totalIng - totalGastos - totalAhorro

    return {
      totalIng,
      totalGV,
      totalViv,
      totalFijo2,
      totalCuotas,
      totalAhorro,
      totalGastos,
      disponible
    }
  }

  const agregarMovimiento = (movimiento) => {
    if (movimiento.id) {
      // Editar existente
      setMovimientos(prev => prev.map(m => m.id === movimiento.id ? movimiento : m))
    } else {
      // Nuevo
      const nuevo = {
        ...movimiento,
        id: Date.now(),
        fechaHora: new Date().toISOString()
      }
      setMovimientos(prev => [...prev, nuevo])
    }
  }

  const eliminarMovimiento = (id) => {
    setMovimientos(prev => prev.filter(m => m.id !== id))
  }

  const getMovimientosFiltrados = () => {
    let movs = [...movimientos].sort((a, b) => {
      const fechaA = new Date(a.fecha)
      const fechaB = new Date(b.fecha)
      if (fechaB - fechaA !== 0) return fechaB - fechaA
      const horaA = a.fechaHora ? new Date(a.fechaHora) : new Date(0)
      const horaB = b.fechaHora ? new Date(b.fechaHora) : new Date(0)
      return horaB - horaA
    })

    // Filtro por tipo/categoría
    if (filtroActual !== 'todos') {
      switch (filtroActual) {
        case 'alumna':
          movs = movs.filter(m => m.categoria === 'Alumna' || 
            (m.subcategoria && m.subcategoria.toLowerCase().includes('alumna')))
          break
        case 'gasto_variable':
          movs = movs.filter(m => m.tipo === 'gasto_variable')
          break
        case 'ingreso_escuela':
          movs = movs.filter(m => m.tipo === 'ingreso' && m.categoria === 'Escuela')
          break
        case 'ingreso_alumna':
          movs = movs.filter(m => m.tipo === 'ingreso' && m.categoria === 'Alumna')
          break
        case 'ingreso_mesanterior':
          movs = movs.filter(m => m.tipo === 'ingreso' && m.categoria === 'Mes anterior')
          break
        case 'ingreso_otras':
          movs = movs.filter(m => m.tipo === 'ingreso' && m.categoria === 'Otras opciones')
          break
        case 'fijo1':
        case 'fijo2':
        case 'fijo3':
        case 'fijo4':
          movs = movs.filter(m => m.tipo === filtroActual)
          break
        case 'ingreso':
          movs = movs.filter(m => m.tipo === 'ingreso')
          break
        case 'gasto':
          movs = movs.filter(m => ['gasto_variable', 'fijo1', 'fijo2', 'fijo3'].includes(m.tipo))
          break
        default:
          break
      }
    }

    // Búsqueda de texto
    if (textoBusqueda) {
      const txt = textoBusqueda.toLowerCase()
      movs = movs.filter(m => 
        (m.categoria && m.categoria.toLowerCase().includes(txt)) ||
        (m.subcategoria && m.subcategoria.toLowerCase().includes(txt)) ||
        (m.tarjeta && m.tarjeta.toLowerCase().includes(txt))
      )
    }

    return movs
  }

  const getTotalFiltro = () => {
    const movs = getMovimientosFiltrados()
    return movs.reduce((acc, m) => acc + m.monto, 0)
  }

  const getNombreFiltro = () => {
    const nombres = {
      'todos': 'Todos',
      'alumna': 'Alumnas',
      'gasto_variable': 'Gastos variables',
      'ingreso_escuela': 'Escuela',
      'ingreso_alumna': 'Alumnas (ingresos)',
      'ingreso_mesanterior': 'Mes anterior',
      'ingreso_otras': 'Otras opciones',
      'fijo1': 'Fijos I (Vivienda)',
      'fijo2': 'Fijos II (Salud y otros)',
      'fijo3': 'Fijos III (Cuotas)',
      'fijo4': 'Fijos IV (Ahorro)',
      'ingreso': 'Ingresos',
      'gasto': 'Gastos'
    }
    return nombres[filtroActual] || 'Filtrado'
  }

  const agregarBilletera = (nombre) => {
    if (nombre && !billeteras.includes(nombre)) {
      setBilleteras(prev => [...prev, nombre])
    }
  }

  const eliminarBilletera = (index) => {
    const billetera = billeteras[index]
    setBilleteras(prev => prev.filter((_, i) => i !== index))
    
    const mesKey = `${anioActual}-${mesActual}`
    setSaldosBilleteras(prev => {
      const nuevo = { ...prev }
      if (nuevo[mesKey]) {
        delete nuevo[mesKey][billetera]
      }
      return nuevo
    })
  }

  const actualizarSaldoBilletera = (billetera, monto) => {
    const mesKey = `${anioActual}-${mesActual}`
    setSaldosBilleteras(prev => ({
      ...prev,
      [mesKey]: {
        ...(prev[mesKey] || {}),
        [billetera]: monto
      }
    }))
  }

  const getTotalCaja = () => {
    const mesKey = `${anioActual}-${mesActual}`
    return billeteras.reduce((acc, b) => acc + (saldosBilleteras[mesKey]?.[b] || 0), 0)
  }

  const getDiferenciaCaja = () => {
    const { disponible } = getTotalesMes()
    const totalReal = getTotalCaja()
    return totalReal - disponible
  }

  const registrarMargenError = () => {
    const diferencia = getDiferenciaCaja()
    if (diferencia === 0) return null

    const tipo = diferencia > 0 ? 'ingreso' : 'gasto_variable'
    const montoAbs = Math.abs(diferencia)

    const movimiento = {
      tipo,
      fecha: new Date().toISOString().split('T')[0],
      categoria: 'Margen de error',
      subcategoria: '',
      monto: montoAbs,
      tarjeta: '',
      cuota: ''
    }

    agregarMovimiento(movimiento)
    return { tipo, monto: montoAbs, diferencia }
  }

  const exportarBackup = () => {
    const backup = { movimientos, porcentajeGV, billeteras, saldosBilleteras }
    const dataStr = JSON.stringify(backup, null, 2)
    const blob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `finanzas_backup_${new Date().toISOString().slice(0, 10)}.json`
    a.click()
  }

  const importarBackup = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (ev) => {
        try {
          const datos = JSON.parse(ev.target.result)
          if (datos.movimientos) setMovimientos(datos.movimientos)
          if (datos.porcentajeGV) setPorcentajeGV(datos.porcentajeGV)
          if (datos.billeteras) setBilleteras(datos.billeteras)
          if (datos.saldosBilleteras) setSaldosBilleteras(datos.saldosBilleteras)
          resolve()
        } catch (er) {
          reject(er)
        }
      }
      reader.readAsText(file)
    })
  }

  const reiniciarTodo = () => {
    setMovimientos([])
    setBilleteras([])
    setSaldosBilleteras({})
    setPorcentajeGV(27.5)
    localStorage.removeItem('finanzas_mov')
    localStorage.removeItem('finanzas_billeteras')
    localStorage.removeItem('finanzas_saldos')
    localStorage.removeItem('finanzas_porcentaje')
  }

  const value = {
    movimientos,
    billeteras,
    saldosBilleteras,
    porcentajeGV,
    mesActual,
    anioActual,
    filtroActual,
    textoBusqueda,
    meses,
    categorias,
    setMesActual,
    setAnioActual,
    setFiltroActual,
    setTextoBusqueda,
    setPorcentajeGV,
    getMovimientosMes,
    getTotalesMes,
    getMovimientosFiltrados,
    getTotalFiltro,
    getNombreFiltro,
    agregarMovimiento,
    eliminarMovimiento,
    agregarBilletera,
    eliminarBilletera,
    actualizarSaldoBilletera,
    getTotalCaja,
    getDiferenciaCaja,
    registrarMargenError,
    exportarBackup,
    importarBackup,
    reiniciarTodo
  }

  return <FinanceContext.Provider value={value}>{children}</FinanceContext.Provider>
}

export const useFinance = () => {
  const context = useContext(FinanceContext)
  if (!context) throw new Error('useFinance debe usarse dentro de FinanceProvider')
  return context
}