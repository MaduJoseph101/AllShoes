import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FaInstagram, FaPinterestP, FaFacebookF, FaXTwitter, FaTiktok, FaYoutube, FaQ } from "react-icons/fa6"
import FAQ from './Props/FAQ'

function Footer() {
  const [email, setEmail] = useState('')
  const navigate = useNavigate()

  const handleSignupSubmit = (e) => {
    e.preventDefault()
    navigate('/signup')
  }

  return (
    <footer className='bg-black font-jakarta min-h-[65vh] text-white py-12 px-6 sm:px-10 font-jakarta border-t border-gray-800'>
      <div className='max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8'>
        
        {/* LEFT SECTION LINKS */}
        <div className='lg:col-span-5 flex flex-col justify-between space-y-10'>
          <div>
            <h3 className='text-xs sm:text-sm font-semibold tracking-wider uppercase mb-4 text-white'>
              SUBSCRIBE TO OUR EMAILS
            </h3>
            <form onSubmit={handleSignupSubmit} className='bg-white rounded-2xl flex items-center px-4 py-3.5 max-w-md w-full shadow-sm'>
              <input
                type='email'
                placeholder='Email Address'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className='bg-transparent outline-none text-black text-xs sm:text-sm flex-1 pr-2 placeholder-gray-500'
              />
              <button 
                type='submit' 
                className='text-black font-bold text-xs sm:text-[12px] uppercase tracking-wider hover:opacity-75 transition-opacity px-2 cursor-pointer'
              >
                SIGN UP
              </button>
            </form>
          </div>

          <div>
            <h3 className='text-xs sm:text-sm  font-semibold tracking-wider uppercase mb-4 text-white'>
              FOLLOW US</h3>
            <div className='flex items-center gap-3 flex-wrap'>
              <Link to="" className='w-9 h-9 sm:w-11 sm:h-11 rounded-full border border-white/80 flex items-center justify-center text-base text-white hover:bg-white hover:text-[#000000] transition-all duration-200' aria-label="Instagram">
                <FaInstagram className='text-[1rem] sm:text-[1.3rem]' />
              </Link>
              <Link to="" className='w-9 h-9 sm:w-11 sm:h-11 rounded-full border border-white/80 flex items-center justify-center text-base text-white hover:bg-white hover:text-[#000000] transition-all duration-200' aria-label="Pinterest">
                <FaPinterestP className='text-[1rem] sm:text-[1.3rem]' />
              </Link>
              <Link to="" className='w-9 h-9 sm:w-11 sm:h-11 rounded-full border border-white/80 flex items-center justify-center text-base text-white hover:bg-white hover:text-[#000000]  transition-all duration-200' aria-label="Facebook">
                <FaFacebookF className='text-[1rem] sm:text-[1.3rem]' />
              </Link>
              <Link to="" className='w-9 h-9 sm:w-11 sm:h-11 rounded-full border border-white/80 flex items-center justify-center text-base text-white hover:bg-white hover:text-[#000000] transition-all duration-200' aria-label="X Twitter">
                <FaXTwitter className='text-[1rem] sm:text-[1.3rem]' />
              </Link>
              <Link to="" className='w-9 h-9 sm:w-11 sm:h-11 rounded-full border border-white/80 flex items-center justify-center text-base text-white hover:bg-white hover:text-[#000000]  transition-all duration-200' aria-label="TikTok">
                <FaTiktok className='text-[1rem] sm:text-[1.3rem]' />
              </Link>
              <Link to="" className='w-9 h-9 sm:w-11 sm:h-11 rounded-full border border-white/80 flex items-center justify-center text-base text-white hover:bg-white hover:text-[#000000]  transition-all duration-200' aria-label="YouTube">
                <FaYoutube className='text-[1rem] sm:text-[1.3rem]' />
              </Link>
            </div>
          </div>
        </div>

        {/* RIGHT SECTION LINKS */}
        <div className='lg:col-span-7 grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8 text-xs sm:text-sm'>
          
          {/* HELP COLUMN */}
          <div>
            <h3 className='font-semibold tracking-wider uppercase mb-4 text-white text-xs sm:text-sm'>
              HELP
            </h3>
            <ul className='space-y-2.5 text-gray-300'>
              <li>
                <a href="mailto:josephmadu774@gmail.com" className='hover:text-white transition-colors duration-150 block'>
                  @allshoesgmail.com
                </a>
              </li>
              <li>
                <Link to="/faq" className='hover:text-white transition-colors duration-150 block'>
                  FAQ/Contact Us
                </Link>
              </li>
              <li>
                <Link to="" className='hover:text-white transition-colors duration-150 block'>
                  Returns/Exchanges
                </Link>
              </li>
            </ul>
          </div>

          {/* SHOP COLUMN */}
          <div>
            <h3 className='font-semibold tracking-wider uppercase mb-4 text-white text-xs sm:text-sm'>
              SHOP
            </h3>
            <ul className='space-y-2.5 text-gray-300'>
              <li>
                <Link to="/men" className='hover:text-white transition-colors duration-150 block'>
                  Men's Shoes
                </Link>
              </li>
              <li>
                <Link to="/women" className='hover:text-white transition-colors duration-150 block'>
                  Women's Shoes
                </Link>
              </li>

              <li>
                <Link to="/all" className='hover:text-white transition-colors duration-150 block'>
                Shop all
                </Link>
              </li>
            </ul>
          </div>

          {/* COMPANY COLUMN */}
          <div>
            <h3 className='font-semibold tracking-wider uppercase mb-4 text-white text-xs sm:text-sm'>
              COMPANY
            </h3>
            <ul className='space-y-2.5 text-gray-300'>
              <li>
                <Link to="" className='hover:text-white transition-colors duration-150 block'>
                  Our Story
                </Link>
              </li>
              <li>
                <Link to="" className='hover:text-white transition-colors duration-150 block'>
                  Our Materials
                </Link>
              </li>
              <li>
                <Link to="" className='hover:text-white transition-colors duration-150 block'>
                  Materials &amp; Making
                </Link>
              </li>
              <li>
                <Link to="" className='hover:text-white transition-colors duration-150 block'>
                  Shoe Care
                </Link>
              </li>
              <li>
                <Link to="" className='hover:text-white transition-colors duration-150 block'>
                  Press
                </Link>
              </li>
              <li>
                <Link to="" className='hover:text-white transition-colors duration-150 block leading-tight'>
                  AllShoes Responsible Disclosure Program
                </Link>
              </li>
              <li>
                <Link to="" className='hover:text-white transition-colors duration-150 block leading-tight'>
                  California Transparency Act
                </Link>
              </li>
              <li>
                <Link to="" className='hover:text-white transition-colors duration-150 block'>
                  Community Offers
                </Link>
              </li>
            </ul>
          </div>

          {/* BLOG COLUMN */}
          <div className='pt-0 sm:pt-[2.25rem]'>
            <ul className='space-y-2.5 text-gray-300'>
              <li>
                <Link to="" className='hover:text-white transition-colors duration-150 block'>
                  Our Blog
                </Link>
              </li>
              <li>
                <Link to="" className='hover:text-white transition-colors duration-150 block'>
                  Patents
                </Link>
              </li>
            </ul>
          </div>

        </div>
      </div>
    </footer>
  )
}

export default Footer