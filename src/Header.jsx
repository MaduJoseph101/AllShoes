import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { RiSearchLine } from "react-icons/ri"
import { AiOutlineShopping } from "react-icons/ai"
import { RxHamburgerMenu, RxCross2 } from "react-icons/rx"
import { CgProfile } from "react-icons/cg"
import { FiHeart } from "react-icons/fi"
import { useCart } from './CartContext'

const NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/all', label: 'Shop All' },
  { to: '/men', label: 'Men' },
  { to: '/women', label: 'Women' },
]

const COUNT_BADGE_CLASS = 'absolute -top-1 -right-1 w-[18px] h-[18px] p-0 rounded-full border-2 border-white bg-black text-white text-[8px] font-semibold leading-none flex items-center justify-center pointer-events-none tabular-nums'

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { itemCount, openDrawer, wishlistItems, user } = useCart()
  const savedCount = wishlistItems ? wishlistItems.length : 0
  const location = useLocation()

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isMenuOpen) {
        setIsMenuOpen(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isMenuOpen])

  // ACTIVE LINK GUIDE
  const isActive = (to) => {
    if (to === '/') return location.pathname === '/'
    return location.pathname.startsWith(to)
  }

  const onShopAllPage = location.pathname === '/all'

  return (
    <>
      {/* DESKTOP HEADER */}
      <header
        aria-label="Desktop navigation"
        className="hidden md:flex sticky top-0 h-16 w-full px-8 lg:px-12 bg-[#FBFBFD]/95 backdrop-blur-xl border-b border-black/10 shadow-sm z-40 text-[#000000] justify-between items-center transition-all duration-300 font-jakarta"
      >
        {/* BRAND */}
        <Link
          to="/"
          className="flex items-center gap-2 group text-base font-semibold tracking-[-0.02em] hover:opacity-75 transition-opacity"
        >
          <span className="font-semibold text-lg text-black">AllShoes</span>
        </Link>

        {/* Navigation links */}
        <nav aria-label="Primary" className="flex items-center gap-8 text-[13px] font-medium">
          {NAV_LINKS.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className={`relative py-1 transition-colors duration-200 ${
                isActive(to)
                  ? 'text-black font-semibold'
                  : 'text-neutral-500 hover:text-black'
              }`}
            >
              {label}
              {isActive(to) && (
                <span className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-black rounded-full" />
              )}
            </Link>
          ))}
        </nav>

        {/* Action icons */}
        <div className="flex items-center text-neutral-700">
          <Link
            to="/all"
            state={{ focusSearch: true }}
            replace={onShopAllPage}
            className="w-9 h-9 flex items-center justify-center hover:text-black transition-colors rounded-full hover:bg-neutral-100/60"
            aria-label="Search catalog"
          >
            <RiSearchLine className="text-[18px]" />
          </Link>

          {/* Cart */}
          <button
            onClick={openDrawer}
            className="relative w-9 h-9 flex items-center justify-center hover:text-black transition-colors cursor-pointer rounded-full hover:bg-neutral-100/60"
            aria-label={`Shopping cart, ${itemCount} items`}
          >
            <AiOutlineShopping className="text-[20px]" />
            {itemCount > 0 && (
              <span className={COUNT_BADGE_CLASS}>
                {itemCount > 9 ? '9+' : itemCount}
              </span>
            )}
          </button>

          {/* Saved items */}
          <Link
            to="/saved"
            className="relative w-9 h-9 flex items-center justify-center hover:text-black transition-colors rounded-full hover:bg-neutral-100/60"
            aria-label={`Saved items, ${savedCount} saved`}
          >
            <FiHeart className="text-[18px]" />
            {savedCount > 0 && (
              <span className={COUNT_BADGE_CLASS}>
                {savedCount > 9 ? '9+' : savedCount}
              </span>
            )}
          </Link>

          {/* Profile */}
          <Link
            to="/signup"
            className={`relative w-9 h-9 flex items-center justify-center rounded-full hover:bg-neutral-100/60 transition-colors ${
              location.pathname === '/signup' ? 'text-black font-semibold' : 'hover:text-black'
            }`}
            aria-label={user ? `Signed in as ${user.fullName || user.email}` : 'Sign In or Profile'}
            title={user ? `Signed in as ${user.fullName || user.email}` : 'Sign Up / Profile'}
          >
            <CgProfile className="text-[19px]" />
            {user && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white" />
            )}
          </Link>
        </div>
      </header>

      {/* MOBILE HEADER */}
      <header
        aria-label="Mobile navigation"
        className="md:hidden sticky top-0 h-14 z-40 w-full bg-[#FBFBFD]/95 backdrop-blur-xl border-b border-black/10 shadow-sm text-[#000000] flex justify-between px-4 items-center font-jakarta"
      >
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsMenuOpen(true)}
            className="p-1.5 text-lg hover:text-black transition-colors"
            aria-label="Open menu"
            aria-expanded={isMenuOpen}
          >
            <RxHamburgerMenu />
          </button>

          <Link
            to="/signup"
            className="relative p-1.5 text-lg text-neutral-700"
            aria-label={user ? `Signed in as ${user.fullName || user.email}` : 'Profile'}
          >
            <CgProfile />
            {user && (
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white" />
            )}
          </Link>
        </div>

        <Link to="/" className="text-base font-semibold tracking-[-0.02em] text-black">
          AllShoes
        </Link>

        <div className="flex items-center gap-1.5 text-neutral-700">
          <Link
            to="/all"
            state={{ focusSearch: true }}
            replace={onShopAllPage}
            className="w-8 h-8 flex items-center justify-center hover:text-black transition-colors"
            aria-label="Search"
          >
            <RiSearchLine className="text-[18px]" />
          </Link>

          <Link
            to="/saved"
            className="relative w-8 h-8 flex items-center justify-center hover:text-black transition-colors"
            aria-label={`Saved items, ${savedCount} saved`}
          >
            <FiHeart className="text-[18px]" />
            {savedCount > 0 && (
              <span className={COUNT_BADGE_CLASS}>
                {savedCount > 9 ? '9+' : savedCount}
              </span>
            )}
          </Link>

          <button
            onClick={openDrawer}
            className="relative w-8 h-8 flex items-center justify-center hover:text-black transition-colors cursor-pointer"
            aria-label={`Shopping cart, ${itemCount} items`}
          >
            <AiOutlineShopping className="text-[20px]" />
            {itemCount > 0 && (
              <span className={COUNT_BADGE_CLASS}>
                {itemCount > 9 ? '9+' : itemCount}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* MOBILE MENU OVERLAY */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-xs z-50 md:hidden transition-opacity duration-300"
          onClick={() => setIsMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* MOBILE MENU PANEL */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Mobile Navigation"
        className={`
          fixed top-0 left-0 h-full w-72 bg-white/95 backdrop-blur-2xl z-50 md:hidden shadow-2xl border-r border-black/[0.06]
          transform transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]
          ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="flex justify-between items-center p-5 border-b border-black/[0.05]">
          <span className="font-semibold text-base tracking-tight text-black">Menu</span>
          <button
            onClick={() => setIsMenuOpen(false)}
            className="p-1.5 text-neutral-500 hover:text-black rounded-full hover:bg-neutral-100 transition-colors"
            aria-label="Close menu"
          >
            <RxCross2 className="text-xl" />
          </button>
        </div>

        <nav aria-label="Mobile primary" className="flex flex-col p-6 gap-5 text-neutral-800 font-jakarta text-sm font-medium">
          {NAV_LINKS.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className={`py-1.5 transition-colors ${
                isActive(to) ? 'text-black font-semibold' : 'text-neutral-600 hover:text-black'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              {label}
            </Link>
          ))}
          <div className="my-2 border-t border-black/[0.06]" />
          <Link
            to="/saved"
            className="flex items-center justify-between py-1.5 text-neutral-600 hover:text-black transition-colors"
            onClick={() => setIsMenuOpen(false)}
          >
            <span>Saved Items</span>
            {savedCount > 0 && (
              <span className="bg-neutral-900 text-white text-[11px] font-semibold px-2 py-0.5 rounded-full">
                {savedCount}
              </span>
            )}
          </Link>
          <Link
            to="/signup"
            className="py-1.5 text-neutral-600 hover:text-black transition-colors"
            onClick={() => setIsMenuOpen(false)}
          >
            {user ? 'My Profile' : 'Sign In / Register'}
          </Link>
        </nav>
      </div>
    </>
  )
}

export default Header
