import { getFileFromOneDrive } from '@/lib/microsoft'
import { parseExcelBuffer, mapSAPDataToProductos, validateProductos } from '@/lib/excel'
import { upsertProductos, clearProductos } from '@/lib/supabase'

export default async function handler(req, res) {
  if (req.method !== 'POST' && req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const secret = req.headers['authorization']?.replace('Bearer ', '')
  if (secret !== process.env.CRON_SECRET) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  try {
    console.log('🔄 Iniciando sincronización...')

    const fileBuffer = await getFileFromOneDrive('PSF Inventario.xlsx')
    console.log('📥 Archivo descargado')

    const sapData = parseExcelBuffer(fileBuffer)
    console.log(`✅ ${sapData.length} productos encontrados`)

    const productos = mapSAPDataToProductos(sapData)
    validateProductos(productos)

    await clearProductos()
    await upsertProductos(productos)

    console.log('✅ Sincronización completada')

    return res.status(200).json({
      success: true,
      productosCount: productos.length,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('❌ Error:', error.message)
    return res.status(500).json({
      success: false,
      error: error.message,
    })
  }
}
