import { Link } from 'react-router-dom'
import { useCart } from '../CartContext'
import { FiX, FiLock, FiShoppingBag, FiHeart, FiArrowRight, FiUserCheck } from 'react-icons/fi'

function AuthPromptModal() {
  const { authPrompt, closeAuthPrompt } = useCart()

  if (!authPrompt.isOpen) return null

  const isCart = authPrompt.action === 'cart'

  return (
    <div className='fixed inset-0 z-50 overflow-y-auto font-jakarta flex items-center justify-center p-4 sm:p-6'>
      {/* BACKDROP */}
      <div
        className='fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity'
        onClick={closeAuthPrompt}
      />

      {/* MODAL CARD */}
      <div className='relative bg-[#ECE9E2] rounded-3xl max-w-md w-full shadow-2xl overflow-hidden border border-gray-300 z-10 p-6 sm:p-8 space-y-6 animate-in fade-in zoom-in-95 duration-200'>

        {/* CLOSE BUTTON */}
        <button
          onClick={closeAuthPrompt}
          className='absolute top-5 right-5 text-gray-500 hover:text-black p-2 rounded-full hover:bg-black/5 transition-colors cursor-pointer'
          aria-label='Close modal'
        >
          <FiX className='text-xl' />
        </button>

        {/* HEADER ICON & TITLE */}
        <div className='text-center space-y-3 pt-2'>
          <div className='w-14 h-14 bg-[#212121] text-white rounded-2xl flex items-center justify-center mx-auto text-2xl shadow-md'>
            {isCart ? <FiShoppingBag /> : <FiHeart className='text-white' />}
          </div>
          <div>
          
            <h2 className='text-xl sm:text-2xl font-black text-gray-950 uppercase tracking-tight'>
              {isCart ? 'Sign In to Add to Cart' : 'Sign In to Save Items'}
            </h2>
          </div>
          <p className='text-xs text-gray-600 leading-relaxed px-2'>
            {isCart
              ? 'Please sign in or create an account to tie your shopping cart and express checkout to your profile.'
              : 'Please sign in or create an account to save your favorite styles to your personal wishlist.'}
          </p>

        
        </div>

        {/* ACTIONS */}
        <div className='space-y-3 pt-2'>
          <Link
            to='/signup?tab=signin'
            onClick={closeAuthPrompt}
            className='w-full bg-[#212121] text-white hover:bg-black font-extrabold text-xs uppercase tracking-wider py-3.5 rounded-full transition-all flex items-center justify-center gap-2 shadow-sm hover:scale-[1.01] active:scale-[0.99]'
          >
            <FiUserCheck className='text-sm' />
            <span>Sign In to Existing Account</span>
          </Link>

          <Link
            to='/signup?tab=signup'
            onClick={closeAuthPrompt}
            className='w-full bg-white text-gray-900 hover:bg-gray-100 font-extrabold text-xs uppercase tracking-wider py-3.5 rounded-full transition-all flex items-center justify-center gap-2 border border-gray-300 shadow-2xs hover:scale-[1.01] active:scale-[0.99]'
          >
            <span>Create New Account</span>
            <FiArrowRight />
          </Link>

          <button
            onClick={closeAuthPrompt}
            className='w-full text-center text-xs font-bold text-gray-500 hover:text-black py-2 transition-colors cursor-pointer'
          >
            Continue Browsing Guest
          </button>
        </div>
      </div>
    </div>
  )
}

export default AuthPromptModal
