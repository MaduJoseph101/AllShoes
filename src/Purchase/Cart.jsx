import { Link } from 'react-router-dom'
import { useCart } from '../CartContext'
import { FiTrash2, FiMinus, FiPlus, FiShoppingBag, FiArrowLeft, FiTag } from 'react-icons/fi'
import { FaTruck, FaUndoAlt } from 'react-icons/fa'
import { useState, useEffect } from 'react'

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
})

const PROMO_CODES = {
  ALLSHOES10: 0.10,
  SAVE20: 0.20,
}

function Cart() {
  const { cartItems, removeFromCart, updateQuantity, clearCart, subtotal, itemCount, openCheckout } = useCart()
  const [promoInput, setPromoInput] = useState('')
  const [appliedPromo, setAppliedPromo] = useState(null)
  const [promoError, setPromoError] = useState('')
  const [promoSuccess, setPromoSuccess] = useState('')
  const [recommendations, setRecommendations] = useState([])

  useEffect(() => {
    const controller = new AbortController()

    const fetchRecommendations = async () => {
      try {
        const res = await fetch('https://dummyjson.com/products/category/mens-shoes', { signal: controller.signal })
        const data = await res.json()
        if (data.products) {
          setRecommendations(data.products.slice(0, 4))
        }
      } catch (error) {
        if (error.name !== 'AbortError') {
        }
      }
    }

    fetchRecommendations()
    return () => controller.abort()
  }, [])

  const shippingThreshold = 100
  const shippingCost = subtotal >= shippingThreshold ? 0 : 9.99
  const discount = appliedPromo ? subtotal * PROMO_CODES[appliedPromo] : 0
  const tax = (subtotal - discount) * 0.08
  const total = subtotal - discount + tax + shippingCost

  const handlePromo = () => {
    const code = promoInput.trim().toUpperCase()
    if (PROMO_CODES[code]) {
      setAppliedPromo(code)
      setPromoError('')
      setPromoSuccess(`"${code}" applied — ${(PROMO_CODES[code] * 100).toFixed(0)}% discount`)
    } else {
      setPromoError('Invalid code. Try ALLSHOES10 or SAVE20.')
      setPromoSuccess('')
    }
  }

  const removePromo = () => {
    setAppliedPromo(null)
    setPromoInput('')
    setPromoSuccess('')
    setPromoError('')
  }

  // EMPTY STATE
  if (cartItems.length === 0) {
    return (
      <div className="min-h-[80vh] bg-[#FBFBFD] font-jakarta flex flex-col items-center justify-center px-4 py-16">
        <div className="bg-white rounded-3xl p-10 sm:p-14 max-w-md w-full text-center space-y-6 shadow-xs border border-black/[0.06]">
          <div className="flex justify-center">
            <div className="bg-[#F5F5F7] p-6 rounded-full text-neutral-400">
              <FiShoppingBag className="text-3xl" />
            </div>
          </div>
          <div className="space-y-2">
            <h1 className="text-xl sm:text-2xl font-semibold text-neutral-900 tracking-tight">Your cart is empty</h1>
            <p className="text-xs sm:text-sm text-neutral-500 font-light leading-relaxed">
              Explore our collection to find sustainable comfort designed for daily movement.
            </p>
          </div>
          <Link
            to="/all"
            className="inline-block bg-[#000000] hover:bg-black text-white font-medium text-xs tracking-wider uppercase px-8 py-3.5 rounded-full transition-all duration-200 shadow-sm"
          >
            Explore Collection
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#FBFBFD] font-jakarta py-10 px-4 sm:px-8">
      <div className="max-w-6xl mx-auto space-y-8">

        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-black/[0.06] pb-4">
          <Link
            to="/all"
            className="inline-flex items-center gap-2 text-xs font-medium text-neutral-500 hover:text-black transition-colors"
          >
            <FiArrowLeft className="text-xs" /> Continue Shopping
          </Link>
          <h1 className="text-base sm:text-lg font-semibold text-neutral-900 tracking-tight">
            Review Cart <span className="text-neutral-400 font-normal">({itemCount})</span>
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* CART ITEMS LIST */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex justify-end">
              <button
                onClick={clearCart}
                className="text-[11px] font-medium text-neutral-400 hover:text-red-500 transition-colors cursor-pointer"
              >
                Clear all items
              </button>
            </div>

            {cartItems.map((item) => (
              <div
                key={item.key}
                className="bg-white rounded-3xl p-5 sm:p-6 flex gap-4 sm:gap-6 border border-neutral-200/80 shadow-sm transition-all duration-200"
              >
                {/* Thumbnail */}
                <Link to={`/productdetails/${item.id}`} className="shrink-0">
                  <div className="w-24 h-24 sm:w-28 sm:h-28 bg-[#F5F5F7] rounded-2xl flex items-center justify-center overflow-hidden">
                    <img
                      src={item.thumbnail}
                      alt={item.title}
                      className="max-h-[82%] max-w-[82%] object-contain hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                </Link>

                {/* Details */}
                <div className="flex flex-col justify-between flex-1 min-w-0">
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-semibold tracking-wider uppercase text-neutral-400">
                      {item.brand}
                    </span>
                    <Link
                      to={`/productdetails/${item.id}`}
                      className="text-sm sm:text-base font-medium text-neutral-900 tracking-tight truncate block hover:underline"
                    >
                      {item.title}
                    </Link>
                    <div className="flex flex-wrap gap-2 pt-0.5">
                      <span className="text-[10px] text-neutral-500 bg-[#F5F5F7] px-2.5 py-0.5 rounded-full">
                        Size {item.size}
                      </span>
                      <span className="flex items-center gap-1.5 text-[10px] text-neutral-500 bg-[#F5F5F7] px-2.5 py-0.5 rounded-full">
                        <span
                          className="w-2 h-2 rounded-full inline-block border border-black/10 shrink-0"
                          style={{ backgroundColor: item.color?.hex || '#333' }}
                        />
                        {item.color?.name?.split(' ')[0]}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-4">
                    {/* Stepper */}
                    <div className="flex items-center gap-1 bg-[#F5F5F7] rounded-full p-0.5">
                      <button
                        onClick={() => updateQuantity(item.key, -1)}
                        className="w-7 h-7 flex items-center justify-center rounded-full bg-white text-neutral-700 shadow-2xs hover:text-black transition-colors cursor-pointer"
                        aria-label="Decrease quantity"
                      >
                        <FiMinus className="text-xs" />
                      </button>

                      <span className="text-xs font-medium text-neutral-900 w-6 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.key, 1)}
                        className="w-7 h-7 flex items-center justify-center rounded-full bg-white text-neutral-700 shadow-2xs hover:text-black transition-colors cursor-pointer"
                        aria-label="Increase quantity"
                      >
                        <FiPlus className="text-xs" />
                      </button>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className="text-sm sm:text-base font-semibold text-neutral-900">
                        {currencyFormatter.format(item.price * item.quantity)}
                      </span>
                      <button
                        onClick={() => removeFromCart(item.key)}
                        aria-label={`Remove ${item.title}`}
                        className="text-neutral-400 hover:text-red-500 transition-colors cursor-pointer p-1"
                      >
                        <FiTrash2 className="text-sm" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Trust highlights */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="bg-white rounded-2xl p-4 flex items-center gap-3 border border-black/[0.04]">
                <FaTruck className="text-neutral-400 text-lg shrink-0" />
                <div>
                  <p className="text-[11px] font-semibold text-neutral-800">Free Shipping</p>
                  <p className="text-[10px] text-neutral-400 font-light">On orders over $100</p>
                </div>
              </div>
              <div className="bg-white rounded-2xl p-4 flex items-center gap-3 border border-black/[0.04]">
                <FaUndoAlt className="text-neutral-400 text-lg shrink-0" />
                <div>
                  <p className="text-[11px] font-semibold text-neutral-800">Easy Returns</p>
                  <p className="text-[10px] text-neutral-400 font-light">30-day trial guarantee</p>
                </div>
              </div>
            </div>
          </div>

          {/* ORDER SUMMARY */}
          <div className="lg:col-span-5 space-y-4">

            {/* PROMO */}
            <div className="bg-white rounded-3xl p-6 border border-neutral-200/80 shadow-sm space-y-3">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-neutral-700 flex items-center gap-2">
                <FiTag /> Promotion Code
              </h2>
              {appliedPromo ? (
                <div className="flex items-center justify-between bg-neutral-100 rounded-2xl px-4 py-3">
                  <span className="text-xs font-medium text-neutral-900">{promoSuccess}</span>
                  <button
                    onClick={removePromo}
                    className="text-[10px] font-semibold text-neutral-500 hover:text-red-500 transition-colors cursor-pointer uppercase"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handlePromo()}
                    placeholder="Enter code (e.g. SAVE20)"
                    aria-label="Promotion code"
                    className="flex-1 text-xs font-medium bg-[#F5F5F7] rounded-full px-4 py-3 outline-none focus:ring-2 focus:ring-black/10 placeholder-neutral-400 transition-all"
                  />
                  <button
                    onClick={handlePromo}
                    className="text-xs font-semibold bg-[#000000] text-white px-5 py-3 rounded-full hover:bg-black transition-all cursor-pointer"
                  >
                    Apply
                  </button>
                </div>
              )}
              {promoError && (
                <p className="text-[10px] text-red-500 font-medium">{promoError}</p>
              )}
            </div>

            {/* SUMMARY NUMBERS */}
            <div className="bg-white rounded-3xl p-6 border border-neutral-200/80 shadow-sm space-y-4">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-neutral-700">Order Summary</h2>

              <div className="space-y-3 text-xs sm:text-sm">
                <div className="flex justify-between text-neutral-600">
                  <span>Subtotal ({itemCount} item{itemCount !== 1 ? 's' : ''})</span>
                  <span className="font-medium text-neutral-900">{currencyFormatter.format(subtotal)}</span>
                </div>

                {appliedPromo && (
                  <div className="flex justify-between text-emerald-700 font-medium">
                    <span>Discount</span>
                    <span>-{currencyFormatter.format(discount)}</span>
                  </div>
                )}

                <div className="flex justify-between text-neutral-600">
                  <span>Shipping</span>
                  <span className="font-medium text-neutral-900">
                    {shippingCost === 0 ? <span className="text-emerald-700">Free</span> : currencyFormatter.format(shippingCost)}
                  </span>
                </div>

                <div className="flex justify-between text-neutral-600">
                  <span>Estimated Tax (8%)</span>
                  <span className="font-medium text-neutral-900">{currencyFormatter.format(tax)}</span>
                </div>

                <div className="border-t border-black/[0.06] pt-3 flex justify-between items-baseline">
                  <span className="font-semibold text-neutral-900 text-sm">Total</span>
                  <span className="font-semibold text-neutral-900 text-lg">{currencyFormatter.format(total)}</span>
                </div>
              </div>

              <button
                onClick={openCheckout}
                className="w-full py-4 bg-[#000000] hover:bg-black text-white font-semibold text-xs tracking-wider uppercase rounded-full transition-all shadow-sm hover:shadow cursor-pointer"
              >
                Proceed to Checkout
              </button>
            </div>

          </div>
        </div>

        {/* RECOMMENDATIONS */}
        {recommendations.length > 0 && (
          <div className="pt-12 border-t border-black/[0.06] space-y-6">
            <h2 className="text-lg font-semibold text-neutral-900 tracking-tight">
              You May Also Like
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              {recommendations.map((item) => (
                <Link
                  key={item.id}
                  to={`/productdetails/${item.id}`}
                  className="group block bg-white rounded-3xl p-3 border border-neutral-300 hover:border-neutral-900 shadow-xs hover:shadow-lg transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-black"
                >
                  <div className="bg-[#F5F5F7] rounded-2xl p-5 aspect-square flex items-center justify-center overflow-hidden group-hover:bg-[#ECECEE] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]">
                    <img
                      src={item.thumbnail}
                      alt={item.title}
                      className="max-h-[85%] max-w-[85%] object-contain group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>

                  <div className="pt-3 pb-1 px-1.5 flex flex-col gap-0.5">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400">
                      {item.brand || 'AllShoes'}
                    </span>
                    <div className="flex justify-between items-baseline gap-2">
                      <h3 className="text-xs sm:text-sm font-medium text-neutral-900 truncate group-hover:text-black">
                        {item.title}
                      </h3>
                      <span className="text-xs text-neutral-800 font-semibold shrink-0">
                        {currencyFormatter.format(item.price)}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}

export default Cart
