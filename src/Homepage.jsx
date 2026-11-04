import { Link } from 'react-router-dom'
import Carousel from './Homepages/Carousel'
import BestSellers from './Homepages/BestSellers'
import FadeIn from './FadeIn'
import Display from './Homepages/Display'
import Prefooter from './Homepages/Prefooter'

function Homepage() {
  return (
    <div className="flex flex-col w-full overflow-hidden">
      {/* HERO SECTION */}
      <section
        aria-label="Hero showcase"
        className="wide-hero relative h-[90vh] sm:h-[92vh] w-full bg-[url(/home1.jpg)] bg-cover bg-center flex items-center justify-center font-jakarta overflow-hidden"
      >
        {/* Soft, cinematic gradient vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/25 to-black/30 backdrop-contrast-[1.05]" />

        <div className="wide-hero-copy relative z-10 text-center flex flex-col items-center gap-4 sm:gap-6 text-white px-6 max-w-4xl mx-auto">
          <span className="text-[11px] sm:text-xs font-semibold tracking-[0.25em] uppercase text-white/80">
            Fall / Winter 2026
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold tracking-[-0.03em] text-white">
            All New Collection
          </h1>
          <p className="text-sm sm:text-lg md:text-xl font-light text-white/90 max-w-xl mx-auto tracking-normal">
            The world's most comfortable shoes, crafted from sustainable natural materials.
          </p>

          <div className="flex flex-row gap-4 pt-2 justify-center items-center">
            <Link
              to="/women"
              className="bg-white text-black hover:bg-neutral-100 px-7 sm:px-8 py-3.5 rounded-full text-xs sm:text-sm font-medium tracking-wide shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
            >
              Shop Women
            </Link>
            <Link
              to="/men"
              className="bg-white/20 hover:bg-white/30 text-white border border-white/40 backdrop-blur-md px-7 sm:px-8 py-3.5 rounded-full text-xs sm:text-sm font-medium tracking-wide shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
            >
              Shop Men
            </Link>
          </div>
        </div>
      </section>

      {/* CAROUSEL CARDS */}
      <FadeIn duration={0.6}>
        <Carousel />
      </FadeIn>

      {/* TRENDING BEST SELLERS */}
      <FadeIn duration={0.6}>
        <BestSellers />
      </FadeIn>

      {/* EDITORIAL DISPLAY */}
      <FadeIn duration={0.6}>
        <Display />
      </FadeIn>

      {/* PREFOOTER STORY */}
      <FadeIn viewportAmount={0} duration={0.6}>
        <Prefooter />
      </FadeIn>
    </div>
  )
}

export default Homepage
