import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io"
import { fetchAllShoeProducts } from '../api/products'

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
})

function getVisibleCount() {
  if (typeof window === 'undefined') return 4
  const w = window.innerWidth
  if (w < 640) return 1
  if (w < 768) return 2
  if (w < 1024) return 3
  if (w >= 2560) return 6
  if (w >= 1920) return 5
  return 4
}

function BestSellers() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [retryCount, setRetryCount] = useState(0)

  const [visibleCount, setVisibleCount] = useState(getVisibleCount)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [withTransition, setWithTransition] = useState(true)
  const [isJumping, setIsJumping] = useState(false)
  const prevVisibleCount = useRef(visibleCount)
  const hasPositioned = useRef(false)

  // Mobile drag state
  const [dragPx, setDragPx] = useState(0)
  const dragPxRef = useRef(0)
  const dragState = useRef({ active: false, startX: 0, moved: false })
  const viewportRef = useRef(null)
  const isMobile = visibleCount === 1

  const prevDisabled = isJumping || data.length === 0
  const nextDisabled = isJumping || data.length === 0

  useEffect(() => {
    let resizeTimeout
    const onResize = () => {
      clearTimeout(resizeTimeout)
      resizeTimeout = setTimeout(() => setVisibleCount(getVisibleCount()), 150)
    }
    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('resize', onResize)
      clearTimeout(resizeTimeout)
    }
  }, [])

  useEffect(() => {
    const controller = new AbortController()

    const fetchShoes = async () => {
      try {
        const products = await fetchAllShoeProducts(controller.signal)
        const mixed = []
        const mensProducts = products.filter((product) => product.category === 'mens-shoes')
        const womensProducts = products.filter((product) => product.category === 'womens-shoes')
        const max = Math.max(mensProducts.length, womensProducts.length)
        for (let i = 0; i < max; i++) {
          if (mensProducts[i]) mixed.push(mensProducts[i])
          if (womensProducts[i]) mixed.push(womensProducts[i])
        }

        if (!controller.signal.aborted) {
          setData(mixed)
          setError(null)
        }
      } catch (err) {
        if (err.name !== 'AbortError') setError(err.message)
      } finally {
        if (!controller.signal.aborted) setLoading(false)
      }
    }

    fetchShoes()
    return () => controller.abort()
  }, [retryCount])

  useEffect(() => {
    if (!withTransition) {
      const frameId = requestAnimationFrame(() => {
        setWithTransition(true)
        setIsJumping(false)
      })
      return () => cancelAnimationFrame(frameId)
    }
    return undefined
  }, [withTransition])

  useEffect(() => {
    if (!loading && data.length > 0) {
      const safeCount = Math.min(visibleCount, data.length)
      if (hasPositioned.current && prevVisibleCount.current === visibleCount) return

      const frameId = requestAnimationFrame(() => {
        setWithTransition(false)
        setCurrentIndex(safeCount)
        hasPositioned.current = true
        prevVisibleCount.current = visibleCount
      })
      return () => cancelAnimationFrame(frameId)
    }
    return undefined
  }, [visibleCount, loading, data.length])

  // SKELETON
  if (loading) return (
    <section aria-label="Loading trending products" className="w-full max-w-7xl mx-auto my-16 px-6 font-jakarta">
      <div className="flex justify-between items-center mb-8">
        <div>
          <span className="text-[11px] font-semibold tracking-[0.2em] uppercase text-neutral-400">Curated</span>
          <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-neutral-900 mt-1">Trending Now</h2>
        </div>
        <div className="flex gap-2">
          <div className="w-9 h-9 rounded-full bg-neutral-200 animate-pulse" />
          <div className="w-9 h-9 rounded-full bg-neutral-200 animate-pulse" />
        </div>
      </div>
      <div className="best-seller-skeleton-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: visibleCount }).map((_, i) => (
          <div key={i} className="flex flex-col gap-3 animate-pulse">
            <div className="bg-[#F5F5F7] rounded-3xl aspect-square w-full" />
            <div className="h-4 bg-neutral-200 rounded w-2/3" />
            <div className="h-3 bg-neutral-200 rounded w-1/3" />
          </div>
        ))}
      </div>
    </section>
  )

  if (error) return (
    <section aria-label="Trending products" className="w-full max-w-7xl mx-auto my-16 px-4 sm:px-6 font-jakarta text-center">
      <p className="text-sm text-neutral-500">Trending products are unavailable right now.</p>
      <button
        type="button"
        onClick={() => {
          setError(null)
          setLoading(true)
          setRetryCount((count) => count + 1)
        }}
        className="mt-2 text-xs font-medium text-neutral-700 underline hover:text-black"
      >
        Try again
      </button>
    </section>
  )
  if (data.length === 0) return null

  const safeVisibleCount = Math.min(visibleCount, data.length)
  const clonesBefore = data.slice(-safeVisibleCount)
  const clonesAfter = data.slice(0, safeVisibleCount)
  const extendedData = [...clonesBefore, ...data, ...clonesAfter]

  const slideOffset = (currentIndex * 100) / extendedData.length
  const realSlideNumber = (((currentIndex - safeVisibleCount) % data.length) + data.length) % data.length + 1

  const handleNext = () => {
    if (isJumping) return
    setWithTransition(true)
    setCurrentIndex((prev) => prev + 1)
  }

  const handlePrev = () => {
    if (isJumping) return
    setWithTransition(true)
    setCurrentIndex((prev) => prev - 1)
  }

  const handleTransitionEnd = (e) => {
    if (e.target !== e.currentTarget || e.propertyName !== 'transform') return

    if (currentIndex >= data.length + safeVisibleCount || currentIndex < safeVisibleCount) {
      const relative = currentIndex - safeVisibleCount
      const normalized = ((relative % data.length) + data.length) % data.length
      setIsJumping(true)
      setWithTransition(false)
      setCurrentIndex(normalized + safeVisibleCount)
    }
  }

  const handleDragStart = (e) => {
    if (!isMobile || isJumping) return
    if (e.pointerType === 'mouse' && e.button !== 0) return
    dragState.current = { active: true, startX: e.clientX, moved: false }
    dragPxRef.current = 0
    setDragPx(0)
    setWithTransition(false)
    e.currentTarget.setPointerCapture(e.pointerId)
  }

  const handleDragMove = (e) => {
    const st = dragState.current
    if (!st.active) return
    const dx = e.clientX - st.startX
    if (Math.abs(dx) > 5) st.moved = true
    dragPxRef.current = dx
    setDragPx(dx)
  }

  const handleDragEnd = () => {
    const st = dragState.current
    if (!st.active) return
    st.active = false
    const dx = dragPxRef.current
    dragPxRef.current = 0
    setDragPx(0)
    setWithTransition(true)

    const width = viewportRef.current?.clientWidth ?? window.innerWidth
    const threshold = width * 0.2
    if (st.moved && dx <= -threshold) {
      setCurrentIndex((prev) => prev + 1)
    } else if (st.moved && dx >= threshold) {
      setCurrentIndex((prev) => prev - 1)
    }
  }

  const handleDragCancel = () => {
    if (!dragState.current.active) return
    dragState.current.active = false
    dragPxRef.current = 0
    setDragPx(0)
    setWithTransition(true)
  }

  const handleCaptureClick = (e) => {
    if (dragState.current.moved) {
      e.preventDefault()
      e.stopPropagation()
      dragState.current.moved = false
    }
  }

  return (
    <section aria-label="Trending products" className="w-full max-w-7xl mx-auto my-16 px-4 sm:px-6 font-jakarta">
      {/* SECTION HEADER */}
      <div className="flex justify-between items-end mb-8 px-2">
        <div>
          <span className="text-[11px] font-semibold tracking-[0.2em] uppercase text-neutral-400">
            Selected
          </span>
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-[-0.02em] text-[#000000] mt-0.5">
            Trending Now
          </h2>
        </div>

        <div className="flex gap-2.5 items-center" role="group" aria-label="Carousel navigation">
          <button
            type="button"
            onClick={handlePrev}
            disabled={prevDisabled}
            aria-label="Previous product"
            className="w-10 h-10 rounded-full border border-black/10 flex items-center justify-center text-neutral-700 hover:text-black hover:border-black/30 hover:bg-neutral-100 transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-black"
          >
            <IoIosArrowBack className="text-lg" />
          </button>
          <button
            type="button"
            onClick={handleNext}
            disabled={nextDisabled}
            aria-label="Next product"
            className="w-10 h-10 rounded-full border border-black/10 flex items-center justify-center text-neutral-700 hover:text-black hover:border-black/30 hover:bg-neutral-100 transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-black"
          >
            <IoIosArrowForward className="text-lg" />
          </button>
        </div>
      </div>

      <p className="sr-only" aria-live="polite">
        Showing product {realSlideNumber} of {data.length}
      </p>

      {/* CAROUSEL VIEWPORT */}
      <div ref={viewportRef} className="overflow-hidden w-full pb-4">
        <div
          role="group"
          aria-roledescription="carousel"
          aria-label="Trending products carousel"
          onTransitionEnd={handleTransitionEnd}
          onPointerDown={handleDragStart}
          onPointerMove={handleDragMove}
          onPointerUp={handleDragEnd}
          onPointerCancel={handleDragCancel}
          onClickCapture={handleCaptureClick}
          className={`flex items-stretch select-none ${isMobile ? 'touch-pan-y cursor-grab active:cursor-grabbing' : ''} ${withTransition ? 'transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]' : ''}`}
          style={{
            transform: `translateX(calc(-${slideOffset}% + ${dragPx}px))`,
            width: `${(extendedData.length * 100) / visibleCount}%`,
          }}
        >
          {extendedData.map((shoe, i) => (
            <div
              key={`${shoe.id}-${i}`}
              className="px-2.5 sm:px-3"
              style={{ width: `${100 / extendedData.length}%` }}
            >
              <Link
                to={`/productdetails/${shoe.id}`}
                className="block h-full group bg-white rounded-3xl p-3 border border-neutral-300 hover:border-neutral-900 shadow-xs hover:shadow-lg transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-black"
              >
                {/* MUSEUM PEDESTAL */}
                <div className="relative bg-[#F5F5F7] rounded-2xl p-6 aspect-square flex items-center justify-center overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:bg-[#ECECEE]">
                  <img
                    src={shoe.thumbnail}
                    alt={shoe.title}
                    className="max-h-[85%] max-w-[85%] object-contain group-hover:scale-[1.05] transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
                  />
                </div>

                {/* DETAILS BELOW PEDESTAL */}
                <div className="pt-3 pb-1 px-1.5 flex flex-col gap-0.5">
                  <span className="text-[10px] font-semibold tracking-[0.15em] uppercase text-neutral-400">
                    {shoe.brand || 'Classic'}
                  </span>
                  <div className="flex justify-between items-baseline gap-2">
                    <h3 className="text-xs sm:text-sm font-medium text-neutral-900 truncate group-hover:text-black">
                      {shoe.title}
                    </h3>
                    <span className="text-xs sm:text-sm text-neutral-800 font-semibold shrink-0">
                      {currencyFormatter.format(shoe.price)}
                    </span>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default BestSellers
