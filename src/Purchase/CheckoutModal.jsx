import { useState, useEffect } from 'react'
import { useCart } from '../CartContext'
import { FiX, FiCheckCircle, FiCreditCard, FiTruck, FiArrowRight, FiArrowLeft, FiUser } from 'react-icons/fi'

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
})

function CheckoutModal() {
  const { isCheckoutOpen, closeCheckout, subtotal, clearCart, user } = useCart()
  const [step, setStep] = useState(1) // 1: Shipping, 2: Payment, 3: Confirmation

  // FORM STATES
  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
    address: user?.address || '',
    city: user?.city || '',
    zip: user?.zip || '',
    phone: user?.phone || '',
    paymentMethod: 'card',
    cardNumber: '',
    cardExpiry: '',
    cardCvc: '',
  })

  // Synchronize with registered user in local storage
  useEffect(() => {
    if (isCheckoutOpen) {
      if (user) {
        setFormData((prev) => ({
          ...prev,
          fullName: user.fullName || '',
          email: user.email || '',
          address: user.address || '',
          city: user.city || '',
          zip: user.zip || '',
          phone: user.phone || '',
        }))
      } else {
        // SHIPPING DETAILS RESET WHEB USER IS REMOVED FROM LOCAL STORAGE
        setFormData((prev) => ({
          ...prev,
          fullName: '',
          email: '',
          address: '',
          city: '',
          zip: '',
          phone: '',
        }))
      }
    }
  }, [isCheckoutOpen, user])

  const [orderId, setOrderId] = useState('')
  const [errors, setErrors] = useState({})

  if (!isCheckoutOpen) return null

  const shippingCost = subtotal >= 100 ? 0 : 9.99
  const tax = subtotal * 0.08
  const total = subtotal + shippingCost + tax

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

  const validateStep1 = () => {
    const newErrors = {}
    if (!formData.fullName.trim()) newErrors.fullName = 'Full Name is required'
    if (!formData.email.trim()) newErrors.email = 'Email is required'
    if (!formData.address.trim()) newErrors.address = 'Address is required'
    if (!formData.city.trim()) newErrors.city = 'City is required'
    if (!formData.zip.trim()) newErrors.zip = 'ZIP code is required'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validateStep2 = () => {
    if (formData.paymentMethod === 'card') {
      const newErrors = {}
      if (!formData.cardNumber.trim()) newErrors.cardNumber = 'Card number required'
      if (!formData.cardExpiry.trim()) newErrors.cardExpiry = 'Expiry required'
      if (!formData.cardCvc.trim()) newErrors.cardCvc = 'CVC required'
      setErrors(newErrors)
      return Object.keys(newErrors).length === 0
    }
    return true
  }

  const handleNext = () => {
    if (step === 1 && validateStep1()) {
      setStep(2)
    } else if (step === 2 && validateStep2()) {
      // Complete order
      const generatedId = `ALL-${Math.floor(100000 + Math.random() * 900000)}`
      setOrderId(generatedId)
      setStep(3)
      clearCart()
    }
  }

  const handleClose = () => {
    closeCheckout()
    // RESET THE STATE AFTER A SUCCESSFUL CHECKOUT
    if (step === 3) {
      setStep(1)
    }
  }

  return (
    <div className='fixed w-full inset-0 z-50 overflow-y-auto font-jakarta flex items-center justify-center p-4 sm:p-6'>
      {/* BACKRDROP */}
      <div className='fixed inset-0 bg-black/60 backdrop-blur-xs' onClick={handleClose} />

      {/* MODAL BOX */}
      <div className='relative bg-[#ECE9E2] rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden border border-gray-300 z-10 max-h-[80vh] flex flex-col sm:my-0 sm:h-[90vh]'>
        
        {/* HEADER */}
        <div className='bg-[#212121] text-white p-6 flex items-center justify-between sm:shrink-0'>
          <div>
            <h2 className='text-lg font-extrabold uppercase tracking-wide'>
              {step === 3 ? 'Order Confirmed!' : 'Checkout'}
            </h2>
            {step < 3 && (
              <p className='text-xs text-gray-400 font-semibold'>
                Step {step} of 3 — {step === 1 ? 'Shipping Address' : 'Payment Details'}
              </p>

            )}
          </div>
          <button
            onClick={handleClose}
            className='text-gray-400 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors cursor-pointer'
          >
            <FiX className='text-xl' />
          </button>
        </div>

        {/* STEP 1 & 2 PROGRESS BAR */}
        {step < 3 && (
          <div className='bg-white px-4 sm:px-6 py-5 border-b border-gray-200 flex flex-wrap justify-between items-center gap-x-1.5 sm:gap-x-2 gap-y-1 text-[10px] sm:text-xs font-bold uppercase tracking-wide sm:tracking-wider text-gray-500'>
            <span className={`flex items-center gap-1.5 shrink-0 ${step >= 1 ? 'text-black' : ''}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] shrink-0 ${step >= 1 ? 'bg-black text-white' : 'bg-gray-200'}`}>1</span>
              Shipping
            </span>
            <span className={`flex items-center gap-1.5 shrink-0 ${step >= 2 ? 'text-black' : ''}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] shrink-0 ${step >= 2 ? 'bg-black text-white' : 'bg-gray-200'}`}>2</span>
              Payment
            </span>
            <span className='flex items-center gap-1.5 shrink-0 opacity-50'>
              <span className='w-5 h-5 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center text-[10px] shrink-0'>3</span>
              Confirmation
            </span>
          </div>
        )}

        <div className='p-6 sm:p-8 space-y-6 flex-1 min-h-0 overflow-y-auto'>
          
          {/* STEP 1: SHIPPING FORM */}
          {step === 1 && (
            <div className='space-y-4'>
              <div className='flex items-center justify-between'>
                <h3 className='text-sm px-1 font-extrabold uppercase tracking-wider text-gray-900 flex items-center gap-2'>
                  <FiTruck /> Shipping Details
                </h3>
            
              </div>

              {user && (
                <div className='bg-white/80 border border-gray-200 rounded-2xl p-3 px-4 flex items-center justify-between text-xs text-gray-600'>
                  <div className='flex items-center gap-2'>
                    <div className='w-7 h-7 rounded-full bg-black text-white flex items-center justify-center font-bold text-[10px] uppercase'>
                      {user.fullName ? user.fullName.charAt(0) : 'U'}
                    </div>
                    <div>
                      <p className='font-bold text-gray-900 leading-tight'>{user.fullName || 'Registered User'}</p>
                      <p className='text-[10px] text-gray-500'>{user.email}</p>
                    </div>
                  </div>
                  
                </div>
              )}

              <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                <div>
                  <label htmlFor='fullName' className='block px-2 text-xs font-bold text-gray-700 uppercase tracking-wide mb-1'>
                    Full Name *
                  </label>
                  <input
                    id='fullName'
                    type='text'
                    name='fullName'
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder='John Doe'
                    className={`w-full bg-white border ${errors.fullName ? 'border-red-500' : 'border-gray-300'} rounded-2xl px-4 py-3 text-xs outline-none focus:border-black transition-colors`}
                  />
                  {errors.fullName && <p className='text-[10px] text-red-500 font-semibold mt-1'>{errors.fullName}</p>}
                </div>

                <div>
                  <label htmlFor='email' className='block px-2 text-xs font-bold text-gray-700 uppercase tracking-wide mb-1'>
                    Email Address *
                  </label>
                  <input
                    id='email'
                    required
                    type='email'
                    name='email'
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder='john@example.com'
                    className={`w-full bg-white border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-2xl px-4 py-3 text-xs outline-none focus:border-black transition-colors`}
                  />
                  {errors.email && <p className='text-[10px] text-red-500 font-semibold mt-1'>{errors.email}</p>}
                </div>

                <div className='sm:col-span-2'>
                  <label htmlFor='address' className='block px-2 text-xs font-bold text-gray-700 uppercase tracking-wide mb-1'>
                    Street Address *
                  </label>
                  <input
                    id='address'
                    type='text'
                    name='address'
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder='123 Main St, Apt 4B'
                    className={`w-full bg-white border ${errors.address ? 'border-red-500' : 'border-gray-300'} rounded-2xl px-4 py-3 text-xs outline-none focus:border-black transition-colors`}
                  />
                  {errors.address && <p className='text-[10px] text-red-500 font-semibold mt-1'>{errors.address}</p>}
                </div>

                <div>
                  <label htmlFor='city' className='block px-2 text-xs font-bold text-gray-700 uppercase tracking-wide mb-1'>
                    City *
                  </label>
                  <input
                    id='city'
                    type='text'
                    name='city'
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder='New York'
                    className={`w-full bg-white border ${errors.city ? 'border-red-500' : 'border-gray-300'} rounded-2xl px-4 py-3 text-xs outline-none focus:border-black transition-colors`}
                  />
                  {errors.city && <p className='text-[10px] text-red-500 font-semibold mt-1'>{errors.city}</p>}
                </div>

                <div>
                  <label htmlFor='zip' className='block px-2 text-xs font-bold text-gray-700 uppercase tracking-wide mb-1'>
                    ZIP / Postal Code *
                  </label>
                  <input
                    id='zip'
                    type='text'
                    name='zip'
                    value={formData.zip}
                    onChange={handleInputChange}
                    placeholder='10001'
                    className={`w-full bg-white border ${errors.zip ? 'border-red-500' : 'border-gray-300'} rounded-2xl px-4 py-3 text-xs outline-none focus:border-black transition-colors`}
                  />
                  {errors.zip && <p className='text-[10px] text-red-500 font-semibold mt-1'>{errors.zip}</p>}
                </div>

                <div className='sm:col-span-2'>
                  <label htmlFor='phone' className='block px-2 text-xs font-bold text-gray-700 uppercase tracking-wide mb-1'>
                    Phone Number (Optional)
                  </label>
                  <input
                    id='phone'
                    type='tel'
                    name='phone'
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder='+1 (555) 000-0000'
                    className='w-full bg-white border border-gray-300 rounded-2xl px-4 py-3 text-xs outline-none focus:border-black transition-colors'
                  />
                </div>
              </div>

              {/* ORDER SUMMARRY */}
              <div className='bg-white p-4 rounded-2xl border border-gray-200 space-y-2 text-xs text-gray-700 mt-4'>
                <div className='flex justify-between font-semibold'>
                  <span>Items Subtotal:</span>
                  <span>{currencyFormatter.format(subtotal)}</span>
                </div>
                <div className='flex justify-between font-semibold'>
                  <span>Shipping:</span>
                  <span>{shippingCost === 0 ? 'FREE' : currencyFormatter.format(shippingCost)}</span>
                </div>
                <div className='flex justify-between font-bold text-gray-950 text-sm pt-2 border-t border-gray-100'>
                  <span>Order Total:</span>
                  <span>{currencyFormatter.format(total)}</span>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: PAYMENT FORM */}
          {step === 2 && (
            <div className='space-y-4'>
              <h3 className='text-sm font-extrabold uppercase tracking-wider text-gray-900 flex items-center gap-2'>
                <FiCreditCard /> Select Payment Method
              </h3>

              <div className='grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3'>
                {['card', 'paypal', 'cod'].map((method) => (
                  <button
                    key={method}
                    type='button'
                    onClick={() => setFormData((prev) => ({ ...prev, paymentMethod: method }))}
                    className={`p-3 rounded-2xl border text-xs font-bold uppercase tracking-wider text-center transition-all cursor-pointer ${
                      formData.paymentMethod === method
                        ? 'border-black bg-black text-white shadow-xs'
                        : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                    }`}
                  >
                    {method === 'card' && 'Credit Card'}
                    {method === 'paypal' && 'PayPal'}
                    {method === 'cod' && 'Cash on Delivery'}
                  </button>
                ))}
              </div>

              {formData.paymentMethod === 'card' && (
                <div className='space-y-3 bg-white p-5 rounded-2xl border border-gray-200'>
                  <div>
                    <label htmlFor='cardNumber' className='block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1'>
                      Card Number *
                    </label>
                    <input
                      id='cardNumber'
                      type='text'
                      name='cardNumber'
                      value={formData.cardNumber}
                      onChange={handleInputChange}
                      placeholder='4532 •••• •••• 8921'
                      maxLength={19}
                      className={`w-full bg-[#F4F1EA] border ${errors.cardNumber ? 'border-red-500' : 'border-transparent'} rounded-xl px-4 py-2.5 text-xs outline-none focus:border-black`}
                    />
                    {errors.cardNumber && <p className='text-[10px] text-red-500 font-semibold mt-1'>{errors.cardNumber}</p>}
                  </div>

                  <div className='grid grid-cols-2 gap-3'>
                    <div>
                      <label htmlFor='cardExpiry' className='block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1'>
                        Expiry (MM/YY) *
                      </label>
                      <input
                        id='cardExpiry'
                        type='text'
                        name='cardExpiry'
                        value={formData.cardExpiry}
                        onChange={handleInputChange}
                        placeholder='12/28'
                        maxLength={5}
                        className={`w-full bg-[#F4F1EA] border ${errors.cardExpiry ? 'border-red-500' : 'border-transparent'} rounded-xl px-4 py-2.5 text-xs outline-none focus:border-black`}
                      />
                      {errors.cardExpiry && <p className='text-[10px] text-red-500 font-semibold mt-1'>{errors.cardExpiry}</p>}
                    </div>

                    <div>
                      <label htmlFor='cardCvc' className='block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1'>
                        CVC / CVV *
                      </label>
                      <input
                        id='cardCvc'
                        type='text'
                        name='cardCvc'
                        value={formData.cardCvc}
                        onChange={handleInputChange}
                        placeholder='382'
                        maxLength={4}
                        className={`w-full bg-[#F4F1EA] border ${errors.cardCvc ? 'border-red-500' : 'border-transparent'} rounded-xl px-4 py-2.5 text-xs outline-none focus:border-black`}
                      />
                      {errors.cardCvc && <p className='text-[10px] text-red-500 font-semibold mt-1'>{errors.cardCvc}</p>}
                    </div>
                  </div>
                </div>
              )}

              {formData.paymentMethod === 'paypal' && (
                <div className=' p-4 rounded-2xl text-xs font-semibold text-center'>
                  You will be redirected to PayPal to complete your payment securely.
                </div>
              )}

              {formData.paymentMethod === 'cod' && (
                <div className='p-4 rounded-2xl text-xs font-semibold text-center'>
                  Pay in cash upon delivery of your order.
                </div>
              )}
            </div>
          )}

          {/* STEP 3: ORDER CONFIRMATION */}
          {step === 3 && (
            <div className='text-center space-y-6 py-4'>
              <div className='flex justify-center'>
                <div className='bg-green-100 p-4 rounded-full text-green-600 text-4xl animate-bounce-short'>
                  <FiCheckCircle />
                </div>
              </div>

              <div className='space-y-2'>
                <h3 className='text-2xl font-extrabold text-gray-950 tracking-tight'>
                  Thank you for your order!
                </h3>
                <p className='text-xs flex flex-col gap-1 gray-600 max-w-md mx-auto'>
                  Your order has been placed successfully. A confirmation email has been sent to{' '}
                  <span className='font-bold text-gray-900'>{formData.email || 'your email'}</span>
                </p>
              </div>

              <div className='bg-white p-6 rounded-2xl border border-gray-200 text-left space-y-3 text-xs'>
                <div className='flex justify-between border-b border-gray-100 pb-2'>
                  <span className='font-bold text-gray-500 uppercase tracking-wider'>Order ID:</span>
                  <span className='font-mono font-extrabold text-gray-950'>{orderId}</span>
                </div>
                <div className='flex justify-between border-b border-gray-100 pb-2'>
                  <span className='font-bold text-gray-500 uppercase tracking-wider'>Shipping To:</span>
                  <span className='font-bold text-gray-900'>{formData.fullName}, {formData.city}</span>
                </div>
                <div className='flex justify-between border-b border-gray-100 pb-2'>
                  <span className='font-bold text-gray-500 uppercase tracking-wider'>Estimated Delivery:</span>
                  <span className='font-bold text-green-700'>3-5 Business Days</span>
                </div>
                <div className='flex justify-between pt-1 text-sm font-extrabold text-gray-950'>
                  <span>Total Amount Paid:</span>
                  <span>{currencyFormatter.format(total)}</span>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* MODAL FOOTER */}
        <div className='p-6 bg-white border-t border-gray-200 flex justify-between items-center sm:shrink-0'>
          {step > 1 && step < 3 ? (
            <button
              onClick={() => setStep(1)}
              className='text-xs font-bold uppercase tracking-wider text-gray-700 hover:text-black flex items-center gap-1.5 cursor-pointer'
            >
              <FiArrowLeft /> Back
            </button>
          ) : (
            <div />
          )}

          {step < 3 ? (
            <button
              onClick={handleNext}
              className='bg-[#212121] text-white text-xs font-bold uppercase tracking-wider px-8 py-3.5 rounded-full hover:bg-black transition-all flex items-center gap-2 cursor-pointer shadow-sm ml-auto'
            >
              {step === 1 ? 'Continue to Payment' : `Pay ${currencyFormatter.format(total)}`}
              <FiArrowRight />
            </button>
          ) : (
            <button
              onClick={handleClose}
              className='w-full bg-[#212121] text-white text-xs font-bold uppercase tracking-wider py-4 rounded-full hover:bg-black transition-all cursor-pointer shadow-sm'
            >
              Back to Shopping
            </button>
          )}
        </div>

      </div>
    </div>
  )
}

export default CheckoutModal
