import { useFinance } from '../context/FinanceContext'

export default function Herramientas({ onNavigate }) {
  const { exportarBackup, importarBackup, reiniciarTodo } = useFinance()

  const handleImportar = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.json'
    input.onchange = e => {
      const file = e.target.files[0]
      importarBackup(file)
        .then(() => alert('Backup restaurado correctamente'))
        .catch(() => alert('Archivo inválido'))
    }
    input.click()
  }

  const handleReiniciar = () => {
    if (confirm('¿Estás SEGURA? Se borrarán TODOS los movimientos, configuraciones, billeteras y saldos.')) {
      reiniciarTodo()
      alert('App reiniciada. Podés empezar de cero.')
    }
  }

  return (
    <div id="pantallaHerramientas">
      <div className="herramientas-contenido">
        <div className="herramientas-seccion">
          <button className="btn-herramienta" onClick={() => onNavigate('encaja')}>
            💰 En caja
          </button>
          <button className="btn-herramienta" onClick={() => onNavigate('informe')}>
            📈 Informe Anual
          </button>
          <button className="btn-herramienta" onClick={() => onNavigate('analisis')}>
            📊 Análisis mensual
          </button>
          <button className="btn-herramienta" onClick={exportarBackup}>
            📤 Exportar backup
          </button>
          <button className="btn-herramienta" onClick={handleImportar}>
            📥 Importar backup
          </button>
          <button className="btn-herramienta btn-peligro" onClick={handleReiniciar}>
            🧹 Reiniciar app
          </button>
        </div>
      </div>
    </div>
  )
}