import { motion, useReducedMotion } from 'framer-motion'

const directionVariants = {
  up:    { opacity: 0, y: 30 },
  down:  { opacity: 0, y: -30 },
  left:  { opacity: 0, x: 30 },
  right: { opacity: 0, x: -30 },
}

function FadeIn({
  children,
  delay = 0,
  direction = 'up',
  duration = 0.5,
  className = 'w-full',
  viewportAmount = 0.1,
}) {
  const shouldReduceMotion = useReducedMotion()

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      initial={directionVariants[direction]}
      whileInView={{ opacity: 1, y: 0, x: 0 }}
      viewport={{ once: true, amount: viewportAmount }}
      transition={{ duration, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export default FadeIn
