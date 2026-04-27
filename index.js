import { useEffect, useState } from 'react'
import { getProductos } from '@/lib/supabase'
import styles from '@/styles/Home.module.css'

export default function Dashboard({ initialProductos }) {
  const [productos, setProductos] = useState(initialProductos)
  const [filtrados, setFiltrados] = useState(initialProductos)
  const [busqueda, setBusqueda] = useState('')
  const [filtroEstado, setFiltroEstado] = useState('TODOS')
  const [lastUpdate, setLastUpdate] = useState(new Date())

  useEffect(() => {
    const interval = setInterval(async () => {
      const nuevos = await getProductos()
      setProductos(nuevos)
      setLastUpdate(new Date())
    }, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    let resultado = productos
    if (filtroEstado !== 'TODOS') {
      resultado = resultado.filter(p => p.estado === filtroEstado)
    }
    if (busqueda.trim()) {
      const query = busqueda.toLowerCase()
      resultado = resultado.filter(p =>
        p.material.toLowerCase().includes(query) ||
        p.descripcion.toLowerCase().includes(query)
      )
    }
    setFiltrados(resultado)
  }, [productos, busqueda, filtroEstado])

  const estadoColor = (estado) => {
    switch (estado) {
      case 'DISPONIBLE': return '#22c55e'
      case 'BAJO': return '#f59e0b'
      case 'AGOTADO': return '#ef4444'
      default: return '#6b7280'
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h1>📦 Productos Terminados - PSF</h1>
          <p className={styles.lastUpdate}>
            Actualizado: {lastUpdate.toLocaleString('es-MX')}
          </p>
        </div>
      </div>

      <div className={styles.controls}>
        <div className={styles.searchBox}>
          <input
            type="text"
            placeholder="🔍 Buscar código o descripción..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className={styles.searchInput}
          />
        </div>
        <div className={styles.filters}>
          <button
            className={`${styles.filterBtn} ${filtroEstado === 'TODOS' ? styles.active : ''}`}
            onClick={() => setFiltroEstado('TODOS')}
          >
            Todos ({productos.length})
          </button>
          <button
            className={`${styles.filterBtn} ${filtroEstado === 'DISPONIBLE' ? styles.active : ''}`}
            onClick={() => setFiltroEstado('DISPONIBLE')}
          >
            ✓ Disponible ({productos.filter(p => p.estado === 'DISPONIBLE').length})
          </button>
          <button
            className={`${styles.filterBtn} ${filtroEstado === 'BAJO' ? styles.active : ''}`}
            onClick={() => setFiltroEstado('BAJO')}
          >
            ⚠ Bajo ({productos.filter(p => p.estado === 'BAJO').length})
          </button>
          <button
            className={`${styles.filterBtn} ${filtroEstado === 'AGOTADO' ? styles.active : ''}`}
            onClick={() => setFiltroEstado('AGOTADO')}
          >
            ✗ Agotado ({productos.filter(p => p.estado === 'AGOTADO').length})
          </button>
        </div>
      </div>

      <div className={styles.tableContainer}>
        {filtrados.length > 0 ? (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>CÓDIGO</th>
                <th>DESCRIPCIÓN</th>
                <th>ALMACÉN</th>
                <th>CANTIDAD (KG)</th>
                <th>ESTADO</th>
              </tr>
            </thead>
            <tbody>
              {filtrados.map((producto) => (
                <tr key={producto.id}>
                  <td className={styles.codigo}>{producto.material}</td>
                  <td className={styles.descripcion}>{producto.descripcion}</td>
                  <td className={styles.almacen}>{producto.almacen}</td>
                  <td className={styles.cantidad}>
                    {producto.cantidad?.toLocaleString('es-MX', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </td>
                  <td>
                    <span
                      className={styles.estado}
                      style={{ backgroundColor: estadoColor(producto.estado) }}
                    >
                      {producto.estado}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className={styles.empty}>
            <p>No se encontraron productos</p>
          </div>
        )}
      </div>

      <div className={styles.footer}>
        <p>© 2026 PSF | Powder Special Finish</p>
      </div>
    </div>
  )
}

export async function getServerSideProps() {
  try {
    const productos = await getProductos()
    return {
      props: { initialProductos: productos },
      revalidate: 300,
    }
  } catch (error) {
    return {
      props: { initialProductos: [] },
      revalidate: 60,
    }
  }
}
