import { useState, useEffect } from 'react'
import { FinanceProvider } from './context/FinanceContext'
import Header from './components/common/Header'
import BottomNav from './components/common/BottomNav'
import Resumen from './views/Resumen'
import Movimientos from './views/Movimientos'
import Herramientas from './views/Herramientas'
import EnCaja from './views/EnCaja'
import InformeAnual from './views/InformeAnual'
import Analisis from './views/Analisis'
import MovementModal from './components/movements/MovementModal'

function App() {
  const [currentView, setCurrentView] = useState('resumen')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingMovement, setEditingMovement] = useState(null)

  // Registrar Service Worker para PWA
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then(registration => {
          console.log('SW registrado:', registration.scope)
        })
        .catch(error => {
          console.log('SW error:', error)
        })
    }
  }, [])

  const handleEditMovement = (movement) => {
    setEditingMovement(movement)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingMovement(null)
  }

  const renderView = () => {
    switch (currentView) {
      case 'resumen':
        return <Resumen onNavigate={setCurrentView} />
      case 'movimientos':
        return <Movimientos onEdit={handleEditMovement} />
      case 'herramientas':
        return <Herramientas onNavigate={setCurrentView} />
      case 'encaja':
        return <EnCaja onNavigate={setCurrentView} />
      case 'informe':
        return <InformeAnual onNavigate={setCurrentView} />
      case 'analisis':
        return <Analisis onNavigate={setCurrentView} />
      default:
        return <Resumen onNavigate={setCurrentView} />
    }
  }

  // Mostrar navegación solo en pantallas principales
  const showNav = ['resumen', 'movimientos', 'herramientas'].includes(currentView)

  return (
    <FinanceProvider>
      <div className="app">
        <Header />
        {showNav && <BottomNav currentView={currentView} onNavigate={setCurrentView} />}
        {renderView()}
        
        <button 
          className="btn-flotante" 
          onClick={() => setIsModalOpen(true)}
          aria-label="Nuevo movimiento"
        >
          +
        </button>

        <MovementModal 
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          editingMovement={editingMovement}
        />
      </div>
    </FinanceProvider>
  )
}

export default App