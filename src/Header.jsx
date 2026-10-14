import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { RiSearchLine } from "react-icons/ri";
import { AiOutlineShopping } from "react-icons/ai";
import { CiMenuBurger } from "react-icons/ci";
import { RxHamburgerMenu } from "react-icons/rx";
import { CiCircleRemove } from "react-icons/ci";
import { CgProfile } from "react-icons/cg";
import { FiHeart } from "react-icons/fi";
import { useCart } from './CartContext'

const NAV_LINKS = [
  { to: '/', label: 'HOME' },
  { to: '/all', label: 'Shop All' },
  { to: '/men', label: 'Men' },
  { to: '/women', label: 'Women' },
]

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { itemCount, openDrawer, wishlistItems, user } = useCart()
  const savedCount = wishlistItems ? wishlistItems.length : 0
  const location = useLocation()
  const activeClass = (to) =>
    location.pathname === to
      ? 'text-white font-bold'
      : 'hover:text-[#cbcbcb] duration-75'

  
  const onShopAllPage = location.pathname === '/all'

  return (
    <>
        {/* DESKTOP HEADER */}
        <header className=' hidden md:flex sticky top-0 h-16 w-[100%] px-10 bg-[#212121] z-20 text-white justify-between uppercase items-center gap-15 font-jakarta'>
            <div className=' flex gap-1 justify-center items-center'>
              <CiMenuBurger className='text-xl hidden' /> 
              <span className='text-lg font-jakarta'>AllShoes</span>
            </div>

            <div className=' flex gap-10 text-sm sm:text-[0.8rem]'>
                {NAV_LINKS.map(({ to, label }) => (
                  <Link key={to} to={to} className={`${activeClass(to)}`}>{label}</Link>
                ))}
            </div>

            <div className=' flex gap-3 lg:gap-5 items-center'>
                <Link to="/all" state={{ focusSearch: true }} replace={onShopAllPage} className=' text-lg lg:text-[1.1rem] font-bold' aria-label='search button'><RiSearchLine/></Link>
                
                {/* CART */}
                <button
                  onClick={openDrawer}
                  className='relative text-lg lg:text-[1.1rem] font-bold cursor-pointer hover:text-gray-300 transition-colors'
                  aria-label='shopping cart'
                >
                  <AiOutlineShopping />
                  {itemCount > 0 && (
                    <span className='absolute -top-2 -right-2 bg-red-500 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center leading-none'>
                      {itemCount > 9 ? '9+' : itemCount}
                    </span>
                  )}
                </button>
                
                 {/* SAVED ITEMS / WISHLIST */}
                <Link to="/saved" className='relative text-lg lg:text-[1.1rem] font-bold hover:text-gray-300 transition-colors' aria-label='saved items'>
                  <FiHeart />
                  {savedCount > 0 && (
                    <span className='absolute -top-2 -right-2 bg-red-500 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center leading-none'>
                      {savedCount > 9 ? '9+' : savedCount}
                    </span>
                  )}
                </Link>
                <Link
                  to="/signup"
                  className={`relative text-lg lg:text-[1.1rem] font-bold ${location.pathname === '/signup' ? 'text-white font-bold' : 'hover:text-gray-300 transition-colors'}`}
                  aria-label='profile'
                  title={user ? `Signed in as ${user.fullName || user.email}` : 'Sign Up / Profile'}
                >
                  <CgProfile />
                  {user && (
                    <span className='absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-[#212121]' />
                  )}
                </Link>
            </div>
        </header>

        {/* MOBILE HEADER*/}
        <header className=' md:hidden sticky top-0  h-[7dvh] z-30 w-full bg-[#212121] text-white flex justify-between px-4 items-center font-jakarta uppercase'>

           <div className=' flex justify-center items-center gap-4'>
             <button onClick={() => setIsMenuOpen(true)} className=' text-xl' aria-label='menu button'>
              <RxHamburgerMenu />
            </button>

             <Link
               to="/signup"
               className='relative text-xl font-bold'
               aria-label='profile'
               title={user ? `Signed in as ${user.fullName || user.email}` : 'Sign Up / Profile'}
             >
               <CgProfile />
               {user && (
                 <span className='absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-[#212121]' />
               )}
             </Link>

           </div>

            <span className='text-base font-bold font-jakarta'>AllShoes</span>

            <div className=' flex gap-4 items-center'>
                <Link to="/all" state={{ focusSearch: true }} replace={onShopAllPage} className=' text-lg font-bold' aria-label='search button'><RiSearchLine /></Link>
                <Link to="/saved" className={`relative text-lg font-bold ${location.pathname === '/saved' ? 'text-white font-bold' : ''}`} aria-label='saved items'>
                  <FiHeart />
                  {savedCount > 0 && (
                    <span className='absolute -top-2 -right-2 bg-red-500 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center leading-none'>
                      {savedCount > 9 ? '9+' : savedCount}
                    </span>
                  )}
                </Link>
                <button
                  onClick={openDrawer}
                  className='relative text-lg font-bold cursor-pointer'
                  aria-label='shopping cart'
                >
                  <AiOutlineShopping />
                  {itemCount > 0 && (
                    <span className='absolute -top-2 -right-2 bg-red-500 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center leading-none'>
                      {itemCount > 9 ? '9+' : itemCount}
                    </span>
                  )}
                </button>
            </div>
        </header>

        {/* MOBILE MENU OVERLAY*/}
        {isMenuOpen && (
          <div 
            className=' fixed inset-0 bg-black/50 z-40 md:hidden'
            onClick={() => setIsMenuOpen(false)}
          />
        )}

        {/* MOBILE MENU */}
        <div className={`
          fixed top-0 left-0 h-full w-65 bg-[#212121] z-50 md:hidden
          transform transition-transform duration-300 ease-in-out
          ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
          <div className=' flex justify-end items-center p-4 border-b border-gray-600'>

            <button 
              onClick={() => setIsMenuOpen(false)}
              className=' text-2xl text-white hover:text-gray-300'
            >
              <CiCircleRemove className='text-2xl' />
            </button>

            
          </div>

          <nav className=' flex flex-col p-6 gap-6 uppercase text-white font-jakarta'>
            {NAV_LINKS.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className={` text-lg ${activeClass(to)} transition-colors`}
                onClick={() => setIsMenuOpen(false)}
              >
                {label}
              </Link>
            ))}
            <Link
              to="/saved"
              className={`text-lg flex items-center justify-between ${location.pathname === '/saved' ? 'text-white font-bold' : 'hover:text-gray-300 transition-colors'}`}
              onClick={() => setIsMenuOpen(false)}
            >
              <span>Saved Items</span>
              {savedCount > 0 && (
                <span className='bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full'>
                  {savedCount}
                </span>
              )}
            </Link>
          </nav>
        </div>
    </>
  )
}

export default Header
