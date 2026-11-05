import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import FAQ from '../Props/FAQ'
import FadeIn from '../FadeIn'
import { fetchProductsByCategory } from '../api/products'

function WomenItems() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [retryCount, setRetryCount] = useState(0)

  useEffect(() => {
    const controller = new AbortController()
    const fetchWomenShoes = async () => {
      try {
        const fetchedProducts = await fetchProductsByCategory('womens-shoes', controller.signal)
        setProducts(fetchedProducts)
        setError(null)
      } catch (err) {
        if (err.name !== 'AbortError') setError(err.message)
      } finally {
        if (!controller.signal.aborted) setLoading(false)
      }
    }
    fetchWomenShoes()
    return () => controller.abort()
  }, [retryCount])

  return (
    <FadeIn>
      <div className="min-h-screen w-full bg-[#FBFBFD] font-jakarta px-4 sm:px-8 py-8">
        <div className="max-w-7xl mx-auto space-y-12">
          
          {/* BANNER */}
          <div 
            className="relative w-full h-[45vh] sm:h-[45vh] md:h-[55vh] rounded-3xl overflow-hidden bg-cover bg-center shadow-xs"
            style={{ backgroundImage: "url('/DisplayImages/womenitems-shoe.jpg')" }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/30 flex flex-col justify-between p-6 sm:p-12 text-white">
              <nav aria-label="Breadcrumb" className="text-xs font-medium tracking-wide flex items-center gap-2 text-white/70">
                <Link to="/" className="hover:text-white transition-colors">Home</Link>
                <span>/</span>
                <span className="text-white" aria-current="page">Women's Shoes</span>
              </nav>

              <div className="max-w-xl space-y-2">
               
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-[-0.03em] text-white">
                  Women's Shoes
                </h1>
                <p className="text-xs sm:text-sm md:text-base text-white/85 font-light leading-relaxed">
                  Discover a serene balance of form, function, and comfort designed for every step of your day.
                </p>
              </div>
            </div>
          </div>

          {/* GRID */}
          <div>
            {loading ? (
              <div className="catalog-grid grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="flex flex-col gap-3 animate-pulse">
                    <div className="bg-[#F5F5F7] rounded-3xl aspect-square w-full" />
                    <div className="h-4 bg-neutral-200 rounded w-2/3" />
                    <div className="h-3 bg-neutral-200 rounded w-1/3" />
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="flex items-center justify-center py-16 text-center">
                <div className="space-y-3">
                  <h3 className="text-base font-semibold text-neutral-900">Unable to load collection</h3>
                  <button
                    onClick={() => {
                      setError(null)
                      setLoading(true)
                      setRetryCount((count) => count + 1)
                    }}
                    className="text-xs font-medium underline text-neutral-700 hover:text-black"
                  >
                    Try reloading
                  </button>
                </div>
              </div>
            ) : (
              <div className="catalog-grid grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                {products.map((product) => (
                  <Link
                    key={product.id}
                    to={`/productdetails/${product.id}`}
                    className="group block bg-white rounded-3xl p-3 border border-neutral-300 hover:border-neutral-900 shadow-xs hover:shadow-lg transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-black"
                  >
                    <div className="relative bg-[#F5F5F7] rounded-2xl p-6 sm:p-7 aspect-square flex items-center justify-center overflow-hidden group-hover:bg-[#ECECEE] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]">
                      <img 
                        src={product.thumbnail || product.images?.[0]} 
                        alt={product.title}
                        loading="lazy"
                        className="max-h-[85%] max-w-[85%] object-contain group-hover:scale-[1.05] transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
                      />
                    </div>

                    <div className="pt-3 pb-1 px-1.5 flex flex-col gap-0.5">
                      <span className="text-[10px] font-semibold tracking-[0.15em] uppercase text-neutral-400">
                        {product.brand || 'Women'}
                      </span>
                      <div className="flex justify-between items-baseline gap-2">
                        <h3 className="text-xs sm:text-sm font-medium text-neutral-900 truncate group-hover:text-black transition-colors">
                          {product.title}
                        </h3>
                        <span className="text-xs sm:text-sm text-neutral-800 font-semibold shrink-0">
                          ${product.price}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          <div className="pt-12 border-t border-black/[0.06]">
            <FAQ 
              title="Women's Fit & Care" 
              description="Crafted to flex and breathe with natural movement. Machine washable and naturally thermoregulating for year-round ease."
            />
          </div>

        </div>
      </div>
    </FadeIn>
  )
}

export default WomenItems
