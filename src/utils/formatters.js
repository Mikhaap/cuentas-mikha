export const formatearMoneda = (valor) => {
  if (valor === undefined || valor === null) return '$ 0'
  return '$ ' + Math.round(valor).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
}

export const formatearNumeroInput = (valor) => {
  const numeros = valor.replace(/\D/g, '')
  if (numeros === '') return ''
  return numeros.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
}

export const formatearFecha = (fechaStr) => {
  return new Date(fechaStr).toLocaleDateString('es-AR')
}