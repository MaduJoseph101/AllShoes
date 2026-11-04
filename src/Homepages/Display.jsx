import MenButton from '../Props/MenButton'

const SECTIONS = [
  {
    id: 1,
    bgImage: '/DisplayImages/women-shoe.jpg',
    alt: "Women's Footwear Collection",
    title: 'Style & Comfort',
    tag: "Women's Edition",
  },
  {
    id: 2,
    bgImage: '/DisplayImages/men-shoe.jpg',
    alt: "Men's Footwear Collection",
    title: 'Casual & Everyday',
    tag: "Men's Edition",
  },
  {
    id: 3,
    bgImage: '/DisplayImages/athlete.jpg',
    alt: 'Athletic Shoes Feature',
    title: 'Athletic & Performance',
    tag: 'Performance Series',
  },
]

function Display() {
  return (
    <section 
      aria-label="Featured Collections" 
      className="max-w-7xl mx-auto my-12 px-4 sm:px-6 font-jakarta"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
        {SECTIONS.map((box) => (
          <div 
            key={box.id} 
            className="group rounded-3xl relative overflow-hidden min-h-[500px] flex flex-col justify-between p-8 bg-neutral-900 shadow-sm hover:shadow-xl transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
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

              <div className="space-y-4 pt-12">
                <h2 className="text-2xl sm:text-3xl font-semibold tracking-[-0.02em] text-white">
                  {box.title}
                </h2>

                <div className="flex items-center gap-3 pt-2">
                  <MenButton 
                    MenButton="Shop Men" 
                    to="/men"
                  />
                  <MenButton 
                    MenButton="Shop Women" 
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

export default Display
