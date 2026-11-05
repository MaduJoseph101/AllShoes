const PRODUCTS_API = 'https://dummyjson.com/products'

async function fetchProductList(url, signal) {
  const response = await fetch(url, { signal })
  if (!response.ok) {
    throw new Error(`Product request failed (${response.status}).`)
  }

  const data = await response.json()
  if (!Array.isArray(data.products)) {
    throw new Error('The product service returned an invalid response.')
  }

  return data.products
}

export async function fetchProductsByCategory(category, signal) {
  return fetchProductList(`${PRODUCTS_API}/category/${encodeURIComponent(category)}`, signal)
}

export async function fetchAllShoeProducts(signal) {
  const [mensProducts, womensProducts] = await Promise.all([
    fetchProductsByCategory('mens-shoes', signal),
    fetchProductsByCategory('womens-shoes', signal),
  ])

  return [...mensProducts, ...womensProducts]
}

export async function searchShoeProducts(query, signal, limit = 8) {
  const params = new URLSearchParams({ q: query, limit: String(limit) })
  return fetchProductList(`${PRODUCTS_API}/search?${params}`, signal)
}

export async function fetchProductById(id, signal) {
  const response = await fetch(`${PRODUCTS_API}/${encodeURIComponent(id)}`, { signal })
  if (!response.ok) {
    throw new Error(response.status === 404 ? 'Product not found.' : `Product request failed (${response.status}).`)
  }

  const product = await response.json()
  if (!product || typeof product !== 'object' || !Array.isArray(product.images)) {
    throw new Error('The product service returned an invalid response.')
  }

  return product
}
