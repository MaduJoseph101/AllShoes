import MenButton from '../Props/MenButton'
import WomenButton from '../Props/WomenButton'

const SECTIONS = [
  {
    id: 1,
    bgImage: '/DisplayImages/jordanD.jpg',
    alt: "Women's Footwear Collection",
    title: 'New Silhouette',
    tag: "Limited Edition",
    className: 'col-span-1 md:col-span-2 min-h-[360px] sm:min-h-[420px]',
    titleSize: 'text-2xl sm:text-4xl'
  },
  {
    id: 2,
    bgImage: '/DisplayImages/menshoeD.jpg',
    alt: "Men's Footwear Collection",
    title: 'Summer Edition',
    tag: "Seasonal Archive",
    className: 'col-span-1 md:col-span-1 min-h-[360px] sm:min-h-[420px]',
    titleSize: 'text-2xl sm:text-3xl'
  },
  {
    id: 3,
    bgImage: '/DisplayImages/womenshoeD.jpg',
    alt: 'Athletic Shoes Feature',
    title: 'New Arrivals',
    tag: 'Deluxe Edition',
    className: 'col-span-1 md:col-span-1 min-h-[360px] sm:min-h-[420px]',
    titleSize: 'text-2xl sm:text-3xl'
  },
]

function ProductsDisplay() {
  return (
    <section 
      aria-label="Featured Collections" 
      className="max-w-6xl mx-auto my-16 px-4 font-jakarta"
    >
      <div className="mb-6">
        <span className="text-[11px] font-semibold tracking-[0.2em] uppercase text-neutral-400">Related</span>
        <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-neutral-900 mt-0.5">Explore More Collections</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
        {SECTIONS.map((box) => (
          <div 
            key={box.id} 
            className={`group rounded-3xl relative overflow-hidden bg-neutral-900 shadow-sm hover:shadow-xl transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] flex flex-col justify-between p-8 ${box.className}`}
          >
            <img 
              src={box.bgImage} 
              alt={box.alt} 
              decoding="async"
              className="absolute inset-0 h-full w-full object-center object-cover brightness-[0.88] group-hover:brightness-95 group-hover:scale-[1.04] transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]" 
            />         

            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-black/10 z-0 pointer-events-none" />

            <div className="flex flex-col justify-between h-full w-full z-10 relative">
              <div>
                <span className="inline-block text-[10px] font-semibold tracking-[0.2em] uppercase text-white/80 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full border border-white/15">
                  {box.tag}
                </span>
              </div>

              <div className="space-y-4">
                <h3 className={`font-semibold text-white tracking-[-0.02em] ${box.titleSize}`}>
                  {box.title} 
                </h3>

                <div className="flex items-center gap-3 pt-1">
                  <MenButton 
                    MenButton="Shop Men" 
                    to="/men"
                  />
                  <WomenButton 
                    WomenButton="Shop Women" 
                    to="/women"
                  />
                </div>
              </div>

            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default ProductsDisplay
