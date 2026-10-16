import React, { useState, useEffect, useRef, useCallback } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { RiSearchLine } from 'react-icons/ri'
import FAQ from '../Props/FAQ'
import FadeIn from '../FadeIn'

function Allitems() {
  // PRODUCT STATES
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // SEARCH STATE
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [searchLoading, setSearchLoading] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const [activeSuggestion, setActiveSuggestion] = useState(-1)

  const inputRef    = useRef(null)
  const dropdownRef = useRef(null)
  const debounceRef = useRef(null)
  const navigate    = useNavigate()
  const location    = useLocation()

  // SEARCH NAVIGATION
  useEffect(() => {
    if (!location.state?.focusSearch) return

    const input = inputRef.current
    if (!input) return

   
    input.focus({ preventScroll: true })
    input.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }, [location])

  // FETCH ALL PRODUCTS ON MOUNT 
  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [mensRes, womensRes] = await Promise.all([
          fetch('https://dummyjson.com/products/category/mens-shoes'),
          fetch('https://dummyjson.com/products/category/womens-shoes'),
        ])
        if (!mensRes.ok || !womensRes.ok) throw new Error('Failed to fetch products')
        const mensData   = await mensRes.json()
        const womensData = await womensRes.json()
        const merged = [...(mensData.products || []), ...(womensData.products || [])]
        setProducts(merged)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchAll()
  }, [])

  // DEBOUNCED SEARCH SUGGESTIONS 
  useEffect(() => {
    const trimmed = query.trim()

    if (!trimmed) {
      setSuggestions([])
      setShowDropdown(false)
      setSearchLoading(false)
      return
    }

    setSearchLoading(true)
    setShowDropdown(true)

    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(async () => {
      try {
        const res  = await fetch(`https://dummyjson.com/products/search?q=${encodeURIComponent(trimmed)}&limit=8`)
        const data = await res.json()
        setSuggestions(data.products || [])
      } catch {
        setSuggestions([])
      } finally {
        setSearchLoading(false)
      }
    }, 350)

    return () => clearTimeout(debounceRef.current)
  }, [query])

  // CLOSE DROPDOWN 
  useEffect(() => {
    const handleClick = (e) => {
      if (
        dropdownRef.current && !dropdownRef.current.contains(e.target) &&
        inputRef.current   && !inputRef.current.contains(e.target)
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

  // SKELETON CARDS 
  const SkeletonGrid = () => (
    <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4'>
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className='bg-white rounded-2xl sm:rounded-3xl overflow-hidden p-3 sm:p-4 shadow-xs animate-pulse flex flex-col justify-between border border-gray-100'
        >
          <div className='w-full h-36 sm:h-52 bg-gray-100 rounded-xl mb-3 relative flex items-center justify-center p-2'>
            <div className='absolute top-3 left-3 w-10 h-4 bg-gray-200/80 rounded-full' />
            <div className='w-24 h-20 sm:w-32 sm:h-28 bg-gray-200/60 rounded-xl' />
          </div>
          <div className='space-y-2 pt-2 border-t border-gray-100'>
            <div className='h-3.5 bg-gray-200/80 rounded w-3/4' />
            <div className='h-2.5 bg-gray-200/60 rounded w-1/2' />
            <div className='flex justify-between items-center pt-2'>
              <div className='h-4 bg-gray-200/80 rounded w-12' />
              <div className='h-3 bg-gray-200/70 rounded w-8' />
            </div>
          </div>
        </div>
      ))}
    </div>
  )

  return (
    <FadeIn>
        <div className='min-h-screen w-full bg-[#ECE9E2] font-jakarta px-3 sm:px-6 py-6'>
      <div className='max-w-7xl mx-auto space-y-8'>

        {/* HERO BANNER */}
        <div 
          className='relative w-full h-[45dvh] sm:h-[45vh] md:h-[55vh] rounded-3xl overflow-hidden bg-cover bg-center shadow-sm'
          style={{ backgroundImage: "url('/shopall-shoe.jpg')" }}
        >
          <div className='absolute inset-0 bg-gradient-to-r from-black/60 via-black/20 to-transparent flex flex-col justify-between p-6 sm:p-10 text-white'>

            {/* Breadcrumb */}
            <div className='text-xs sm:text-sm font-semibold tracking-wide flex items-center gap-2 text-gray-400'>
              <Link to='/' className='hover:underline hover:text-white transition-colors'>Home</Link>
              <span>/</span>
              <span className='text-white font-semibold'>Shop All</span>
            </div>

            {/* Headline */}
            <div className='max-w-xl space-y-2 mb-2 sm:mb-4'>
              <h1 className='text-3xl sm:text-[2.5rem] font-extrabold tracking-tight text-white'>
                AllShoes
              </h1>
              <p className='text-xs sm:text-sm md:text-base text-white/90 leading-relaxed font-normal'>
                Browse our full collection, from timeless men's styles to women's must-haves.
              </p>
            </div>
          </div>
        </div>

        {/* SEARCH BAR */}
        <div className='relative w-full max-w-2xl mx-auto' ref={dropdownRef}>
          <div className='relative flex items-center'>
            <RiSearchLine className='absolute left-4 text-gray-400 text-lg pointer-events-none' />
            <input
              ref={inputRef}
              type='text'
              value={query}
              onChange={(e) => { setQuery(e.target.value); setActiveSuggestion(-1) }}
              onFocus={() => { if (query.trim() && suggestions.length > 0) setShowDropdown(true) }}
              onKeyDown={handleKeyDown}
              placeholder='What are you looking for?'
              className='w-full pl-11 pr-4 py-3.5 bg-white border border-gray-200 rounded-2xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-200 transition-all shadow-sm'
              aria-label='Search products'
              aria-autocomplete='list'
              aria-controls='search-dropdown'
              aria-activedescendant={activeSuggestion >= 0 ? `suggestion-${activeSuggestion}` : undefined}
            />
            {query && (
              <button
                onClick={() => { setQuery(''); setSuggestions([]); setShowDropdown(false); inputRef.current?.focus() }}
                className='absolute right-4 text-gray-400 hover:text-gray-700 transition-colors sm:text-sm cursor-pointer'
                aria-label='Clear search'
              >
                ✕
              </button>
            )}
          </div>

          {/* DROPDOWN SUGGESTIONS */}
          {showDropdown && (
            <div
              id='search-dropdown'
              role='listbox'
              className='absolute top-full left-0 right-0 mt-2 bg-white border border-gray-100 rounded-2xl shadow-xl z-50 overflow-hidden'
            >
              {searchLoading ? (
                <div className='p-4 space-y-3'>
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className='flex items-center gap-3 animate-pulse'>
                      <div className='w-10 h-10 bg-gray-100 rounded-xl flex-shrink-0' />
                      <div className='flex-1 space-y-1.5'>
                        <div className='h-3 bg-gray-200 rounded w-3/4' />
                        <div className='h-2.5 bg-gray-100 rounded w-1/3' />
                      </div>
                      <div className='h-3 bg-gray-200 rounded w-10' />
                    </div>
                  ))}
                </div>
              ) : suggestions.length > 0 ? (
                <ul className='divide-y divide-gray-50 max-h-[360px] overflow-y-auto'>
                  {suggestions.map((item, idx) => (
                    <li
                      key={item.id}
                      id={`suggestion-${idx}`}
                      role='option'
                      aria-selected={activeSuggestion === idx}
                    >
                      <button
                        onMouseDown={() => handleSuggestionClick(item.id)}
                        onMouseEnter={() => setActiveSuggestion(idx)}
                        className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors cursor-pointer ${
                          activeSuggestion === idx ? 'bg-[#ECE9E2]' : 'hover:bg-gray-50'
                        }`}
                      >
                        {/* Thumbnail */}
                        <div className='w-11 h-11 bg-[#F4F1EA] rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden border border-gray-100'>
                          <img
                            src={item.thumbnail}
                            alt={item.title}
                            className='w-9 h-9 object-contain'
                          />
                        </div>
                        {/* Info */}
                        <div className='flex-1 min-w-0'>
                          <p className='text-xs font-bold text-gray-900 truncate'>{item.title}</p>
                          <p className='text-[10px] text-gray-400 capitalize'>{item.category}</p>
                        </div>
                        {/* Price */}
                        <span className='text-xs font-extrabold text-gray-900 flex-shrink-0'>
                          ${item.price}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                !searchLoading && query.trim() && (
                  <div className='px-5 py-6 text-center'>
                    <p className='text-sm font-semibold text-gray-700'>No results for "{query}"</p>
                    <p className='text-xs text-gray-400 mt-1'>Try a different keyword</p>
                  </div>
                )
              )}
            </div>
          )}
        </div>

        {/* PRODUCT GRID */}
        <div>
          {loading ? (
            <SkeletonGrid />
          ) : error ? (
            <div className='flex items-center justify-center py-12'>
              <div className='w-full max-w-lg bg-white border border-gray-200/80 rounded-3xl p-8 sm:p-10 text-center flex flex-col items-center gap-3 shadow-xs'>
                <span className='font-jakarta text-[11px] uppercase tracking-widest text-gray-400 font-semibold'>
                  Connection Error
                </span>
                <h3 className='font-jakarta font-extrabold text-lg sm:text-xl text-gray-950 tracking-tight'>
                  Unable to load products
                </h3>
                <p className='font-jakarta text-xs sm:text-sm text-gray-600 max-w-sm leading-relaxed'>
                  We couldn't retrieve the product list. Please check your network connection and try again.
                </p>
                <button
                  onClick={() => window.location.reload()}
                  className='mt-3 font-jakarta text-xs sm:text-sm font-bold bg-[#111111] text-white px-7 py-3 rounded-full hover:bg-black hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 cursor-pointer shadow-xs'
                >
                  Try Again
                </button>
              </div>
            </div>
          ) : (
            <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 sm:px-10 gap-3 sm:gap-4'>
              {products.map((product) => (
                <Link
                  key={product.id}
                  to={`/productdetails/${product.id}`}
                  className='block h-full group'
                >
                  <div className='relative bg-white rounded-2xl sm:rounded-3xl overflow-hidden p-3 sm:p-4 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between h-full'>

                    {/* Badge */}
                    <span className='absolute top-3 left-3 text-black text-[9px] sm:text-[10px] uppercase tracking-widest font-extrabold px-2.5 py-0.5 rounded-full z-10'>
                      New
                    </span>

                    {/* Product Image */}
                    <div className='w-full h-34 sm:h-42 lg:h-52 flex items-center justify-center p-1 sm:p-2 overflow-hidden bg-white'>
                      <img
                        src={product.thumbnail || product.images?.[0]}
                        alt={product.title}
                        loading='lazy'
                        className='max-h-full object-contain group-hover:scale-105 transition-transform duration-500 ease-out'
                      />
                    </div>

                    {/* Details */}
                    <div className='mt-2 sm:mt-4 pt-2 border-t border-gray-100 flex flex-col gap-1.5'>
                      <h3 className='font-bold text-xs sm:text-sm text-gray-900 line-clamp-1 group-hover:text-black transition-colors'>
                        {product.title}
                      </h3>
                      <p className='text-[10px] sm:text-xs text-gray-500 line-clamp-1 capitalize'>
                        {product.description}
                      </p>
                      <div className='flex items-center justify-between mt-1 pt-1'>
                        <span className='font-extrabold text-xs sm:text-sm text-gray-900'>
                          ${product.price}
                        </span>
                        <span className='text-[10px] sm:text-xs font-semibold text-gray-600 bg-gray-100 px-1.5 py-0.5 rounded-md'>
                          ★ {product.rating}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className='pt-8 border-t border-gray-300/60'>
          <FAQ
            title='SHOP ALL'
            description="Browse our complete range of men's and women's shoes, thoughtfully crafted for every step. Whether you're off to work, out on the trail, or heading out for the evening, find your perfect pair here, made for comfort and designed for style."
          />
        </div>

      </div>
    </div>
    </FadeIn>
  )
}

export default Allitems