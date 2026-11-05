import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { RiSearchLine } from 'react-icons/ri'
import FAQ from '../Props/FAQ'
import FadeIn from '../FadeIn'
import { fetchAllShoeProducts, searchShoeProducts } from '../api/products'

function SkeletonGrid() {
  return (
    <div className="catalog-grid grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="flex flex-col gap-3 animate-pulse">
          <div className="bg-[#F5F5F7] rounded-3xl aspect-square w-full" />
          <div className="h-4 bg-neutral-200 rounded w-2/3" />
          <div className="h-3 bg-neutral-200 rounded w-1/3" />
        </div>
      ))}
    </div>
  )
}

function Allitems() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [searchLoading, setSearchLoading] = useState(false)
  const [searchError, setSearchError] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const [activeSuggestion, setActiveSuggestion] = useState(-1)
  const [retryCount, setRetryCount] = useState(0)

  const inputRef = useRef(null)
  const dropdownRef = useRef(null)
  const debounceRef = useRef(null)
  const searchControllerRef = useRef(null)
  const navigate = useNavigate()
  const location = useLocation()

  // FOCUS SEARCH VIA STATE
  useEffect(() => {
    if (!location.state?.focusSearch) return
    const input = inputRef.current
    if (!input) return
    input.focus({ preventScroll: true })
    input.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }, [location])

  // FETCH ALL PRODUCTS
  useEffect(() => {
    const controller = new AbortController()
    const fetchAll = async () => {
      try {
        const allProducts = await fetchAllShoeProducts(controller.signal)
        setProducts(allProducts)
        setError(null)
      } catch (err) {
        if (err.name !== 'AbortError') setError(err.message)
      } finally {
        if (!controller.signal.aborted) setLoading(false)
      }
    }
    fetchAll()
    return () => controller.abort()
  }, [retryCount])

  // DEBOUNCED SEARCH
  const handleQueryChange = (e) => {
    const val = e.target.value
    setQuery(val)
    setActiveSuggestion(-1)

    clearTimeout(debounceRef.current)
    searchControllerRef.current?.abort()
    searchControllerRef.current = null
    const trimmed = val.trim()
    if (!trimmed) {
      setSuggestions([])
      setSearchError(false)
      setShowDropdown(false)
      setSearchLoading(false)
      return
    }

    setSearchLoading(true)
    setShowDropdown(true)

    debounceRef.current = setTimeout(async () => {
      const controller = new AbortController()
      searchControllerRef.current = controller
      try {
        const results = await searchShoeProducts(trimmed, controller.signal)
        if (!controller.signal.aborted) {
          setSuggestions(results)
          setSearchError(false)
        }
      } catch (err) {
        if (err.name !== 'AbortError') {
          setSuggestions([])
          setSearchError(true)
        }
      } finally {
        if (!controller.signal.aborted) setSearchLoading(false)
      }
    }, 300)
  }

  useEffect(() => () => {
    clearTimeout(debounceRef.current)
    searchControllerRef.current?.abort()
  }, [])

  // CLOSE DROPDOWN ON CLICK OUTSIDE
  useEffect(() => {
    const handleClick = (e) => {
      if (
        dropdownRef.current && !dropdownRef.current.contains(e.target) &&
        inputRef.current && !inputRef.current.contains(e.target)
      ) {
        setShowDropdown(false)
        setActiveSuggestion(-1)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  // KEYBOARD NAVIGATION
  const handleKeyDown = (e) => {
    if (!showDropdown || suggestions.length === 0) return
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveSuggestion((prev) => Math.min(prev + 1, suggestions.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveSuggestion((prev) => Math.max(prev - 1, -1))
    } else if (e.key === 'Enter') {
      if (activeSuggestion >= 0 && suggestions[activeSuggestion]) {
        navigate(`/productdetails/${suggestions[activeSuggestion].id}`)
        setShowDropdown(false)
        setQuery('')
      }
    } else if (e.key === 'Escape') {
      setShowDropdown(false)
      setActiveSuggestion(-1)
    }
  }

  const handleSuggestionClick = (id) => {
    navigate(`/productdetails/${id}`)
    setShowDropdown(false)
    setQuery('')
    setActiveSuggestion(-1)
  }

  return (
    <FadeIn>
      <div className="min-h-screen w-full bg-[#FBFBFD] font-jakarta px-4 sm:px-8 py-8">
        <div className="max-w-7xl mx-auto space-y-12">

          {/*BANNER*/}
          <div 
            className="relative w-full h-[45vh] sm:h-[45vh] md:h-[55vh] rounded-3xl overflow-hidden bg-cover bg-center shadow-xs"
            style={{ backgroundImage: "url('/shopall-shoe.jpg')" }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/30 flex flex-col justify-between p-6 sm:p-12 text-white">
              {/* Breadcrumb */}
              <nav aria-label="Breadcrumb" className="text-xs font-medium tracking-wide flex items-center gap-2 text-white/70">
                <Link to="/" className="hover:text-white transition-colors">Home</Link>
                <span>/</span>
                <span className="text-white" aria-current="page">Shop All</span>
              </nav>

              <div className="max-w-xl space-y-2">
               
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-[-0.03em] text-white">
                  All Footwears
                </h1>
                <p className="text-xs sm:text-sm md:text-base text-white/85 font-light leading-relaxed">
                  Carefully engineered styles for daily movement, sustainable living, and lasting comfort.
                </p>
              </div>
            </div>
          </div>

          {/* FROSTED MINIMALIST SEARCH */}
          <div className="relative w-full max-w-xl mx-auto" ref={dropdownRef}>
            <div className="relative flex items-center">
              <RiSearchLine className="absolute left-4 text-neutral-400 text-lg pointer-events-none" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={handleQueryChange}
                onFocus={() => { if (query.trim() && suggestions.length > 0) setShowDropdown(true) }}
                onKeyDown={handleKeyDown}
                placeholder="Search styles, colors, silhouettes..."
                className="w-full pl-11 pr-10 py-3.5 bg-[#F5F5F7] hover:bg-[#EFEFEF] focus:bg-white border border-transparent focus:border-black/20 rounded-full text-xs sm:text-sm text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-4 focus:ring-black/5 transition-all shadow-xs"
                aria-label="Search products"
                aria-autocomplete="list"
                aria-controls="search-dropdown"
                aria-activedescendant={activeSuggestion >= 0 ? `suggestion-${activeSuggestion}` : undefined}
              />
              {query && (
                <button
                  onClick={() => { setQuery(''); setSuggestions([]); setShowDropdown(false); inputRef.current?.focus() }}
                  className="absolute right-3.5 text-neutral-400 hover:text-black transition-colors text-xs p-1"
                  aria-label="Clear search"
                >
                  ✕
                </button>
              )}
            </div>

            {/* DROPDOWN SUGGESTIONS */}
            {showDropdown && (
              <div
                id="search-dropdown"
                role="listbox"
                className="absolute top-full left-0 right-0 mt-2 bg-white/95 backdrop-blur-xl border border-black/[0.06] rounded-2xl shadow-xl z-50 overflow-hidden"
              >
                {searchLoading ? (
                  <div className="p-4 space-y-3">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className="flex items-center gap-3 animate-pulse">
                        <div className="w-10 h-10 bg-neutral-100 rounded-xl shrink-0" />
                        <div className="flex-1 space-y-1.5">
                          <div className="h-3 bg-neutral-200 rounded w-3/4" />
                          <div className="h-2 bg-neutral-100 rounded w-1/3" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : searchError ? (
                  <div role="status" className="px-5 py-6 text-center text-xs text-neutral-500">
                    Search is unavailable right now. Try again in a moment.
                  </div>
                ) : suggestions.length > 0 ? (
                  <ul className="divide-y divide-black/[0.04] max-h-[360px] overflow-y-auto">
                    {suggestions.map((item, idx) => (
                      <li
                        key={item.id}
                        id={`suggestion-${idx}`}
                        role="option"
                        aria-selected={activeSuggestion === idx}
                      >
                        <button
                          onMouseDown={() => handleSuggestionClick(item.id)}
                          onMouseEnter={() => setActiveSuggestion(idx)}
                          className={`w-full flex items-center gap-3.5 px-4 py-3 text-left transition-colors cursor-pointer ${
                            activeSuggestion === idx ? 'bg-[#F5F5F7]' : 'hover:bg-neutral-50'
                          }`}
                        >
                          <div className="w-10 h-10 bg-[#F5F5F7] rounded-xl flex items-center justify-center shrink-0 overflow-hidden">
                            <img
                              src={item.thumbnail}
                              alt={item.title}
                              className="w-8 h-8 object-contain"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-neutral-900 truncate">{item.title}</p>
                            <p className="text-[10px] text-neutral-400 capitalize">{item.category}</p>
                          </div>
                          <span className="text-xs font-medium text-neutral-900 shrink-0">
                            ${item.price}
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  !searchLoading && query.trim() && (
                    <div className="px-5 py-6 text-center text-xs text-neutral-500">
                      No results for "{query}"
                    </div>
                  )
                )}
              </div>
            )}
          </div>

          {/* MUSEUM-GRADE PEDESTAL GRID */}
          <div>
            {loading ? (
              <SkeletonGrid />
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
                    {/* PEDESTAL */}
                    <div className="relative bg-[#F5F5F7] rounded-2xl p-6 sm:p-7 aspect-square flex items-center justify-center overflow-hidden group-hover:bg-[#ECECEE] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]">
                      <img
                        src={product.thumbnail || product.images?.[0]}
                        alt={product.title}
                        loading="lazy"
                        className="max-h-[85%] max-w-[85%] object-contain group-hover:scale-[1.05] transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
                      />
                    </div>

                    {/* METADATA */}
                    <div className="pt-3 pb-1 px-1.5 flex flex-col gap-0.5">
                      <span className="text-[10px] font-semibold tracking-[0.15em] uppercase text-neutral-400">
                        {product.brand || 'AllShoes'}
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
              title="Shop All Inquiries"
              description="Browse our complete range of men's and women's shoes, crafted with natural, renewable materials for uncompromising comfort and understated aesthetic poise."
            />
          </div>

        </div>
      </div>
    </FadeIn>
  )
}

export default Allitems
