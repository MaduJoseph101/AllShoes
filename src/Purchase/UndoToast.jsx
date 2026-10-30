import { useEffect } from 'react'
import { useCart } from '../CartContext'
import { FiRotateCcw, FiX } from 'react-icons/fi'

function UndoToast() {
  const { undoToastVisible, lastRemovedItem, undoRemove, dismissUndoToast } = useCart()

  useEffect(() => {
    if (undoToastVisible) {
      const timer = setTimeout(() => {
        dismissUndoToast()
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [undoToastVisible, dismissUndoToast])

  if (!undoToastVisible || !lastRemovedItem) return null

  return (
    <div className='fixed top-20 right-6 z-50 animate-bounce-short font-jakarta max-w-sm w-full px-4'>
      <div role='status' aria-live='polite' className='bg-[#212121] text-white p-4 rounded-2xl shadow-xl flex items-center justify-between gap-4 border border-gray-700'>
        <div className='min-w-0 flex flex-col gap-2'>
          <p className='text-xs font-semibold text-gray-300 uppercase tracking-wider'>Item Removed</p>
          <p className='text-xs font-bold truncate text-white'>{lastRemovedItem.title}</p>
        </div>

        <div className='flex items-center gap-2 flex-shrink-0'>
          <button
            onClick={undoRemove}
            className='bg-white text-black font-bold text-xs px-3.5 py-1.5 rounded-full hover:bg-gray-200 transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs'
          >
            <FiRotateCcw className='text-xs' />
            Undo
          </button>
          <button
            onClick={dismissUndoToast}
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

export default UndoToast
