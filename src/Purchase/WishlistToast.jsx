import { useEffect } from 'react'
import { useCart } from '../CartContext'
import { Link } from 'react-router-dom'
import { FaHeart } from 'react-icons/fa'
import { FiX, FiHeart, FiRotateCcw } from 'react-icons/fi'

function WishlistToast() {
  const { wishlistToast, dismissWishlistToast, undoWishlistRemove } = useCart()
  const { visible, message, item, action } = wishlistToast

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
    <div className='fixed bottom-6 left-6 z-50 animate-bounce-short font-jakarta max-w-sm w-full px-4'>
      <div role='status' aria-live='polite' className='bg-[#212121] text-white p-4 rounded-2xl shadow-xl flex items-center justify-between gap-4 border border-gray-700'>
        <div className='flex items-center gap-3 min-w-0 flex-1'>
          <div className={`p-2 rounded-full flex-shrink-0 ${action === 'added' ? 'bg-red-500/20 text-red-500' : 'bg-gray-700 text-gray-300'}`}>
            {action === 'added' ? <FaHeart className='text-sm text-red-500' /> : <FiHeart className='text-sm' />}
          </div>

          <div className='min-w-0 flex-1'>
            <p className='text-xs font-bold text-white tracking-wide truncate'>
              {action === 'added' ? 'Saved for Later' : 'Removed from Saved'}
            </p>
            <p className='text-[11px] text-gray-300 truncate'>{item.title}</p>
          </div>
        </div>

        <div className='flex items-center gap-2 flex-shrink-0'>
          {action === 'added' ? (
            <Link
              to='/saved'
              onClick={dismissWishlistToast}
              className='text-xs font-bold text-red-400 hover:text-red-300 underline tracking-wide'
            >
              View Saved →
            </Link>
          ) : (
            <button
              onClick={undoWishlistRemove}
              className='bg-white text-black font-bold text-xs px-3 py-1.5 rounded-full hover:bg-gray-200 transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs'
            >
              <FiRotateCcw className='text-xs' />
              Undo
            </button>
          )}
          <button
            onClick={dismissWishlistToast}
            className='text-gray-300 hover:text-white p-1 transition-colors cursor-pointer'
            aria-label='Dismiss'
          >
            <FiX className='text-base' />
          </button>
        </div>
      </div>
    </div>
  )
}

export default WishlistToast
