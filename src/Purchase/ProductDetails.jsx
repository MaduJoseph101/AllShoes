import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { FaHeart } from 'react-icons/fa'
import { FiHeart, FiArrowLeft, FiCheck } from 'react-icons/fi'
import { useCart } from '../CartContext'
import ProductsDisplay from './ProductsDisplay'
import { fetchProductById } from '../api/products'

const MENS_SIZES = [8, 8.5, 9, 9.5, 10, 10.5, 11, 11.5, 12, 12.5, 13, 14, 15]
const OUT_OF_STOCK_SIZES = [12, 15]

function ProductDetails() {
  const navigate = useNavigate()
  const { id } = useParams()
  const { addToCart, cartItems, toggleWishlist, isInWishlist, user } = useCart()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [retryCount, setRetryCount] = useState(0)
  
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedSize, setSelectedSize] = useState(null)
  const [selectedColor, setSelectedColor] = useState(0)

  useEffect(() => {
    const controller = new AbortController()
    const fetchProductDetails = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await fetchProductById(id, controller.signal)
        setProduct(data)
      } catch (err) {
        if (err.name !== 'AbortError') setError(err.message)
      } finally {
        if (!controller.signal.aborted) setLoading(false)
      }
    }
    fetchProductDetails()
    return () => controller.abort()
  }, [id, retryCount])

  const colors = [
    { name: 'Natural Charcoal', bg: 'bg-[#2b2b2b]', border: 'border-black' },
    { name: 'Slate Gray', bg: 'bg-[#525252]', border: 'border-gray-500' },
    { name: 'Mist White', bg: 'bg-[#f5f5f5]', border: 'border-gray-300' },
  ]

  const colorHexMap = ['#2b2b2b', '#525252', '#f5f5f5']

  const cartKey = product && selectedSize
    ? `${product.id}-${selectedSize}-${colors[selectedColor].name}`
    : null

  const cartItem = cartItems.find((i) => i.key === cartKey)
  const cartQty = cartItem ? cartItem.quantity : 0
  const isMaxStockReached = product && cartQty >= (product.stock || 99)

  const [addedToCart, setAddedToCart] = useState(false)

  const handleAddToCart = () => {
    if (!user) {
      addToCart(product, selectedSize || 9, { ...colors[selectedColor], hex: colorHexMap[selectedColor] })
      return
    }

    if (!selectedSize) return
    if (isMaxStockReached) {
      return
    }

    const success = addToCart(product, selectedSize, { ...colors[selectedColor], hex: colorHexMap[selectedColor] })
    if (success) {
      setAddedToCart(true)
      setTimeout(() => setAddedToCart(false), 4000)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FBFBFD] font-jakarta py-12 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 animate-pulse">
          <div className="lg:col-span-7 bg-[#F5F5F7] rounded-3xl aspect-square w-full" />
          <div className="lg:col-span-5 space-y-6 pt-4">
            <div className="h-8 bg-neutral-200 rounded w-3/4" />
            <div className="h-6 bg-neutral-200 rounded w-1/3" />
            <div className="h-32 bg-neutral-200 rounded-2xl" />
            <div className="h-12 bg-neutral-200 rounded-full" />
          </div>
        </div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="min-h-[70vh] bg-[#FBFBFD] font-jakarta flex flex-col items-center justify-center px-4">
        <div className="text-center space-y-4 max-w-sm">
          <h2 className="text-xl font-semibold text-neutral-900">Product Not Found</h2>
          <p className="text-neutral-500 text-sm">The style you are looking for is currently unavailable.</p>
          <button
            type="button"
            onClick={() => {
              setError(null)
              setLoading(true)
              setRetryCount((count) => count + 1)
            }}
            className="inline-block text-neutral-700 underline text-xs font-medium hover:text-black"
          >
            Try again
          </button>
          <Link to="/" className="inline-block bg-[#000000] text-white px-6 py-3 rounded-full text-xs font-medium">
            Return to Homepage
          </Link>
        </div>
      </div>
    )
  }

  const imagesList = product.images && product.images.length > 0 ? product.images : [product.thumbnail]

  return (
    <div className="min-h-screen bg-[#FBFBFD] font-jakarta py-8 px-4 sm:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* BREADCRUMB / BACK LINK */}
        <div>
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-xs font-medium text-neutral-500 hover:text-black transition-colors cursor-pointer"
          >
            <FiArrowLeft className="text-xs" /> Back
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start">
          
          {/* STUDIO GALLERY */}
          <div className="lg:col-span-7 space-y-4">
            <div className="wide-product-gallery relative bg-[#F5F5F7] rounded-3xl p-8 sm:p-14 flex items-center justify-center min-h-[420px] sm:min-h-[520px] overflow-hidden border border-black/[0.04]">
              <img 
                src={imagesList[selectedImage] || product.thumbnail} 
                alt={product.title} 
                className="wide-product-image max-h-[420px] sm:max-h-[480px] w-auto object-contain transition-all duration-500 hover:scale-[1.03]"
              />
            </div>

            {/* THUMBNAILS */}
            {imagesList.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {imagesList.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`relative w-20 h-20 rounded-2xl bg-[#F5F5F7] p-2 transition-all cursor-pointer flex-shrink-0 flex items-center justify-center border ${
                      selectedImage === idx ? 'border-black ring-1 ring-black' : 'border-black/[0.06] opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt={`Preview ${idx + 1}`} className="max-h-full object-contain" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* PRODUCT SPEC & PURCHASE PANEL */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Header info */}
            <div className="space-y-2">
              <span className="text-[11px] font-semibold tracking-[0.15em] uppercase text-neutral-400">
                {product.brand || 'AllShoes Exclusive'}
              </span>
              <h1 className="text-2xl sm:text-3xl font-semibold tracking-[-0.02em] text-[#000000]">
                {product.title}
              </h1>
              <div className="flex items-baseline gap-3 pt-1">
                <span className="text-xl sm:text-2xl font-semibold text-neutral-900">
                  ${product.price}
                </span>
                <span className="text-xs text-neutral-500 font-light">
                  Free standard shipping & 30-day returns
                </span>
              </div>
            </div>

            {/* COLOR SELECTOR */}
            <div className="space-y-3 pt-3 border-t border-black/[0.06]">
              <div className="flex justify-between items-center text-xs">
                <span className="font-medium text-neutral-700">Finish</span>
                <span className="text-neutral-500">{colors[selectedColor].name}</span>
              </div>
              <div className="flex gap-3">
                {colors.map((color, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedColor(idx)}
                    className={`w-7 h-7 rounded-full ${color.bg} transition-all cursor-pointer ${
                      selectedColor === idx ? 'ring-2 ring-offset-2 ring-black scale-110' : 'hover:scale-105 border border-black/10'
                    }`}
                    aria-label={color.name}
                  />
                ))}
              </div>
            </div>

            {/* SIZE GRID */}
            <div className="space-y-3 pt-3 border-t border-black/[0.06]">
              <div className="flex justify-between items-center text-xs">
                <span className="font-medium text-neutral-700">Select Size (US Men)</span>
                <span className="text-neutral-400 text-[11px]">True to size</span>
              </div>

              <div
                className="grid grid-cols-5 gap-2"
                role="group"
                aria-label="Select shoe size"
              >
                {MENS_SIZES.map((size) => {
                  const isOutOfStock = OUT_OF_STOCK_SIZES.includes(size)
                  const isSelected = selectedSize === size

                  return (
                    <button
                      key={size}
                      onClick={() => !isOutOfStock && setSelectedSize(size)}
                      disabled={isOutOfStock}
                      aria-pressed={isSelected || undefined}
                      className={`h-11 rounded-xl text-xs font-medium transition-all cursor-pointer flex items-center justify-center border ${
                        isOutOfStock
                          ? 'border-neutral-200 text-neutral-300 bg-neutral-50 cursor-not-allowed line-through'
                          : isSelected
                          ? 'bg-[#000000] text-white border-[#000000] shadow-xs'
                          : 'border-neutral-200 hover:border-black text-neutral-800 bg-white'
                      }`}
                    >
                      {size}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* ACTIONS */}
            <div className="pt-3 space-y-3">
              <div className="flex items-center gap-3">
                <button
                  onClick={handleAddToCart}
                  disabled={!selectedSize}
                  className={`flex-1 py-4 rounded-full text-xs font-semibold tracking-wider uppercase transition-all duration-300 shadow-sm ${
                    !selectedSize
                      ? 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
                      : isMaxStockReached
                      ? 'bg-neutral-800 text-white cursor-not-allowed'
                      : 'bg-[#000000] hover:bg-black text-white cursor-pointer hover:shadow-md'
                  }`}
                >
                  {!selectedSize
                    ? 'Select a Size'
                    : isMaxStockReached
                    ? 'Maximum Stock Reached'
                    : cartQty > 0
                    ? `In Cart (×${cartQty}) — Add Another`
                    : `Add to Cart — $${product.price}`}
                </button>

                <button
                  onClick={() => toggleWishlist(product)}
                  className={`h-12 w-12 rounded-full border flex items-center justify-center transition-colors cursor-pointer ${
                    isInWishlist(product.id)
                      ? 'border-red-400 bg-red-50 text-red-500'
                      : 'border-neutral-200 text-neutral-600 hover:border-black hover:text-black bg-white'
                  }`}
                  aria-label={isInWishlist(product.id) ? 'Remove from Saved' : 'Save for Later'}
                >
                  {isInWishlist(product.id) ? (
                    <FaHeart className="text-base text-red-500" />
                  ) : (
                    <FiHeart className="text-base" />
                  )}
                </button>
              </div>

              {/* Status alerts */}
              {addedToCart && (
                <div className="p-3 bg-neutral-900 text-white text-xs rounded-2xl flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <FiCheck className="text-sm" /> Added to your cart
                  </span>
                  <Link to="/cart" className="underline font-semibold hover:text-neutral-300">
                    View Cart →
                  </Link>
                </div>
              )}
            </div>

            {/* DETAILS ACCORDION / SPECS */}
            <div className="pt-6 border-t border-black/[0.06] space-y-3 text-xs text-neutral-600">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-neutral-900">
                Product Details
              </h2>
              <p className="leading-relaxed font-light text-neutral-700">
                {product.description}
              </p>
              
              <div className="grid grid-cols-2 gap-y-2 pt-2 text-[11px] border-t border-black/[0.04]">
                <div><span className="font-medium text-neutral-900">Materials:</span> Merino wool & Eucalyptus</div>
                <div><span className="font-medium text-neutral-900">Warranty:</span> 1 Year Limited</div>
                <div><span className="font-medium text-neutral-900">Weight:</span> 8.8 oz (Lightweight)</div>
                <div><span className="font-medium text-neutral-900">Care:</span> Machine Washable</div>
              </div>
            </div>

          </div>

        </div>

        {/* CUSTOMER REVIEWS */}
        {product.reviews && product.reviews.length > 0 && (
          <div className="my-16 pt-12 border-t border-black/[0.06]">
            <div className="flex justify-between items-baseline mb-8">
              <div>
                <span className="text-[11px] font-semibold tracking-[0.2em] uppercase text-neutral-400">Feedback</span>
                <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-neutral-900 mt-0.5">
                  Verified Reviews ({product.reviews.length})
                </h2>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {product.reviews.map((rev, idx) => (
                <div key={idx} className="p-6 bg-[#F5F5F7] rounded-3xl space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-neutral-900">{rev.reviewerName}</span>
                    <span className="text-neutral-500 font-medium">★ {rev.rating}.0</span>
                  </div>
                  <p className="text-xs text-neutral-700 italic font-light leading-relaxed">
                    "{rev.comment}"
                  </p>
                  <p className="text-[10px] text-neutral-400">
                    {new Date(rev.date).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      <ProductsDisplay />    
    </div>
  )
}

export default ProductDetails
