import { Fragment } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../CartContext'
import { FiHeart, FiArrowLeft } from 'react-icons/fi'
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
      <div className="min-h-[80vh] bg-[#FBFBFD] font-jakarta flex flex-col items-center justify-center px-4 py-16">
        <div className="bg-white rounded-3xl p-10 sm:p-14 max-w-md w-full text-center space-y-6 shadow-sm border border-neutral-300">
          <div className="flex justify-center">
            <div className="bg-[#F5F5F7] p-6 rounded-full text-neutral-400">
              <FiHeart className="text-3xl" />
            </div>
          </div>
          <div className="space-y-2">
            <h1 className="text-xl sm:text-2xl font-semibold text-neutral-900 tracking-tight">No Saved Items</h1>
            <p className="text-xs sm:text-sm text-neutral-500 font-light leading-relaxed">
              Save your favorite silhouettes while exploring to revisit or compare them later.
            </p>
          </div>
          <Link
            to="/all"
            className="inline-block bg-[#000000] hover:bg-black text-white font-medium text-xs tracking-wider uppercase px-8 py-3.5 rounded-full transition-all duration-200 shadow-sm"
          >
            Explore Collection
          </Link>
        </div>
      </div>
    )
  }

  return (
    <FadeIn>
      <div className="min-h-screen bg-[#FBFBFD] font-jakarta py-10 px-4 sm:px-8">
        <div className="max-w-6xl mx-auto space-y-8">

          {/* HEADER */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-black/[0.06] pb-4">
            <Link
              to="/all"
              className="inline-flex items-center gap-2 text-xs font-medium text-neutral-500 hover:text-black transition-colors"
            >
              <FiArrowLeft className="text-xs" /> Continue Shopping
            </Link>

            <h1 className="text-base sm:text-lg font-semibold text-neutral-900 tracking-tight">
              Saved Styles <span className="text-neutral-400 font-normal">({wishlistItems.length})</span>
            </h1>
          </div>

          {/* RESPONSIVE GRID */}
          <div className="catalog-grid grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {wishlistItems.map((item) => (
              <Fragment key={item.id}>
                <div className="group flex flex-col justify-between bg-white rounded-3xl p-3 border border-neutral-300 hover:border-neutral-900 shadow-xs hover:shadow-lg transition-all duration-300">
                  {/* PEDESTAL */}
                  <div className="relative bg-[#F5F5F7] rounded-2xl p-5 aspect-square flex items-center justify-center overflow-hidden group-hover:bg-[#ECECEE] transition-all duration-500">
                    <button
                      onClick={() => toggleWishlist(item)}
                      className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white/90 shadow-2xs flex items-center justify-center text-red-500 hover:bg-white transition-colors cursor-pointer border border-black/5"
                      title="Remove from saved"
                      aria-label="Remove from saved"
                    >
                      <FaHeart className="text-xs" />
                    </button>

                    <Link to={`/productdetails/${item.id}`} className="w-full h-full flex items-center justify-center">
                      <img
                        src={item.thumbnail}
                        alt={item.title}
                        className="max-h-[85%] max-w-[85%] object-contain group-hover:scale-105 transition-transform duration-500"
                      />
                    </Link>
                  </div>

                  {/* DETAILS */}
                  <div className="pt-3 pb-1 px-1.5 space-y-2">
                    <div>
                      <span className="text-[10px] font-semibold tracking-wider uppercase text-neutral-400">
                        {item.brand || 'AllShoes'}
                      </span>
                      <Link
                        to={`/productdetails/${item.id}`}
                        className="text-xs sm:text-sm font-medium text-neutral-900 truncate block hover:underline"
                      >
                        {item.title}
                      </Link>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <span className="text-xs sm:text-sm font-semibold text-neutral-900">
                        {currencyFormatter.format(item.price)}
                      </span>
                      <Link
                        to={`/productdetails/${item.id}`}
                        className="text-[11px] font-medium text-neutral-900 underline hover:text-black"
                      >
                        View Style →
                      </Link>
                    </div>
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
