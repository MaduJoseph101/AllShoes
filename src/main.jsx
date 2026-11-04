import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './Commerce.css'
import Header from './Header'
import Homepage from './Homepage'
import MenItems from './MenProducts/MenItems'
import WomenItems from './WomenProducts/WomenItems'
import Allitems from './AllPoducts/Allitems'
import Signup from './Signup'
import Cart from './Purchase/Cart'
import ProductDetails from './Purchase/ProductDetails'
import Footer from './Footer'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import FAQ from './Props/FAQ'
import { CartProvider } from './CartContext'
import ScrollToTop from './ScrollToTop'

import CartDrawer from './Purchase/CartDrawer'
import CheckoutModal from './Purchase/CheckoutModal'
import UndoToast from './Purchase/UndoToast'

import WishlistToast from './Purchase/WishlistToast'
import SavedItems from './Purchase/SavedItems'
import AuthPromptModal from './Purchase/AuthPromptModal'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <CartProvider>
      <BrowserRouter>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-black focus:text-white focus:rounded-full focus:text-xs focus:font-medium focus:shadow-lg focus:outline-none"
        >
          Skip to main content
        </a>
        <ScrollToTop />
        <Header />
        <main id="main-content" className="min-h-screen">
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/all" element={<Allitems />} />
            <Route path="/men" element={<MenItems />} />
            <Route path="/women" element={<WomenItems />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/saved" element={<SavedItems />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/productdetails/:id" element={<ProductDetails />} />
          </Routes>
        </main>
        <Footer />
        <CartDrawer />
        <CheckoutModal />
        <UndoToast />
        <WishlistToast />
        <AuthPromptModal />
      </BrowserRouter>
    </CartProvider>
  </StrictMode>,
)
