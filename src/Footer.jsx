import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FaInstagram, FaPinterestP, FaFacebookF, FaXTwitter, FaTiktok, FaYoutube } from "react-icons/fa6"

function Footer() {
  const [email, setEmail] = useState('')
  const navigate = useNavigate()

  const handleSignupSubmit = (e) => {
    e.preventDefault()
    navigate('/signup')
  }

  return (
    <footer className="bg-[#000000] text-white py-16 px-6 sm:px-12 font-jakarta border-t border-white/[0.08]">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* LEFT SECTION: NEWSLETTER & SOCIAL */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-10">
          <div>
            <h3 className="text-xs font-semibold tracking-[0.2em] uppercase mb-3 text-neutral-300">
              Subscribe to Updates
            </h3>
            <p className="text-xs text-neutral-400 font-light mb-4 max-w-sm">
              Be the first to know about new collection drops, material innovations, and quiet releases.
            </p>
            <form onSubmit={handleSignupSubmit} className="bg-white/10 border border-white/15 rounded-full flex items-center px-4 py-2 max-w-sm w-full focus-within:border-white/40 transition-colors">
              <input
                type="email"
                placeholder="Enter your email"
                aria-label="Email address for newsletter"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-transparent outline-none text-white text-xs flex-1 pr-2 placeholder-neutral-400"
              />
              <button 
                type="submit" 
                className="text-black bg-white hover:bg-neutral-200 font-medium text-xs px-4 py-1.5 rounded-full transition-colors cursor-pointer"
              >
                Join
              </button>
            </form>
          </div>

          <div>
            <h3 className="text-xs font-semibold tracking-[0.2em] uppercase mb-4 text-neutral-300">
              Follow AllShoes
            </h3>
            <div className="flex items-center gap-3">
              {[
                { icon: <FaInstagram />, label: 'Instagram', href: 'https://instagram.com' },
                { icon: <FaPinterestP />, label: 'Pinterest', href: 'https://pinterest.com' },
                { icon: <FaFacebookF />, label: 'Facebook', href: 'https://facebook.com' },
                { icon: <FaXTwitter />, label: 'X', href: 'https://twitter.com' },
                { icon: <FaTiktok />, label: 'TikTok', href: 'https://tiktok.com' },
                { icon: <FaYoutube />, label: 'YouTube', href: 'https://youtube.com' },
              ].map(({ icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center text-xs text-neutral-300 hover:text-white hover:border-white/60 transition-colors"
                  aria-label={label}
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT SECTION: DIRECTORY LINKS */}
        <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-4 gap-8 text-xs font-light text-neutral-400">
          
          {/* HELP */}
          <div>
            <h3 className="font-medium tracking-wide uppercase mb-4 text-white text-xs">
              Client Care
            </h3>
            <ul className="space-y-2.5">
              <li>
                <a href="mailto:support@allshoes.com" className="hover:text-white transition-colors">
                  Contact Support
                </a>
              </li>
              <li>
                <Link to="/faq" className="hover:text-white transition-colors">
                  FAQs & Sizing
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-white transition-colors">
                  Returns & Exchanges
                </Link>
              </li>
            </ul>
          </div>

          {/* SHOP */}
          <div>
            <h3 className="font-medium tracking-wide uppercase mb-4 text-white text-xs">
              Explore
            </h3>
            <ul className="space-y-2.5">
              <li>
                <Link to="/all" className="hover:text-white transition-colors">
                  All Footwear
                </Link>
              </li>
              <li>
                <Link to="/men" className="hover:text-white transition-colors">
                  Men's Shoes
                </Link>
              </li>
              <li>
                <Link to="/women" className="hover:text-white transition-colors">
                  Women's Shoes
                </Link>
              </li>
            </ul>
          </div>

          {/* COMPANY */}
          <div>
            <h3 className="font-medium tracking-wide uppercase mb-4 text-white text-xs">
              Craft
            </h3>
            <ul className="space-y-2.5">
              <li>
                <Link to="/faq" className="hover:text-white transition-colors">
                  Natural Materials
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-white transition-colors">
                  Shoe Care Guide
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-white transition-colors">
                  Sustainability
                </Link>
              </li>
            </ul>
          </div>

          {/* LEGAL */}
          <div>
            <h3 className="font-medium tracking-wide uppercase mb-4 text-white text-xs">
              Legal
            </h3>
            <ul className="space-y-2.5">
              <li>
                <span className="text-neutral-500">Privacy Policy</span>
              </li>
              <li>
                <span className="text-neutral-500">Terms of Service</span>
              </li>
              <li>
                <span className="text-neutral-500">Cookie Settings</span>
              </li>
            </ul>
          </div>

        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between text-[11px] text-neutral-500 font-light gap-4">
        <p>© {new Date().getFullYear()} AllShoes, Inc. All rights reserved.</p>
        <p>Engineered for serene movement.</p>
      </div>
    </footer>
  )
}

export default Footer
