import { Link } from 'react-router-dom'
import { useCart } from '../CartContext'
import { FiTrash2, FiMinus, FiPlus, FiShoppingBag, FiArrowLeft, FiTag, FiRefreshCw } from 'react-icons/fi'
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
  const [recsError, setRecsError] = useState(false)
  const [retryCount, setRetryCount] = useState(0)

  useEffect(() => {
    const controller = new AbortController()

    const fetchRecommendations = async () => {
      try {
        const res = await fetch('https://dummyjson.com/products/category/mens-shoes', { signal: controller.signal })
        const data = await res.json()
        if (data.products) {
          setRecommendations(data.products.slice(0, 4))
          setRecsError(false)
        } else {
          setRecsError(true)
        }
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error('Failed to fetch recommendations:', error)
          setRecsError(true)
        }
      }
    }

    fetchRecommendations()

    return () => controller.abort()
  }, [retryCount])

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
      setPromoSuccess(`"${code}" applied — ${(PROMO_CODES[code] * 100).toFixed(0)}% off!`)
    } else {
      setPromoError('Invalid promo code. Try ALLSHOES10 or SAVE20.')
      setPromoSuccess('')
    }
  }

  const removePromo = () => {
    setAppliedPromo(null)
    setPromoInput('')
    setPromoSuccess('')
    setPromoError('')
  }

  // EMPTY CART STATE 
  if (cartItems.length === 0) {
    return (
      <div className='min-h-[80vh] bg-[#ECE9E2] font-jakarta flex flex-col items-center justify-center px-4 py-16'>
        <div className='bg-white rounded-3xl p-10 sm:p-14 max-w-md w-full text-center space-y-6 shadow-sm border border-gray-200/70'>
          <div className='flex justify-center'>
            <div className='bg-[#F4F1EA] p-6 rounded-full'>
              <FiShoppingBag className='text-4xl text-gray-400' />
            </div>
          </div>
          <div className='space-y-2'>
            <h2 className='text-2xl font-extrabold text-gray-950 tracking-tight'>Your cart is empty</h2>
            <p className='text-sm text-gray-500 leading-relaxed'>
              Looks like you haven't added anything yet. Explore our collection and find something you'll love.
            </p>
          </div>
          <Link
            to='/all'
            className='inline-block bg-[#212121] text-white font-bold text-xs tracking-wider uppercase px-8 py-4 rounded-full hover:bg-black hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 shadow-sm'
          >
            Shop Now
          </Link>
        </div>
      </div>
    )
  }

  // MAIN CART PAGE 
  return (
    <div className='min-h-screen bg-[#ECE9E2] font-jakarta py-8 px-4 sm:px-8'>
      <div className='max-w-6xl mx-auto space-y-6'>

        {/* HEADER */}
        <div className='flex items-center justify-between'>
          <Link
            to='/all'
            className='inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-gray-700 hover:text-black transition-colors'
          >
            <FiArrowLeft className='text-xs' />
            Continue Shopping
          </Link>
          <h1 className='text-lg sm:text-[1rem] font-extrabold flex gap-2 text-gray-950 tracking-tight uppercase'>
            Cart <span className='text-gray-400 font-bold'>({itemCount})</span>
          </h1>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-12 gap-6 items-start'>

          {/* CART ITEMS */}
          <div className='lg:col-span-7 space-y-4'>

            {/* Clear all */}
            <div className='flex justify-end'>
              <button
                onClick={clearCart}
                className='text-[11px] font-semibold uppercase tracking-wider text-gray-400 hover:text-red-500 transition-colors cursor-pointer'
              >
                Clear all
              </button>
            </div>

            {cartItems.map((item) => (
              <div
                key={item.key}
                className='bg-white rounded-3xl p-4 sm:p-6 flex gap-4 sm:gap-6 shadow-sm border border-gray-200/70 transition-all duration-200 hover:shadow-md'
              >
                {/* THUMBNAIL */}
                <Link to={`/productdetails/${item.id}`} className='flex-shrink-0'>
                  <div className='w-24 h-24 sm:w-28 sm:h-28 bg-[#F4F1EA] rounded-2xl flex items-center justify-center overflow-hidden'>
                    <img
                      src={item.thumbnail}
                      alt={item.title}
                      className='w-full h-full object-contain p-2 hover:scale-105 transition-transform duration-300'
                    />
                  </div>
                </Link>

                {/* DETAILS */}
                <div className='flex flex-col justify-between flex-1 gap-3 min-w-0'>
                  <div className='space-y-2'>
                    <p className='text-[10px] font-bold uppercase tracking-widest text-gray-400'>
                      {item.brand}
                    </p>
                    <Link
                      to={`/productdetails/${item.id}`}
                      className='text-sm sm:text-base font-bold text-gray-950 tracking-tight line-clamp-2 hover:underline'
                    >
                      {item.title}
                    </Link>
                    <div className='flex flex-wrap gap-2 pt-1'>
                      <span className='text-[10px] font-semibold uppercase tracking-wider text-gray-500 bg-[#F4F1EA] px-2.5 py-0.5 rounded-full'>
                        Size {item.size}
                      </span>
                      <span className='flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-gray-500 bg-[#F4F1EA] px-2.5 py-0.5 rounded-full'>
                        <span
                          className='w-2.5 h-2.5 rounded-full inline-block border border-gray-300 flex-shrink-0'
                          style={{ backgroundColor: item.color?.hex || '#333' }}
                        />
                        {item.color?.name?.split(' ')[0]}
                      </span>
                    </div>
                  </div>

                  <div className='flex items-center justify-between mt-3'>

                    {/* QTY STEPPER */}
                    <div className='flex items-center gap-1 sm:gap-3 bg-[#F4F1EA] rounded-full px-1 py-1'>
                      <button
                        onClick={() => updateQuantity(item.key, -1)}
                        className='w-7 h-7 flex items-center justify-center rounded-full bg-white shadow-xs hover:bg-[#212121] hover:text-white transition-all duration-150 cursor-pointer'
                        aria-label='Decrease quantity'
                      >
                        <FiMinus className='text-xs' />
                      </button>

                      <span className='text-sm font-bold text-gray-950 w-5 text-center'>
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.key, 1)}
                        className='w-7 h-7 flex items-center justify-center rounded-full bg-white shadow-xs hover:bg-[#212121] hover:text-white transition-all duration-150 cursor-pointer'
                        aria-label='Increase quantity'
                      >
                        <FiPlus className='text-xs' />
                      </button>
                    </div>

                    <div className='flex items-center gap-4'>
                      <span className='text-base font-extrabold text-gray-950'>
                        {currencyFormatter.format(item.price * item.quantity)}
                      </span>
                      <button
                        onClick={() => removeFromCart(item.key)}
                        aria-label='Remove item'
                        className='text-gray-300 hover:text-red-500 transition-colors cursor-pointer p-1.5 rounded-full hover:bg-red-50'
                      >
                        <FiTrash2 className='text-sm' />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* TRUST BADGES */}
            <div className='grid grid-cols-2 gap-3 pt-2'>
              <div className='bg-white rounded-2xl p-4 flex items-center gap-3 shadow-xs border border-gray-200/60'>
                <FaTruck className='text-gray-400 text-xl flex-shrink-0' />
                <div>
                  <p className='text-[11px] font-bold text-gray-900 uppercase tracking-wide'>Free Shipping</p>
                  <p className='text-[10px] text-gray-500'>On orders over $100</p>
                </div>
              </div>
              <div className='bg-white rounded-2xl p-4 flex items-center gap-3 shadow-xs border border-gray-200/60'>
                <FaUndoAlt className='text-gray-400 text-xl flex-shrink-0' />
                <div>
                  <p className='text-[11px] font-bold text-gray-900 uppercase tracking-wide'>Easy Returns</p>
                  <p className='text-[10px] text-gray-500'>30-day hassle-free returns</p>
                </div>
              </div>
            </div>
          </div>

          {/* ORDER SUMMARY */}
          <div className='lg:col-span-5 space-y-4'>

            {/* PROMO CODE */}
            <div className='bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-gray-200/70 space-y-3'>
              <h3 className='text-xs font-bold uppercase tracking-widest text-gray-900 flex items-center gap-2'>
                <FiTag /> Promo Code
              </h3>
              {appliedPromo ? (
                <div className='flex items-center justify-between bg-green-50 border border-green-200 rounded-2xl px-4 py-3'>
                  <span className='text-xs font-bold text-green-800'>{promoSuccess}</span>
                  <button
                    onClick={removePromo}
                    className='text-[10px] font-bold text-green-700 hover:text-red-500 transition-colors cursor-pointer uppercase tracking-wide'
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <div className='flex gap-2'>
                  <input
                    type='text'
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handlePromo()}
                    placeholder='Enter promo code'
                    className='flex-1 text-xs font-semibold bg-[#F4F1EA] border border-transparent focus:border-gray-400 rounded-full px-4 py-3 outline-none placeholder-gray-400 transition-colors'
                  />
                  <button
                    onClick={handlePromo}
                    className='text-xs font-bold uppercase tracking-wider bg-[#212121] text-white px-5 py-3 rounded-full hover:bg-black transition-all cursor-pointer'
                  >
                    Apply
                  </button>
                </div>
              )}
              {promoError && (
                <p className='text-[10px] text-red-500 font-semibold'>{promoError}</p>
              )}
            </div>

            {/* SUMMARY */}
            <div className='bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-gray-200/70 space-y-4'>
              <h3 className='text-xs font-bold uppercase tracking-widest text-gray-900'>Order Summary</h3>

              <div className='space-y-3 text-sm'>
                <div className='flex justify-between text-gray-700'>
                  <span>Subtotal ({itemCount} item{itemCount !== 1 ? 's' : ''})</span>
                  <span className='font-bold'>{currencyFormatter.format(subtotal)}</span>
                </div>

                {appliedPromo && (
                  <div className='flex justify-between text-green-600'>
                    <span className='font-semibold'>Discount ({(PROMO_CODES[appliedPromo] * 100).toFixed(0)}%)</span>
                    <span className='font-bold'>-{currencyFormatter.format(discount)}</span>
                  </div>
                )}

                <div className='flex justify-between text-gray-700'>
                  <span>Shipping</span>
                  <span className='font-bold'>
                    {shippingCost === 0
                      ? <span className='text-green-600'>FREE</span>
                      : currencyFormatter.format(shippingCost)
                    }
                  </span>
                </div>

                {shippingCost > 0 && (
                  <div className='bg-[#F4F1EA] rounded-2xl px-4 py-2.5'>
                    <p className='text-[10px] text-gray-600 font-semibold'>
                      Add <span className='font-extrabold text-gray-900'>{currencyFormatter.format(shippingThreshold - subtotal)}</span> more to unlock free shipping!
                    </p>
                    <div className='mt-2 h-1.5 bg-gray-200 rounded-full overflow-hidden'>
                      <div
                        className='h-full bg-[#212121] rounded-full transition-all duration-500'
                        style={{ width: `${Math.min((subtotal / shippingThreshold) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                )}

                <div className='flex justify-between text-gray-700'>
                  <span>Est. Tax (8%)</span>
                  <span className='font-bold'>{currencyFormatter.format(tax)}</span>
                </div>

                <div className='border-t border-gray-100 pt-3 flex justify-between items-center'>
                  <span className='font-extrabold text-gray-950 text-base uppercase tracking-tight'>Total</span>
                  <span className='font-extrabold text-gray-950 text-xl'>{currencyFormatter.format(total)}</span>
                </div>
              </div>

              {/* CHECKOUT BUTTON */}
              <button
                onClick={openCheckout}
                className='w-full py-4 bg-[#212121] text-white font-bold text-xs sm:text-sm tracking-wider uppercase rounded-full hover:bg-black hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 shadow-sm cursor-pointer'
              >
                Proceed to Checkout
              </button>

              <p className='text-center text-[10px] text-gray-400 font-semibold tracking-wide'>
                Gift wrapping available at checkout
              </p>
            </div>

          </div>
        </div>

        {/* RECOMMENDATIONS */}
        {recsError && (
          <div className='pt-12 border-t border-gray-300/60 flex flex-col items-center gap-3 py-6'>
            <p className='text-sm font-semibold text-gray-500'>
              Couldn't load recommendations. Check your connection and try again.
            </p>
            <button
              onClick={() => setRetryCount((count) => count + 1)}
              className='flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-700 bg-[#F4F1EA] px-4 py-2 rounded-full hover:bg-black hover:text-white transition-colors'
            >
              <FiRefreshCw /> Retry
            </button>
          </div>
        )}

        {recommendations.length > 0 && (
          <div className='pt-12 border-t border-gray-300/60 space-y-6'>
            <div className='flex items-center justify-between'>
              <h2 className='text-[14px] sm:text-[1.1rem] font-extrabold text-gray-950 uppercase tracking-wide'>
                You May Also Like
              </h2>
              <Link to='/all' className='text-xs font-bold uppercase tracking-wider text-gray-600 hover:text-black underline'>
                View All Shoes →
              </Link>
            </div>

            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4'>
              {recommendations.map((item) => (
                <Link
                  key={item.id}
                  to={`/productdetails/${item.id}`}
                  className='bg-white rounded-3xl p-4 border border-gray-200/70 hover:shadow-lg transition-all duration-300 flex flex-col justify-between group'
                >
                  <div className='bg-[#F4F1EA] rounded-2xl p-4 flex items-center justify-center min-h-[160px] mb-3 overflow-hidden'>
                    <img
                      src={item.thumbnail}
                      alt={item.title}
                      className='max-h-32 object-contain group-hover:scale-105 transition-transform duration-300'
                    />
                  </div>

                  <div className='space-y-1.5'>
                    <p className='text-[10px] font-bold text-gray-400 uppercase tracking-widest'>
                      {item.brand || 'AllShoes'}
                    </p>
                    <h3 className='text-xs font-bold text-gray-950 line-clamp-1 group-hover:underline'>
                      {item.title}
                    </h3>
                    <div className='flex justify-between items-center pt-1'>
                      <span className='text-sm font-extrabold text-gray-950'>
                        {currencyFormatter.format(item.price)}
                      </span>
                      <span className='text-[10px] font-bold uppercase tracking-wider text-gray-700 bg-[#F4F1EA] px-2.5 py-1 rounded-full group-hover:bg-black group-hover:text-white transition-colors'>
                        View Details
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