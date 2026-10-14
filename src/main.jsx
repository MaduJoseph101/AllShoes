import { StrictMode, useEffect } from 'react'
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
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import FAQ from './Props/FAQ'
import { CartProvider } from './CartContext'

import CartDrawer from './Purchase/CartDrawer'
import CheckoutModal from './Purchase/CheckoutModal'
import UndoToast from './Purchase/UndoToast'

import WishlistToast from './Purchase/WishlistToast'
import SavedItems from './Purchase/SavedItems'
import AuthPromptModal from './Purchase/AuthPromptModal'

function ScrollToTop() {
  const location = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname])
  return null
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <CartProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Header/>
        <Routes>
          <Route path='/' element={<Homepage/>}/>
          <Route path='/all' element={<Allitems/>}/>
          <Route path='/men' element={<MenItems/>}/>
          <Route path='/women' element={<WomenItems/>}/>
          <Route path='/signup' element={<Signup/>}/>
          <Route path='/cart' element={<Cart/>}/>
          <Route path='/saved' element={<SavedItems/>}/>
          <Route path='/faq' element={<FAQ/>}/>
          <Route path='/productdetails/:id' element={<ProductDetails/>}/>
        </Routes>
        <Footer/>
        <CartDrawer />
        <CheckoutModal />
        <UndoToast />
        <WishlistToast />
        <AuthPromptModal />
      </BrowserRouter>
    </CartProvider>
  </StrictMode>,
)

