import { useState } from 'react'
import { Link } from 'react-router-dom'

function getRouteFromLabel(label) {
  const normalised = label.trim()
  if (normalised === 'Shop Men') return '/men'
  if (normalised === 'Shop Women') return '/women'
  if (normalised === 'New Arrivals') return '/all'
  if (normalised === 'Best Sellers') return '/all'
  if (normalised === 'Explore All') return '/all'
  return '/all'
}

function CarouselCard({ bgImage, title, mainLabel, secondaryLabel, tertiaryLabel }) {
  const [isHovered, setIsHovered] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const isActive = isHovered || isFocused

  return (
    <div
      tabIndex={0}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsFocused(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setIsFocused(false)
      }}
      className="group relative flex flex-col justify-center items-center rounded-3xl overflow-hidden min-h-[300px] sm:min-h-[460px] py-8 px-4 transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-black"
    >
      <div
        className="absolute inset-0 bg-cover bg-center brightness-95 group-hover:brightness-100 group-hover:scale-[1.02] transition-all duration-[450ms] ease-in-out z-0"
        style={{ backgroundImage: `url(${bgImage})` }}
      />

      <div className="absolute inset-0 bg-black/20 z-0 pointer-events-none" />

      <div className="relative z-10 flex w-full flex-col items-center">
        <h3 className="mb-4 text-xl font-medium tracking-tight text-white">
          {title}
        </h3>
        <Link
          to={getRouteFromLabel(mainLabel)}
          className="inline-flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 text-white border border-white/40 backdrop-blur-md text-xs font-medium tracking-wide px-7 py-3.5 shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
        >
          {mainLabel}
        </Link>
        <div
          aria-hidden={!isActive}
          inert={!isActive}
          className={`w-full overflow-hidden transition-[max-height,opacity,margin] duration-[450ms] ease-in-out ${
            isActive ? 'max-h-32 opacity-100 mt-2' : 'max-h-0 opacity-0 mt-0'
          }`}
        >
          <div className="flex w-full flex-col items-center gap-2 py-1">
            {[secondaryLabel, tertiaryLabel].map((label, index) => (
              <Link
                key={`${label}-${index}`}
                to={getRouteFromLabel(label)}
                className="inline-flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 text-white border border-white/40 backdrop-blur-md text-xs font-medium tracking-wide px-7 py-3.5 shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

const CARDS = [
  {
    id: 'blue-card',
    bgImage: '/CarouselImages/Blue.jpg',
    title: 'New Arrivals',
    mainLabel: 'Explore All',
    secondaryLabel: 'Shop Women',
    tertiaryLabel: 'Shop Men',
  },
  {
    id: 'brown-card',
    bgImage: '/CarouselImages/Brown.jpg',
    title: "Men's Collection",
    mainLabel: 'Shop Men',
    secondaryLabel: 'Shop Women',
    tertiaryLabel: 'New Arrivals',
  },
  {
    id: 'green-card',
    bgImage: '/CarouselImages/Green.jpg',
    title: 'Best Sellers',
    mainLabel: 'Best Sellers',
    secondaryLabel: 'Shop Men',
    tertiaryLabel: 'New Arrivals',
  },
  {
    id: 'pink-card',
    bgImage: '/CarouselImages/Pink.jpg',
    title: "Women's Collection",
    mainLabel: 'Shop Women',
    secondaryLabel: 'Best Sellers',
    tertiaryLabel: 'New Arrivals',
  },
]

function Carousel() {
  return (
    <section aria-label="Featured shoe collection" className="w-full max-w-7xl mx-auto my-14 px-4 sm:px-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {CARDS.map((card) => (
          <CarouselCard
            key={card.id}
            bgImage={card.bgImage}
            title={card.title}
            mainLabel={card.mainLabel}
            secondaryLabel={card.secondaryLabel}
            tertiaryLabel={card.tertiaryLabel}
          />
        ))}
      </div>
    </section>
  )
}

export default Carousel
