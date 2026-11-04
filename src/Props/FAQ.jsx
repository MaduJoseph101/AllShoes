import React, { useState } from 'react'
import { IoIosArrowDown } from 'react-icons/io'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'

function FAQ({ title, description }) {
  const [openIndex, setOpenIndex] = useState(0)
  const shouldReduceMotion = useReducedMotion()

  const faqItems = [
    {
      question: "Do AllShoes fit true to size?",
      answer: "Yes, our footwear runs true to standard sizing. For whole-size models, we recommend sizing up if you have wider feet or fall between sizes. Half-size styles accommodate your standard sizing with room for natural movement."
    },
    {
      question: "What width profile do your shoes have?",
      answer: "AllShoes are built around an anatomical medium-to-wide profile. The natural merino wool and eucalyptus upper stretches gently to match the contours of your foot."
    },
    {
      question: "How do I care for and clean my pair?",
      answer: "Most styles are machine washable. Simply remove the insoles and laces, place in a delicate laundry bag, and wash on a gentle cycle with cold water. Allow them to air dry naturally."
    },
    {
      question: "What is your return and trial policy?",
      answer: "We offer a 30-day trial period with hassle-free returns and exchanges. If your pair is not your ideal fit, return them within 30 days for a full refund."
    }
  ]

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  const defaultDescription = "Designed for daily ease, our footwear brings together natural materials, anatomical support, and understated aesthetic poise."
  const defaultTitle = "Frequently Asked Questions"

  return (
    <section className="w-full max-w-3xl mx-auto my-12 px-4 font-jakarta text-[#000000]">
      <div className="text-center space-y-2 mb-10">
        
        <h2 className="text-2xl sm:text-3xl font-semibold tracking-[-0.02em] text-neutral-900">
          {title || defaultTitle}
        </h2>
        <p className="text-xs sm:text-sm text-neutral-500 font-light max-w-xl mx-auto leading-relaxed">
          {description || defaultDescription}
        </p>
      </div>

      {/* ACCORDION MENU */}
      <div className="divide-y divide-black/[0.06] border-y border-black/[0.06]">
        {faqItems.map((item, index) => {
          const isOpen = openIndex === index
          return (
            <div key={index} className="py-4">
              <button
                onClick={() => toggleAccordion(index)}
                aria-expanded={isOpen}
                aria-controls={`faq-panel-${index}`}
                id={`faq-btn-${index}`}
                className="w-full flex justify-between items-center text-left py-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-black rounded-lg cursor-pointer group"
              >
                <span className="font-medium text-sm sm:text-base text-neutral-900 group-hover:text-neutral-600 transition-colors">
                  {item.question}
                </span>

                <motion.span 
                  animate={{ rotate: isOpen ? 180 : 0 }}
                  transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.25, ease: 'easeInOut' }}
                  className="w-7 h-7 rounded-full border border-black/10 flex items-center justify-center text-xs text-neutral-600 shrink-0 ml-4 group-hover:border-black/30 transition-colors"
                >
                  <IoIosArrowDown />
                </motion.span>
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    id={`faq-panel-${index}`}
                    role="region"
                    aria-labelledby={`faq-btn-${index}`}
                    key="content"
                    initial={shouldReduceMotion ? { opacity: 1 } : { height: 0, opacity: 0 }}
                    animate={shouldReduceMotion ? { opacity: 1 } : { height: 'auto', opacity: 1 }}
                    exit={shouldReduceMotion ? { opacity: 0 } : { height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                    className="overflow-hidden"
                  >
                    <p className="pt-2 pb-3 pr-8 text-xs sm:text-sm text-neutral-600 font-light leading-relaxed">
                      {item.answer}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )
        })}
      </div>
    </section>
  )
}

export default FAQ
