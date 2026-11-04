import { Link } from 'react-router-dom'

function MenButton({ MenButton: label, to, className = '' }) {
  return (
    <Link
      to={to}
      className={`inline-flex items-center justify-center text-xs sm:text-[13px] font-medium tracking-wide bg-white/90 hover:bg-white text-black backdrop-blur-md rounded-full px-6 py-2.5 shadow-sm hover:shadow transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${className}`}
    >
      {label}
    </Link>
  )
}

export default MenButton
