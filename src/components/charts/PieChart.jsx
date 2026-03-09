import { useRef, useEffect } from 'react'

export default function PieChart({ data }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    const centroX = canvas.width / 2
    const centroY = canvas.height / 2
    const radio = 90

    // Limpiar
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    const { totalIng, totalFijos, totalVars, totalAhorro } = data

    if (totalIng === 0) {
      ctx.fillStyle = '#7f6b5a'
      ctx.font = 'bold 16px sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText('No hay ingresos', centroX, centroY)
      return
    }

    const pctFijos = (totalFijos / totalIng) * 100
    const pctVars = (totalVars / totalIng) * 100
    const pctAhorro = (totalAhorro / totalIng) * 100

    const colores = {
      fijos: '#a65a5a',
      vars: '#d9a066',
      ahorro: '#6a7f6d',
      resto: '#f2e6d8'
    }

    let anguloInicio = -Math.PI / 2
    const angFijos = (pctFijos / 100) * 2 * Math.PI
    const angVars = (pctVars / 100) * 2 * Math.PI
    const angAhorro = (pctAhorro / 100) * 2 * Math.PI

    // Función para dibujar sector
    function dibujarSector(inicio, amplitud, color, texto) {
      if (amplitud <= 0.01) return

      ctx.beginPath()
      ctx.moveTo(centroX, centroY)
      ctx.arc(centroX, centroY, radio, inicio, inicio + amplitud)
      ctx.closePath()
      ctx.fillStyle = color
      ctx.fill()
      ctx.strokeStyle = '#fdf7ed'
      ctx.lineWidth = 2
      ctx.stroke()

      // Etiqueta
      const anguloMedio = inicio + amplitud / 2
      const distancia = radio + 25
      const x = centroX + Math.cos(anguloMedio) * distancia
      const y = centroY + Math.sin(anguloMedio) * distancia

      ctx.fillStyle = '#3e3a36'
      ctx.font = 'bold 12px sans-serif'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(texto, x, y)
    }

    dibujarSector(anguloInicio, angFijos, colores.fijos, pctFijos.toFixed(1) + '%')
    anguloInicio += angFijos

    dibujarSector(anguloInicio, angVars, colores.vars, pctVars.toFixed(1) + '%')
    anguloInicio += angVars

    dibujarSector(anguloInicio, angAhorro, colores.ahorro, pctAhorro.toFixed(1) + '%')
    anguloInicio += angAhorro

    // Resto
    const angRestante = 2 * Math.PI - (angFijos + angVars + angAhorro)
    if (angRestante > 0.01) {
      ctx.beginPath()
      ctx.moveTo(centroX, centroY)
      ctx.arc(centroX, centroY, radio, anguloInicio, anguloInicio + angRestante)
      ctx.closePath()
      ctx.fillStyle = colores.resto
      ctx.fill()
      ctx.stroke()

      const anguloMedio = anguloInicio + angRestante / 2
      const distancia = radio + 25
      const x = centroX + Math.cos(anguloMedio) * distancia
      const y = centroY + Math.sin(anguloMedio) * distancia

      ctx.fillStyle = '#3e3a36'
      ctx.font = 'bold 12px sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText('resto', x, y)
    }
  }, [data])

  return (
    <canvas 
      ref={canvasRef} 
      width={280} 
      height={280} 
      style={{ maxWidth: '100%' }}
    />
  )
}