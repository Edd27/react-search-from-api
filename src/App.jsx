import { useState, useEffect } from 'react'
import axios from 'axios'

function App() {
  const [searchInput, setSearchInput] = useState('dispositivo')
  const [trademark, setTrademark] = useState('ubiquitinetworks')
  const [category, setCategory] = useState('26')
  const [trademarks, setTrademarks] = useState([])
  const [categories, setCategories] = useState([])
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    axios
      .post(import.meta.env.VITE_URL_TOKEN, {
        client_id: import.meta.env.VITE_CLIENT_ID,
        client_secret: import.meta.env.VITE_CLIENT_SECRET,
        grant_type: 'client_credentials'
      })
      .then(({ data }) => {
        const api = axios.create({
          baseURL: import.meta.env.VITE_URL,
          timeout: 5000,
          headers: {
            Authorization: `Bearer ${data.access_token}`
          }
        })
        api.get('/categorias').then(({ data }) => {
          setCategories(data)
          api.get('/marcas').then(({ data }) => setTrademarks(data))
        })
      })
  }, [])

  useEffect(() => {
    setLoading(true)
    axios
      .post(import.meta.env.VITE_URL_TOKEN, {
        client_id: import.meta.env.VITE_CLIENT_ID,
        client_secret: import.meta.env.VITE_CLIENT_SECRET,
        grant_type: 'client_credentials'
      })
      .then(({ data }) => {
        const api = axios.create({
          baseURL: import.meta.env.VITE_URL,
          timeout: 5000,
          headers: {
            Authorization: `Bearer ${data.access_token}`
          }
        })
        api
          .get(
            `/productos?categoria=${category}&marca=${trademark}&busqueda=${searchInput}`
          )
          .then(({ data }) => {
            setProducts(data.productos)
            setLoading(false)
          })
      })
  }, [searchInput, trademark, category])

  return (
    <div className='container w-full mx-auto flex flex-col gap-5 my-10 md:my-24 p-3 md:p-0'>
      <h2 className='text-3xl font-semibold text-center mb-10'>
        Syscom Products (BETA)
      </h2>
      <div className='flex flex-col md:flex-row gap-3'>
        {trademarks.length ? (
          <select
            value={trademark}
            onChange={e => setTrademark(e.target.value)}
            className='bg-gray-200 rounded-md p-3 text-gray-700 w-full md:w-1/3'
          >
            {trademarks.map(trademark => (
              <option key={trademark.id} value={trademark.id}>
                {trademark.nombre}
              </option>
            ))}
          </select>
        ) : (
          <div className='bg-gray-200 rounded-md p-3 text-gray-700 w-full md:w-1/3'>
            Loading...
          </div>
        )}
        {categories.length ? (
          <select
            value={category}
            onChange={e => setCategory(e.target.value)}
            className='bg-gray-200 rounded-md p-3 text-gray-700 w-full md:w-1/3'
          >
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.nombre}
              </option>
            ))}
          </select>
        ) : (
          <div className='bg-gray-200 rounded-md p-3 text-gray-700 w-full md:w-1/3'>
            Loading...
          </div>
        )}
        <input
          type='search'
          placeholder='Search products...'
          onChange={e => setSearchInput(e.target.value || 'antena')}
          className='bg-gray-200 rounded-md p-3 text-gray-700 w-full md:w-1/3'
        />
      </div>

      {loading ? (
        <div className='w-full py-24 text-center text-2xl font-semibold text-red-400'>
          Loading...
        </div>
      ) : products.length ? (
        <div className='grid gap-5 grid-cols-1 md:grid-cols-3 lg:grid-cols-4'>
          {products.map(product => (
            <div key={product.producto_id} className='border rounded-md p-3'>
              <img src={product.img_portada} alt={product.modelo} />
              <div>
                <h2>{product.titulo}</h2>
                <p className='text-xl font-semibold'>
                  ${product.precios.precio_lista}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className='border rounded-md py-10 text-center text-2xl text-red-400 font-semibold'>
          Sin resultados
        </div>
      )}
    </div>
  )
}

export default App
