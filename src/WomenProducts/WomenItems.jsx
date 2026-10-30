import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import FAQ from '../Props/FAQ'
import FadeIn from '../FadeIn'

function WomenItems() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchWomenShoes = async () => {
      try {
        const response = await fetch('https://dummyjson.com/products/category/womens-shoes')
        if (!response.ok) {
          throw new Error('Failed to fetch products')
        }
        const data = await response.json()
        setProducts(data.products || [])
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchWomenShoes()
  }, [])

  return (
   <FadeIn>
     <div className='min-h-screen w-full bg-[#ECE9E2] font-jakarta px-3 sm:px-6 py-6'>
      <div className='max-w-7xl mx-auto space-y-8'>
        
        {/* HERO CONTAINER*/}
        <div 
          className='relative w-full h-[45dvh] sm:h-[45vh] md:h-[55vh] rounded-3xl overflow-hidden bg-cover bg-center shadow-sm'
          style={{ backgroundImage: "url('/DisplayImages/womenitems-shoe.jpg')" }}
        >
          <div className='absolute inset-0 bg-gradient-to-r from-black/60 via-black/20 to-transparent flex flex-col justify-between p-6 sm:p-10 text-white'>

            {/* BREADCRUMB FOR HOMEPAGE */}
            <nav aria-label='Breadcrumb' className='text-xs sm:text-sm font-semibold tracking-wide text-gray-200'>
              <ol className='flex items-center gap-2'>
                <li><Link to='/' className='hover:underline text-gray-300'>Home</Link></li>
                <li aria-hidden='true'>/</li>
                <li aria-current='page' className='text-white font-semibold'>Women's Shoes</li>
              </ol>
            </nav>

            <div className='max-w-xl space-y-2 mb-2 sm:mb-4'>
              <h1 className='text-3xl sm:text-[2.5rem] font-extrabold tracking-tight text-white'>
                Women's Shoes
              </h1>
              <p className='text-xs sm:text-sm md:text-base text-white/90 leading-relaxed font-normal'>
                Discover your perfect balance of style and comfort with our collection of women's shoes designed for every occasion.
              </p>
            </div>
          </div>
        </div>

        {/* PRODUCT CONTAINER*/}
        <div>
          {loading ? (
            <>
            <p role='status' aria-live='polite' className='sr-only'>Loading products…</p>
            <div aria-hidden='true' className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6'>
              {Array.from({ length: 8 }).map((_, i) => (
                <div 
                  key={i} 
                  className='bg-white rounded-2xl sm:rounded-3xl overflow-hidden p-3 sm:p-4 shadow-xs animate-pulse flex flex-col justify-between border border-gray-100'
                >
                  <div className='w-full h-36 sm:h-56 bg-gray-100 rounded-xl mb-3 relative flex items-center justify-center p-2'>
                    <div className='absolute top-3 left-3 w-10 h-4 bg-gray-200/80 rounded-full' />
                    <div className='w-24 h-20 sm:w-32 sm:h-28 bg-gray-200/60 rounded-xl' />
                  </div>
                  <div className='space-y-2 pt-2 border-t border-gray-100'>
                    <div className='h-3.5 bg-gray-200/80 rounded w-3/4' />
                    <div className='h-2.5 bg-gray-200/60 rounded w-1/2' />
                    <div className='flex justify-between items-center pt-2'>
                      <div className='h-4 bg-gray-200/80 rounded w-12' />
                      <div className='h-3 bg-gray-200/70 rounded w-8' />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            </>
          ) : error ? (
            <div className='flex items-center justify-center py-12'>
              <div className='w-full max-w-lg bg-white border border-gray-200/80 rounded-3xl p-8 sm:p-10 text-center flex flex-col items-center gap-3 shadow-xs'>
                <span className='font-jakarta text-[11px] uppercase tracking-widest text-gray-600 font-semibold'>
                  Connection Error
                </span>
                <h2 className='font-jakarta font-extrabold text-lg sm:text-xl text-gray-950 tracking-tight'>
                  Unable to load Women's Shoes
                </h2>
                <p className='font-jakarta text-xs sm:text-sm text-gray-600 max-w-sm leading-relaxed'>
                  We couldn't retrieve the product list. Please check your network connection and try again.
                </p>
                <button
                  onClick={() => window.location.reload()}
                  className='mt-3 font-jakarta text-xs sm:text-sm font-bold bg-[#111111] text-white px-7 py-3 rounded-full hover:bg-black hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 cursor-pointer shadow-xs'
                >
                  Try Again
                </button>
              </div>
            </div>
          ) : (
            <div className='grid grid-cols-2 sm:px-10 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4'>
              {products.map((product) => (
                <Link
                  key={product.id}
                  to={`/productdetails/${product.id}`}
                  className='block h-full group'
                >
                  <div className='relative bg-white rounded-2xl sm:rounded-3xl overflow-hidden p-3 sm:p-4 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between h-full'>
                   

                    {/* PRODUCT IMAGE */}
                    <div className='w-full h-34 sm:h-52 flex items-center justify-center p-1 sm:p-2 overflow-hidden bg-white'>
                      <img 
                        src={product.thumbnail || product.images?.[0]} 
                        alt={product.title}
                        loading='lazy'
                        className='max-h-full object-contain object-center group-hover:scale-105 transition-transform duration-500 ease-out'
                      />
                    </div>

                    {/* DETAILS */}
                    <div className='mt-2 sm:mt-4 pt-2 border-t border-gray-100 flex flex-col gap-2'>
                      <h2 className='font-bold text-xs sm:text-sm text-gray-900 line-clamp-1 group-hover:text-black transition-colors'>
                        {product.title}
                      </h2>
                      <p className='text-[10px] sm:text-xs text-gray-500 line-clamp-1'>
                        {product.description}
                      </p>
                      <div className='flex items-center justify-between mt-1 sm:mt-2 pt-1'>
                        <span className='font-bold text-xs sm:text-sm text-gray-900'>
                          ${product.price}
                        </span>
                        <span className='text-[10px] sm:text-xs font-semibold text-gray-600 bg-gray-100 px-1.5 py-0.5 rounded-md'>
                          ★ {product.rating}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className='pt-8 border-t border-gray-300/60'>
          <FAQ
            headingLevel={2}
            title="WOMEN'S SHOES" 
            description="Discover your perfect balance of style and comfort with our collection of women's shoes designed for every occasion. From polished office days to catching up with friends after work, or exploring your favourite trail, our shoes offer sustainable support with every step, so you look and feel incredible all day long"
          />
          
        </div>
        
      </div>
    </div>
   </FadeIn>
  )
}

export default WomenItems