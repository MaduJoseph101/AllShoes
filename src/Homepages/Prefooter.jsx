import { Link } from 'react-router-dom'

function Prefooter() {
  const currentYear = new Date().getFullYear()

  return (
    <section className="max-w-7xl mx-auto my-16 px-4 sm:px-6 font-jakarta">
      <div className="wide-story-panel bg-[#F5F5F7] h-auto sm:min-h-[70vh] rounded-3xl overflow-hidden grid grid-cols-1 sm:grid-cols-2 border border-black/[0.04]">
        <div className="relative min-h-[360px] sm:min-h-full w-full bg-[url(/model.jpg)] bg-cover bg-center">
          <div className="absolute inset-0 bg-gradient-to-t sm:bg-gradient-to-r from-transparent to-[#F5F5F7]/30" />
        </div>
        
        <div className="flex flex-col justify-center items-start p-8 sm:p-12 lg:p-16 gap-5 text-[#000000]">
         

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-[-0.03em] leading-tight text-neutral-900">
            The {currentYear} Comfort & Performance Collection
          </h2>
          
          <p className="text-sm text-neutral-600 font-light leading-relaxed max-w-md">
            Footwear engineered for everyday movement. Sustainably crafted with renewable materials for a lighter footprint on the earth.
          </p>
          
          <Link 
            to="/all" 
            className="inline-flex items-center justify-center bg-[#000000] hover:bg-black text-white px-8 py-3.5 rounded-full text-xs font-medium tracking-wide shadow-sm hover:shadow transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] mt-2"
          >
            Explore the Collection
          </Link>
        </div>
      </div>
    </section>
  )
}

export default Prefooter
