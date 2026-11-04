import { useEffect } from 'react'
import { useCart } from '../CartContext'
import { Link } from 'react-router-dom'
import { FaHeart } from 'react-icons/fa'
import { FiX, FiHeart, FiRotateCcw } from 'react-icons/fi'

function WishlistToast() {
  const { wishlistToast, dismissWishlistToast, undoWishlistRemove } = useCart()
  const { visible, item, action } = wishlistToast

  useEffect(() => {
    if (visible) {
      const timer = setTimeout(() => {
        dismissWishlistToast()
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [visible, dismissWishlistToast])

  if (!visible || !item) return null

  return (
    <div className="fixed bottom-6 left-6 z-50 font-jakarta max-w-sm w-full px-4">
      <div
        role="status"
        aria-live="polite"
        className="bg-neutral-900/95 backdrop-blur-xl text-white p-4 rounded-2xl shadow-2xl flex items-center justify-between gap-4 border border-white/10"
      >
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div className={`p-2 rounded-full shrink-0 ${action === 'added' ? 'bg-red-500/20 text-red-400' : 'bg-neutral-800 text-neutral-400'}`}>
            {action === 'added' ? <FaHeart className="text-xs text-red-400" /> : <FiHeart className="text-xs" />}
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium text-white truncate">
              {action === 'added' ? 'Saved to Wishlist' : 'Removed from Saved'}
            </p>
            <p className="text-[11px] text-neutral-400 truncate font-light">{item.title}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {action === 'added' ? (
            <Link
              to="/saved"
              onClick={dismissWishlistToast}
              className="text-xs font-medium text-white underline hover:text-neutral-300"
            >
              View →
            </Link>
          ) : (
            <button
              onClick={undoWishlistRemove}
              className="bg-white text-black font-medium text-xs px-3 py-1.5 rounded-full hover:bg-neutral-100 transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <FiRotateCcw className="text-xs" />
              Undo
            </button>
          )}
          <button
            onClick={dismissWishlistToast}
            className="text-neutral-400 hover:text-white p-1 transition-colors cursor-pointer"
            aria-label="Dismiss"
          >
            <FiX className="text-base" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default WishlistToast
