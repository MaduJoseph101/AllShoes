import { Link } from 'react-router-dom'
import { useCart } from '../CartContext'
import { FiX, FiTrash2, FiMinus, FiPlus, FiShoppingBag, FiArrowRight } from 'react-icons/fi'

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
})

function CartDrawer() {
  const {
    isDrawerOpen,
    closeDrawer,
    cartItems,
    removeFromCart,
    updateQuantity,
    subtotal,
    itemCount,
    openCheckout,
  } = useCart()

  if (!isDrawerOpen) return null

  const shippingThreshold = 100
  const progressPercent = Math.min((subtotal / shippingThreshold) * 100, 100)

  return (
    <div className='fixed inset-0 z-50 overflow-hidden font-jakarta'>
      {/* BACKDROP */}
      <div
        className='fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-fade-in'
        onClick={closeDrawer}
      />

      <div className='fixed inset-y-0 right-0 max-w-full flex pl-12'>
        <div className='w-screen max-w-md bg-[#ECE9E2] shadow-2xl flex flex-col'>
          
          {/* DRAWER HEADER */}
          <div className='p-5 bg-[#212121] text-white flex items-center justify-between shadow-md'>
            <div className='flex items-center gap-2'>
              <h2 className='text-base font-bold uppercase tracking-wider'>Your Cart</h2>
              <span className='bg-white/20 text-white text-xs font-extrabold px-2.5 py-0.5 rounded-full'>
                {itemCount}
              </span>
            </div>
            <button
              onClick={closeDrawer}
              className='text-gray-300 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors cursor-pointer'
              aria-label='Close cart drawer'
            >
              <FiX className='text-xl' />
            </button>
          </div>

          {/* FREE SHIPPING PROGRESS BAR */}
          {cartItems.length > 0 && (
            <div className='bg-white px-6 py-3 border-b border-gray-200/80'>
              <p className='text-[11px] font-semibold text-gray-700 text-center mb-1.5'>
                {subtotal >= shippingThreshold ? (
                  <span className='text-green-600 tracking-wide font-bold'>You've unlocked FREE Shipping!</span>
                ) : (
                  <>
                    Add <span className='font-bold tracking-wide text-gray-900'>{currencyFormatter.format(shippingThreshold - subtotal)}</span> more for <span className='font-bold text-black'>FREE Shipping</span>
                  </>
                )}
              </p>
              <div className='h-2 bg-gray-100 rounded-full overflow-hidden'>
                <div
                  className='h-full bg-black rounded-full transition-all duration-500'
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          )}

          {/* DRAWER BODY / ITEMS LIST */}
          <div className='flex-1 overflow-y-auto p-6 space-y-4'>
            {cartItems.length === 0 ? (
              <div className='h-full flex flex-col items-center justify-center text-center space-y-4 py-12'>
                <div className='bg-white p-6 rounded-full shadow-xs border border-gray-200/60'>
                  <FiShoppingBag className='text-3xl text-gray-400' />
                </div>
                <div className='space-y-1'>
                  <h3 className='text-lg font-bold text-gray-900'>Your cart is empty</h3>
                  <p className='text-xs text-gray-500 max-w-xs'>
                    Looks like you haven't added anything to your cart yet.
                  </p>
                </div>
                <Link
                  to='/all'
                  onClick={closeDrawer}
                  className='bg-[#212121] text-white text-xs font-bold uppercase tracking-wider px-6 py-3 rounded-full hover:bg-black transition-colors shadow-sm'
                >
                  Start Shopping
                </Link>
              </div>
            ) : (
              cartItems.map((item) => {
                const isMaxStock = item.quantity >= (item.stock ?? 99)
                return (
                  <div
                    key={item.key}
                    className='bg-white rounded-2xl p-4 flex gap-4 shadow-xs border border-gray-200/60 relative group'
                  >
                    {/* Thumbnail */}
                    <div className='w-20 h-20 bg-[#F4F1EA] rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden'>
                      <img
                        src={item.thumbnail}
                        alt={item.title}
                        className='w-full h-full object-contain p-1.5'
                      />
                    </div>

                    {/* Info */}
                    <div className='flex-1 min-w-0 flex flex-col justify-between'>
                      <div>
                        <div className='flex items-start justify-between gap-2'>
                          <h4 className='text-xs font-bold text-gray-900 line-clamp-1'>{item.title}</h4>
                          <button
                            onClick={() => removeFromCart(item.key)}
                            className='text-gray-300 hover:text-red-500 transition-colors p-1 cursor-pointer'
                            title='Remove item'
                          >
                            <FiTrash2 className='text-xs' />
                          </button>
                        </div>

                        <div className='flex items-center gap-2 mt-1'>
                          <span className='text-[10px] font-semibold text-gray-500 bg-[#F4F1EA] px-2 py-0.5 rounded-md'>
                            Size {item.size}
                          </span>
                          <span className='text-[10px] font-semibold text-gray-500 bg-[#F4F1EA] px-2 py-0.5 rounded-md flex items-center gap-1'>
                            <span
                              className='w-2 h-2 rounded-full border border-gray-300'
                              style={{ backgroundColor: item.color?.hex || '#333' }}
                            />
                            {item.color?.name?.split(' ')[0]}
                          </span>
                        </div>
                      </div>

                      {/* Price & Stepper */}
                      <div className='flex items-center justify-between mt-3'>
                        <span className='text-sm font-extrabold text-gray-950'>
                          {currencyFormatter.format(item.price * item.quantity)}
                        </span>

                        <div className='flex items-center gap-1 bg-[#F4F1EA] rounded-full p-1'>
                          <button
                            onClick={() => updateQuantity(item.key, -1)}
                            className='w-6 h-6 flex items-center justify-center rounded-full bg-white text-gray-700 hover:bg-black hover:text-white transition-colors cursor-pointer text-xs'
                            aria-label='Decrease quantity'
                          >
                            <FiMinus />
                          </button>
                          <span className='text-xs font-bold w-5 text-center text-gray-900'>
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.key, 1)}
                            disabled={isMaxStock}
                            className={`w-6 h-6 flex items-center justify-center rounded-full transition-colors text-xs ${
                              isMaxStock
                                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                : 'bg-white text-gray-700 hover:bg-black hover:text-white cursor-pointer'
                            }`}
                            aria-label='Increase quantity'
                            title={isMaxStock ? 'Max stock reached' : 'Increase'}
                          >
                            <FiPlus />
                          </button>
                        </div>
                      </div>

                      {/* Stock limit warning if max reached */}
                      {isMaxStock && (
                        <p className='text-[9px] font-bold text-amber-600 mt-1 uppercase tracking-wider'>
                          Max stock reached ({item.stock} available)
                        </p>
                      )}
                    </div>
                  </div>
                )
              })
            )}
          </div>

          {/* DRAWER FOOTER */}
          {cartItems.length > 0 && (
            <div className='p-6 bg-white border-t border-gray-200/80 space-y-4 shadow-lg'>
              <div className='flex items-center justify-between text-sm'>
                <span className='text-gray-600 font-semibold uppercase tracking-wider text-xs'>
                  Subtotal
                </span>
                <span className='text-lg font-extrabold text-gray-950'>
                  {currencyFormatter.format(subtotal)}
                </span>
              </div>
              <p className='text-[10px] text-gray-500 text-center'>
                Shipping, taxes, and discounts calculated at checkout.
              </p>

              <div className='space-y-3'>
                <button
                  onClick={openCheckout}
                  className='w-full py-3.5 bg-[#212121] text-white text-xs font-bold uppercase tracking-wider rounded-full hover:bg-black transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm'
                >
                  Checkout <FiArrowRight />
                </button>
                <Link
                  to='/cart'
                  onClick={closeDrawer}
                  className='w-full py-3 bg-[#F4F1EA] text-gray-900 text-xs font-bold uppercase tracking-wider rounded-full hover:bg-gray-200 transition-colors flex items-center justify-center cursor-pointer block text-center'
                >
                  View Full Cart
                </Link>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}

export default CartDrawer
