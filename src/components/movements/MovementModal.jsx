import { useState, useEffect } from 'react'
import { useFinance } from '../../context/FinanceContext'
import { formatearNumeroInput } from '../../utils/formatters'

export default function MovementModal({ isOpen, onClose, editingMovement }) {
  const { categorias, agregarMovimiento } = useFinance()
  
  const [tipo, setTipo] = useState('')
  const [fecha, setFecha] = useState(new Date().toISOString().split('T')[0])
  const [categoria, setCategoria] = useState('')
  const [subcategoria, setSubcategoria] = useState('')
  const [tarjeta, setTarjeta] = useState('')
  const [cuota, setCuota] = useState('')
  const [monto, setMonto] = useState('')

  useEffect(() => {
    if (editingMovement) {
      setTipo(editingMovement.tipo)
      setFecha(editingMovement.fecha)
      setCategoria(editingMovement.categoria)
      setSubcategoria(editingMovement.subcategoria || '')
      setTarjeta(editingMovement.tarjeta || '')
      setCuota(editingMovement.cuota || '')
      setMonto(formatearNumeroInput(editingMovement.monto.toString()))
    } else {
      resetForm()
    }
  }, [editingMovement, isOpen])

  const resetForm = () => {
    setTipo('')
    setFecha(new Date().toISOString().split('T')[0])
    setCategoria('')
    setSubcategoria('')
    setTarjeta('')
    setCuota('')
    setMonto('')
  }

  const handleTipoChange = (e) => {
    setTipo(e.target.value)
    setCategoria('')
  }

  const handleMontoChange = (e) => {
    const valor = e.target.value
    const numeros = valor.replace(/\D/g, '')
    setMonto(numeros.replace(/\B(?=(\d{3})+(?!\d))/g, '.'))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!tipo) return alert('Elegí un tipo')
    if (!categoria) return alert('Completá categoría')

    const montoNum = parseFloat(monto.replace(/\./g, ''))
    if (isNaN(montoNum) || montoNum <= 0) return alert('Monto inválido')

    agregarMovimiento({
      id: editingMovement?.id,
      tipo,
      fecha,
      categoria,
      subcategoria,
      monto: montoNum,
      tarjeta,
      cuota
    })

    resetForm()
    onClose()
  }

  const getCategoriasTipo = () => {
    if (tipo === 'fijo2') return []
    return categorias[tipo] || []
  }

  const getLabelSubcategoria = () => {
    const labels = {
      'ingreso': 'Detalle (opcional, ej: Jardín, Dani)',
      'gasto_variable': 'Detalle (opcional, ej: pollo, peras)',
      'fijo1': 'Detalle (opcional, solo visible en movimientos)',
      'fijo2': 'Detalle (opcional, ej: psicóloga, UNVM, Netflix)',
      'fijo3': 'Detalle (opcional, solo visible en movimientos)',
      'fijo4': 'Detalle (opcional, solo visible en movimientos)'
    }
    return labels[tipo] || 'Detalle (opcional)'
  }

  if (!isOpen) return null

  return (
    <div className="modal-overlay active" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{editingMovement ? 'Editar movimiento' : 'Nuevo movimiento'}</h3>
          <button className="btn-cerrar" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Tipo</label>
            <select className="form-select" value={tipo} onChange={handleTipoChange} required>
              <option value="">Seleccionar...</option>
              <option value="ingreso">💰 Ingreso</option>
              <option value="gasto_variable">🛒 Gasto variable</option>
              <option value="fijo1">🏠 Fijos I (Vivienda)</option>
              <option value="fijo2">⚕️ Fijos II (Salud y otros)</option>
              <option value="fijo3">💳 Fijos III (Cuotas)</option>
              <option value="fijo4">📈 Fijos IV (Ahorros)</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Fecha</label>
            <input 
              type="date" 
              className="form-control" 
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              required 
            />
          </div>

          {tipo && tipo !== 'fijo2' && (
            <div className="form-group">
              <label className="form-label">Categoría</label>
              <select 
                className="form-select" 
                value={categoria}
                onChange={(e) => setCategoria(e.target.value)}
                required
              >
                <option value="">Seleccionar...</option>
                {getCategoriasTipo().map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          )}

          {tipo === 'fijo2' && (
            <div className="form-group">
              <label className="form-label">Subcategoría</label>
              <select 
                className="form-select" 
                value={categoria}
                onChange={(e) => setCategoria(e.target.value)}
                required
              >
                <option value="">Seleccionar...</option>
                {categorias.fijo2.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          )}

          {tipo && (
            <div className="form-group">
              <label className="form-label">{getLabelSubcategoria()}</label>
              <input 
                type="text" 
                className="form-control" 
                value={subcategoria}
                onChange={(e) => setSubcategoria(e.target.value)}
                placeholder="Ej: pollo, UNVM, Netflix..."
              />
            </div>
          )}

          {tipo === 'fijo3' && (
            <div className="fila-cuota">
              <div className="form-group">
                <label>Tarjeta/Entidad</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={tarjeta}
                  onChange={(e) => setTarjeta(e.target.value)}
                  placeholder="Naranja"
                />
              </div>
              <div className="form-group">
                <label>Cuota</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={cuota}
                  onChange={(e) => setCuota(e.target.value)}
                  placeholder="3/6"
                />
              </div>
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Monto ($)</label>
            <input 
              type="text" 
              className="form-control" 
              value={monto}
              onChange={handleMontoChange}
              required
              placeholder="0"
            />
          </div>

          <button type="submit" className="btn-guardar">
            {editingMovement ? 'Actualizar movimiento' : 'Guardar movimiento'}
          </button>
        </form>
      </div>
    </div>
  )
}