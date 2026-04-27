import XLSX from 'xlsx'

export function parseExcelBuffer(buffer) {
  try {
    const workbook = XLSX.read(buffer, { type: 'buffer' })
    const sheetName = workbook.SheetNames[0]
    const worksheet = workbook.Sheets[sheetName]
    const data = XLSX.utils.sheet_to_json(worksheet)
    return data
  } catch (error) {
    console.error('Error parsing Excel:', error.message)
    throw new Error('Failed to parse Excel')
  }
}

export function mapSAPDataToProductos(sapData) {
  return sapData.map((row) => {
    const material = row.Material || row['Material']
    const descripcion = row['Texto breve de material'] || row['Descripción']
    const almacen = row['Almacén'] || row['Almacen']
    let cantidad = parseFloat(row['Libre utilización'] || row['Cantidad'] || 0)
    const unidad = row['UMB'] || row['Unidad']

    let estado = 'DISPONIBLE'
    if (cantidad === 0) estado = 'AGOTADO'
    else if (cantidad < 100) estado = 'BAJO'

    return {
      material: String(material).trim(),
      descripcion: String(descripcion).trim(),
      almacen: String(almacen || '').trim(),
      cantidad: Number(cantidad.toFixed(2)),
      unidad: String(unidad || 'KG').trim(),
      estado: estado,
      actualizado_en: new Date().toISOString(),
    }
  })
}

export function validateProductos(productos) {
  if (!Array.isArray(productos) || productos.length === 0) {
    throw new Error('No valid data found')
  }
  const required = ['material', 'descripcion', 'cantidad']
  for (const producto of productos) {
    for (const field of required) {
      if (!producto[field]) throw new Error(`Missing field: ${field}`)
    }
  }
  return true
}
