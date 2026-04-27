import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Supabase URL y Anon Key son requeridas')
}

export const supabase = createClient(supabaseUrl, supabaseKey)

export async function getProductos() {
  const { data, error } = await supabase
    .from('productos_terminados')
    .select('*')
    .order('material', { ascending: true })

  if (error) {
    console.error('Error fetching:', error)
    return []
  }
  return data || []
}

export async function upsertProductos(productos) {
  const { data, error } = await supabase
    .from('productos_terminados')
    .upsert(productos, { onConflict: 'material' })

  if (error) throw error
  return data
}

export async function clearProductos() {
  const { error } = await supabase
    .from('productos_terminados')
    .delete()
    .neq('material', '')

  if (error) throw error
}
