import { useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../CartContext'
import { FiShoppingBag, FiHeart, FiArrowRight, FiUserCheck } from 'react-icons/fi'
import { RxCross2 } from 'react-icons/rx'
import useFocusTrap from '../useFocusTrap'

function AuthPromptModal() {
  const { authPrompt, closeAuthPrompt } = useCart()
  const modalRef = useRef(null)
  useFocusTrap(modalRef, authPrompt.isOpen, closeAuthPrompt)

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && authPrompt.isOpen) {
        closeAuthPrompt()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [authPrompt.isOpen, closeAuthPrompt])

  if (!authPrompt.isOpen) return null

  const isCart = authPrompt.action === 'cart'

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto font-jakarta flex items-center justify-center p-4 sm:p-6">
      {/* BACKDROP */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity duration-300"
        onClick={closeAuthPrompt}
        aria-hidden="true"
      />

      {/* MODAL CARD */}
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-prompt-title"
        tabIndex={-1}
        className="relative bg-white rounded-3xl max-w-md w-full shadow-2xl overflow-hidden border border-black/[0.06] z-10 p-6 sm:p-8 space-y-6 animate-in fade-in zoom-in-95 duration-200"
      >
        {/* CLOSE BUTTON */}
        <button
          onClick={closeAuthPrompt}
          className="absolute top-5 right-5 text-neutral-400 hover:text-black p-1.5 rounded-full hover:bg-neutral-100 transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <RxCross2 className="text-lg" />
        </button>

        {/* HEADER ICON & TITLE */}
        <div className="text-center space-y-3 pt-2">
          <div className="w-14 h-14 bg-[#F5F5F7] text-neutral-900 rounded-2xl flex items-center justify-center mx-auto text-xl shadow-2xs">
            {isCart ? <FiShoppingBag /> : <FiHeart />}
          </div>
          <div>
            <h2 id="auth-prompt-title" data-dialog-initial-focus tabIndex={-1} className="text-xl sm:text-2xl font-semibold text-neutral-900 tracking-tight">
              {isCart ? 'Sign In to Add to Cart' : 'Sign In to Save Items'}
            </h2>
          </div>
          <p className="text-xs text-neutral-500 font-light leading-relaxed px-2">
            {isCart
              ? 'Please sign in or create an account to tie your shopping cart and express checkout to your profile.'
              : 'Sign in or register to sync your favorite styles to your personal wishlist across devices.'}
          </p>
        </div>

        {/* ACTIONS */}
        <div className="space-y-2.5 pt-2">
          <Link
            to="/signup?tab=signin"
            onClick={closeAuthPrompt}
            className="w-full bg-[#000000] text-white hover:bg-black text-xs font-semibold tracking-wider uppercase py-3.5 rounded-full transition-all flex items-center justify-center gap-2 shadow-sm"
          >
            <FiUserCheck className="text-sm" />
            <span>Sign In to Existing Account</span>
          </Link>

          <Link
            to="/signup?tab=signup"
            onClick={closeAuthPrompt}
            className="w-full bg-neutral-100 hover:bg-neutral-200 text-neutral-900 text-xs font-semibold tracking-wider uppercase py-3.5 rounded-full transition-all flex items-center justify-center gap-2"
          >
            <span>Create Account</span>
            <FiArrowRight />
          </Link>

          <button
            onClick={closeAuthPrompt}
            className="w-full text-center text-xs font-medium text-neutral-400 hover:text-black py-2 transition-colors cursor-pointer"
          >
            Continue as Guest
          </button>
        </div>
      </div>
    </div>
  )
}

export default AuthPromptModal
