export default function ProgressBar({ actual, maximo, porcentaje }) {
  const getColor = () => {
    if (porcentaje < 70) return '#a7c957'
    if (porcentaje < 90) return '#f9c74f'
    if (porcentaje < 100) return '#f9844a'
    return '#f94144'
  }

  return (
    <>
      <div className="barra-progreso">
        <div 
          className="progreso-lleno" 
          style={{ 
            width: `${Math.min(100, porcentaje)}%`,
            background: getColor()
          }}
        />
      </div>
      <div className="porcentaje-texto">{Math.round(porcentaje)}%</div>
    </>
  )
}