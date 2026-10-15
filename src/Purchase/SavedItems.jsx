import { Fragment } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../CartContext'
import { FiHeart, FiTrash2, FiArrowLeft, FiShoppingBag } from 'react-icons/fi'
import { FaHeart } from 'react-icons/fa'
import FadeIn from '../FadeIn'

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
})

function SavedItems() {
  const { wishlistItems, toggleWishlist } = useCart()

  if (wishlistItems.length === 0) {
    return (
      <div className='min-h-[80vh] bg-[#ECE9E2] font-jakarta flex flex-col items-center justify-center px-4 py-16'>
        <div className='bg-white rounded-3xl p-10 sm:p-14 max-w-md w-full text-center space-y-6 shadow-sm border border-gray-200/70'>
          <div className='flex justify-center'>
            <div className='bg-red-50 p-6 rounded-full text-red-500'>
              <FiHeart className='text-3xl' />
            </div>
          </div>
          <div className='space-y-2'>
            <h2 className='text-2xl font-extrabold text-gray-950 tracking-tight'>No Saved Items Yet</h2>
            <p className='text-sm text-gray-500 leading-relaxed'>
              Tap the heart icon on any shoe to save your favorite styles for later.
            </p>
          </div>
          <Link
            to='/all'
            className='inline-block bg-[#212121] text-white font-bold text-xs tracking-wider uppercase px-8 py-4 rounded-full hover:bg-black hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 shadow-sm'
          >
            Explore Collection
          </Link>
        </div>
      </div>
    )
  }

  return (
    <FadeIn>
      <div className='min-h-screen bg-[#ECE9E2] font-jakarta py-8 px-4 sm:px-8'>
      <div className='max-w-6xl mx-auto space-y-6'>

        {/* HEADER */}
        <div className='flex flex-wrap items-center justify-between gap-4 border-b border-gray-300/80 pb-4'>
          <Link
            to='/all'
            className='inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-gray-700 hover:text-black transition-colors'
          >
            <FiArrowLeft className='text-xs' />
            Continue Shopping
          </Link>

          <div className='flex items-center gap-2'>
            <h1 className='text-lg sm:text-[1rem] flex gap-2 font-extrabold text-gray-950 tracking-tight uppercase'>
              Saved Items <span className='text-gray-400 font-bold'>({wishlistItems.length})</span>
            </h1>
          </div>
        </div>

        {/* RESPONSIVE GRID */}
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6'>
          {wishlistItems.map((item) => (
            <Fragment key={item.id}>

            {/* MOBILE */}
            <div className='sm:hidden bg-white rounded-3xl p-4 flex gap-4 shadow-sm border border-gray-200/70'>
              {/* THUMBNAIL */}
              <Link to={`/productdetails/${item.id}`} className='flex-shrink-0'>
                <div className='w-20 h-20 bg-[#F4F1EA] rounded-2xl flex items-center justify-center overflow-hidden'>
                  <img
                    src={item.thumbnail}
                    alt={item.title}
                    className='w-full h-full object-contain p-1.5'
                  />
                </div>
              </Link>

              {/* DETAILS */}
              <div className='flex-1 min-w-0 flex flex-col justify-between'>
                <div>
                  <div className='flex items-start justify-between gap-2'>
                    <Link
                      to={`/productdetails/${item.id}`}
                      className='text-sm font-bold text-gray-950 tracking-tight line-clamp-2 hover:underline'
                    >
                      {item.title}
                    </Link>
                    <button
                      onClick={() => toggleWishlist(item)}
                      className='text-red-500 hover:bg-red-500 hover:text-white transition-colors p-1 rounded-full cursor-pointer flex-shrink-0'
                      title='Remove from saved'
                      aria-label='Remove from saved'
                    >
                      <FaHeart className='text-xs' />
                    </button>
                  </div>

                  <div className='flex items-center gap-2 mt-1.5'>
                    <span className='text-[10px] font-semibold uppercase tracking-wider text-gray-500 bg-[#F4F1EA] px-2 py-0.5 rounded-md'>
                      {item.brand || 'AllShoes'}
                    </span>
                  </div>
                </div>

                <div className='flex flex-wrap items-center justify-between mt-3 gap-2'>
                  <span className='text-[14px] font-extrabold text-gray-950'>
                    {currencyFormatter.format(item.price)}
                  </span>

                  <Link
                    to={`/productdetails/${item.id}`}
                    className='ml-auto flex items-center gap-1.5 bg-[#212121] text-white text-[10px] font-bold uppercase tracking-wider px-4 py-2 rounded-full hover:bg-black transition-all cursor-pointer shadow-xs whitespace-nowrap'
                  >
                    <FiShoppingBag className='text-xs' /> Add to cart
                  </Link>
                </div>
              </div>
            </div>

            {/*TABLET & DESKTOP*/}
            <div
              className='hidden sm:flex bg-white rounded-3xl p-5 border border-gray-200/70 shadow-sm hover:shadow-md transition-all duration-300 flex-col justify-between group relative'
            >
              {/* REMOVE BUTTON */}
              <button
                onClick={() => toggleWishlist(item)}
                className='absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-white/90 shadow-xs flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white transition-colors cursor-pointer border border-gray-200'
                title='Remove from saved'
                aria-label='Remove from saved'
              >
                <FaHeart className='text-xs' />
              </button>

              {/* IMAGE */}
              <Link to={`/productdetails/${item.id}`} className='block'>
                <div className='bg-[#F4F1EA] rounded-2xl p-4 flex items-center justify-center min-h-[180px] mb-4 overflow-hidden'>
                  <img
                    src={item.thumbnail}
                    alt={item.title}
                    className='max-h-36 object-contain group-hover:scale-105 transition-transform duration-300'
                  />
                </div>
              </Link>

              {/* DETAILS */}
              <div className='space-y-3 px-1 flex-1 flex flex-col justify-between'>
                <div className=' flex flex-col gap-1'>
                  <p className='text-[10px] font-bold text-gray-400 uppercase tracking-widest'>
                    {item.brand || 'AllShoes'}
                  </p>
                  <Link
                    to={`/productdetails/${item.id}`}
                    className='text-sm font-bold text-gray-950 line-clamp-2 hover:underline tracking-tight'
                  >
                    {item.title}
                  </Link>
                </div>

                <div className='pt-2 border-t border-gray-100 flex items-center justify-between'>
                  <span className='text-base font-extrabold text-gray-950'>
                    {currencyFormatter.format(item.price)}
                  </span>
                </div>

                {/* VIEW & CHOOSE SIZE ACTION */}
                <Link
                  to={`/productdetails/${item.id}`}
                  className='w-full py-3 bg-[#212121] text-white text-xs font-bold uppercase tracking-wider rounded-full hover:bg-black transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs text-center'
                >
                  <FiShoppingBag className='text-xs' /> Add to cart
                </Link>
              </div>
            </div>

            </Fragment>
          ))}
        </div>

      </div>
    </div>
    </FadeIn>
  )
}

export default SavedItems
