import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../CartContext'
import { FiTrash2, FiMinus, FiPlus, FiShoppingBag, FiArrowRight } from 'react-icons/fi'
import { RxCross2 } from 'react-icons/rx'

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

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isDrawerOpen) {
        closeDrawer()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isDrawerOpen, closeDrawer])

  if (!isDrawerOpen) return null

  const shippingThreshold = 100
  const progressPercent = Math.min((subtotal / shippingThreshold) * 100, 100)

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Shopping cart"
      className="fixed inset-0 z-50 overflow-hidden font-jakarta"
    >
      {/* BACKDROP */}
      <div
        className="fixed inset-0 bg-black/30 backdrop-blur-xs transition-opacity duration-300"
        onClick={closeDrawer}
        aria-hidden="true"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col border-l border-black/[0.06]">
          
          {/* DRAWER HEADER */}
          <div className="p-5 border-b border-black/[0.06] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-base font-semibold tracking-tight text-neutral-900">Shopping Cart</h2>
              <span className="bg-neutral-100 text-neutral-600 text-xs font-medium px-2.5 py-0.5 rounded-full">
                {itemCount}
              </span>
            </div>
            <button
              onClick={closeDrawer}
              className="p-1.5 text-neutral-400 hover:text-black rounded-full hover:bg-neutral-100 transition-colors cursor-pointer"
              aria-label="Close cart drawer"
            >
              <RxCross2 className="text-lg" />
            </button>
          </div>

          {/* FREE SHIPPING PROGRESS */}
          {cartItems.length > 0 && (
            <div className="bg-[#FBFBFD] px-6 py-3.5 border-b border-black/[0.04]">
              <p className="text-[11px] font-medium text-neutral-600 text-center mb-1.5">
                {subtotal >= shippingThreshold ? (
                  <span className="text-emerald-700 font-medium">You've unlocked Free Standard Shipping</span>
                ) : (
                  <>
                    Add <span className="font-semibold text-neutral-900">{currencyFormatter.format(shippingThreshold - subtotal)}</span> more for Free Shipping
                  </>
                )}
              </p>
              <div className="h-1.5 bg-neutral-200/70 rounded-full overflow-hidden">
                <div
                  className="h-full bg-neutral-900 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          )}

          {/* DRAWER BODY */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cartItems.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-16">
                <div className="w-14 h-14 bg-neutral-100 rounded-full flex items-center justify-center text-neutral-400">
                  <FiShoppingBag className="text-2xl" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-semibold text-neutral-900">Your cart is empty</h3>
                  <p className="text-xs text-neutral-500 max-w-xs font-light">
                    Items added to your cart will appear here for checkout.
                  </p>
                </div>
                <Link
                  to="/all"
                  onClick={closeDrawer}
                  className="bg-[#000000] hover:bg-black text-white text-xs font-medium tracking-wide px-7 py-3 rounded-full transition-colors shadow-xs"
                >
                  Explore Collection
                </Link>
              </div>
            ) : (
              cartItems.map((item) => {
                const isMaxStock = item.quantity >= (item.stock ?? 99)
                return (
                  <div
                    key={item.key}
                    className="flex gap-4 p-3 rounded-2xl bg-white border border-neutral-200/80 shadow-xs"
                  >
                    {/* Thumbnail */}
                    <div className="w-20 h-20 bg-[#F5F5F7] rounded-2xl flex items-center justify-center shrink-0 overflow-hidden">
                      <img
                        src={item.thumbnail}
                        alt={item.title}
                        className="max-h-[82%] max-w-[82%] object-contain"
                      />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="text-xs font-medium text-neutral-900 truncate">{item.title}</h3>
                          <button
                            onClick={() => removeFromCart(item.key)}
                            className="text-neutral-400 hover:text-red-500 transition-colors p-1 cursor-pointer"
                            aria-label={`Remove ${item.title}`}
                          >
                            <FiTrash2 className="text-xs" />
                          </button>
                        </div>

                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] text-neutral-500 bg-neutral-100 px-2 py-0.5 rounded-md">
                            Size {item.size}
                          </span>
                          <span className="text-[10px] text-neutral-500 bg-neutral-100 px-2 py-0.5 rounded-md flex items-center gap-1">
                            <span
                              className="w-2 h-2 rounded-full border border-black/10"
                              style={{ backgroundColor: item.color?.hex || '#333' }}
                            />
                            {item.color?.name?.split(' ')[0]}
                          </span>
                        </div>
                      </div>

                      {/* Price & Stepper */}
                      <div className="flex items-center justify-between mt-3">
                        <span className="text-xs sm:text-sm font-semibold text-neutral-900">
                          {currencyFormatter.format(item.price * item.quantity)}
                        </span>

                        <div className="flex items-center gap-1.5 bg-[#F5F5F7] rounded-full p-0.5">
                          <button
                            onClick={() => updateQuantity(item.key, -1)}
                            className="w-6 h-6 flex items-center justify-center rounded-full bg-white text-neutral-700 hover:text-black transition-colors cursor-pointer text-xs shadow-2xs"
                            aria-label="Decrease quantity"
                          >
                            <FiMinus />
                          </button>
                          <span className="text-xs font-medium w-5 text-center text-neutral-900">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.key, 1)}
                            disabled={isMaxStock}
                            className={`w-6 h-6 flex items-center justify-center rounded-full text-xs shadow-2xs ${
                              isMaxStock
                                ? 'bg-neutral-100 text-neutral-300 cursor-not-allowed'
                                : 'bg-white text-neutral-700 hover:text-black cursor-pointer'
                            }`}
                            aria-label="Increase quantity"
                          >
                            <FiPlus />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })
            )}
          </div>

          {/* DRAWER FOOTER */}
          {cartItems.length > 0 && (
            <div className="p-6 bg-[#FBFBFD] border-t border-black/[0.06] space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-neutral-500 font-normal">Subtotal</span>
                <span className="text-base font-semibold text-neutral-900">
                  {currencyFormatter.format(subtotal)}
                </span>
              </div>
              <p className="text-[11px] text-neutral-400 font-light text-center">
                Shipping and taxes calculated at checkout.
              </p>

              <div className="space-y-2.5">
                <button
                  onClick={openCheckout}
                  className="w-full py-3.5 bg-[#000000] hover:bg-black text-white text-xs font-semibold tracking-wider uppercase rounded-full transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm hover:shadow"
                >
                  Checkout <FiArrowRight />
                </button>
                <Link
                  to="/cart"
                  onClick={closeDrawer}
                  className="w-full py-3 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-medium tracking-wide rounded-full transition-colors flex items-center justify-center cursor-pointer block text-center"
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
