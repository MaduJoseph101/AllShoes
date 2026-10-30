import React, { useState } from 'react'
import { IoIosArrowDown } from 'react-icons/io'
import { motion, AnimatePresence } from 'framer-motion'

function FAQ({ title, description, headingLevel = 1 }) {
  const [openIndex, setOpenIndex] = useState(0)

  const faqItems = [
    {
      question: "Do AllShoes run true to size?",
      answer: "Yes, AllShoes shoes run true to size. For whole-size-only styles, we recommend sizing up if you have wide feet or fall between sizes. Half-size styles, such as Tree Gliders and Tree Dasher 2s, fit your usual size, unless you plan to wear thick socks for hiking or trail running."
    },
    {
      question: "Are AllShoes shoes wide or narrow?",
      answer: "AllShoes shoes are designed to accommodate a medium to wide fit. The flexible upper materials stretch naturally to adapt to the shape of your foot for maximum comfort."
    },
    {
      question: "How do I clean and care for my AllShoes?",
      answer: "Most AllShoes are machine washable! Remove the insoles and laces, place your shoes in a mesh laundry bag, and wash on a gentle cycle with cold water and mild detergent. Always air dry your shoes—do not put them in the dryer."
    },
    {
      question: "What is the return and exchange policy?",
      answer: "We offer a 30-day no-questions-asked return and exchange policy. If you're not completely satisfied with your AllShoes, you can return or exchange them within 30 days of purchase for a full refund."
    }
  ]

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  const defaultDescription = "Find your perfect blend of style and comfort with our collection of shoes for any occasion. From business casual days to meeting up with friends after work to taking on your favorite trail, our shoes provide the ultimate in sustainable support for every step of your day and look incredible while doing so."

  const defaultTitle = "Frequently asked Questions"
  const Heading = `h${headingLevel}`
  return (
    <section className='w-full max-w-4xl mb-5 sm:mb-10 mx-auto px-4 py-12 font-jakarta text-black'>
      <Heading className='text-center uppercase tracking-[0.25em] text-sm sm:text-base font-semibold text-gray-900 mb-4'>
        {title || defaultTitle}
      </Heading>

      <p className='text-center text-gray-700 text-xs sm:text-sm md:text-base leading-relaxed max-w-3xl mx-auto mb-10'>
        {description || defaultDescription}
      </p>

         {/* LINE DIVIDER (TO AVOID CONFUSION) */}
      <div className='border-b border-gray-400 mb-6' />

      {/* ACCORDION MENU*/}
      <div className='space-y-4'>
        {
        faqItems.map((item, index) => {
          const isOpen = openIndex === index
          return (
            <div key={index} className='border-b border-gray-400 pb-4'>
              <button
                id={`faq-btn-${index}`}
                onClick={() => toggleAccordion(index)}
                className='w-full flex justify-between items-center text-left py-2 focus:outline-none group cursor-pointer'
                aria-expanded={isOpen}
                aria-controls={`faq-panel-${index}`}
              >
                <span className='font-medium text-sm sm:text-base text-gray-900 group-hover:text-gray-700 transition-colors'>
                  {item.question}
                </span>

                {/* ANMATION FOR CONTENT AND ICON */}
                <motion.span 
                  animate={{ rotate: isOpen ? 180 : 0 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                  className='w-6 h-6 rounded-full border border-black flex items-center justify-center text-xs text-black shrink-0 ml-4'
                >
                  <IoIosArrowDown />
                </motion.span>
              </button>

              <div
                id={`faq-panel-${index}`}
                role='region'
                aria-labelledby={`faq-btn-${index}`}
                aria-hidden={!isOpen}
              >
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key='content'
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] }}
                      className='overflow-hidden'
                    >
                      <p className='mt-2 pr-8 text-justify text-xs sm:text-sm text-gray-700 leading-relaxed pb-2'>
                        {item.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}

export default FAQ