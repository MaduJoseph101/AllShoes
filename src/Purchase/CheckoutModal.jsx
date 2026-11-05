import { useState, useCallback, useRef } from 'react'
import { useCart } from '../CartContext'
import { FiCheckCircle, FiArrowRight, FiArrowLeft } from 'react-icons/fi'
import { RxCross2 } from 'react-icons/rx'
import useFocusTrap from '../useFocusTrap'
import { calculateOrderTotals } from './pricing'

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
})

function CheckoutModal() {
  const { isCheckoutOpen, closeCheckout, subtotal, clearCart, user, checkoutDiscount } = useCart()
  if (!isCheckoutOpen) return null

  return (
    <CheckoutDialog
      closeCheckout={closeCheckout}
      subtotal={subtotal}
      clearCart={clearCart}
      user={user}
      checkoutDiscount={checkoutDiscount}
    />
  )
}

function CheckoutDialog({ closeCheckout, subtotal, clearCart, user, checkoutDiscount }) {
  const [step, setStep] = useState(1) // 1: Shipping, 2: Payment, 3: Confirmation
  const dialogRef = useRef(null)

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

  const handleClose = useCallback(() => {
    closeCheckout()
    if (step === 3) {
      setStep(1)
    }
  }, [closeCheckout, step])

  useFocusTrap(dialogRef, true, handleClose)

  const [orderId, setOrderId] = useState('')
  const [completedOrder, setCompletedOrder] = useState(null)
  const [errors, setErrors] = useState({})

  const { discount, shippingCost, tax, total } = calculateOrderTotals(
    subtotal,
    checkoutDiscount.discountRate,
  )

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
      const generatedId = `ALL-${Math.floor(100000 + Math.random() * 900000)}`
      setOrderId(generatedId)
      setCompletedOrder({
        ...calculateOrderTotals(subtotal, checkoutDiscount.discountRate),
        promoCode: checkoutDiscount.promoCode,
      })
      setStep(3)
      clearCart()
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="checkout-title"
      ref={dialogRef}
      className="fixed inset-0 z-50 overflow-y-auto font-jakarta flex items-center justify-center p-4 sm:p-6"
    >
      {/* BACKDROP */}
      <div className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity duration-300" onClick={handleClose} aria-hidden="true" />

      {/* MODAL CARD */}
      <div className="relative bg-white rounded-3xl max-w-xl w-full shadow-2xl overflow-hidden border border-black/[0.06] z-10 flex flex-col max-h-[90vh]">
        
        {/* HEADER */}
        <div className="p-6 border-b border-black/[0.06] flex items-center justify-between shrink-0">
          <div>
            <h2 id="checkout-title" className="text-base sm:text-lg font-semibold tracking-tight text-neutral-900">
              {step === 3 ? 'Order Confirmed' : 'Checkout'}
            </h2>
            {step < 3 && (
              <p className="text-xs text-neutral-400 font-light mt-0.5">
                Step {step} of 2 — {step === 1 ? 'Shipping Destination' : 'Payment Details'}
              </p>
            )}
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 text-neutral-400 hover:text-black rounded-full hover:bg-neutral-100 transition-colors cursor-pointer"
            aria-label="Close checkout"
          >
            <RxCross2 className="text-lg" />
          </button>
        </div>

        {/* STEP PROGRESS */}
        {step < 3 && (
          <div className="bg-[#FBFBFD] px-6 py-3 border-b border-black/[0.04] flex items-center gap-6 text-xs text-neutral-500">
            <span className={`flex items-center gap-2 ${step >= 1 ? 'text-black font-medium' : ''}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step >= 1 ? 'bg-black text-white' : 'bg-neutral-200'}`}>1</span>
              Shipping
            </span>
            <span className="text-neutral-300">/</span>
            <span className={`flex items-center gap-2 ${step >= 2 ? 'text-black font-medium' : ''}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step >= 2 ? 'bg-black text-white' : 'bg-neutral-200'}`}>2</span>
              Payment
            </span>
          </div>
        )}

        <div className="p-6 sm:p-8 space-y-6 flex-1 overflow-y-auto">
          
          {/* STEP 1: SHIPPING FORM */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="fullName" className="block text-xs font-medium text-neutral-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    id="fullName"
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="Jane Doe"
                    aria-describedby={errors.fullName ? "fullName-err" : undefined}
                    aria-invalid={!!errors.fullName}
                    className={`w-full bg-[#F5F5F7] border ${errors.fullName ? 'border-red-400' : 'border-transparent'} rounded-xl px-4 py-3 text-xs outline-none focus:bg-white focus:ring-2 focus:ring-black/10 transition-all`}
                  />
                  {errors.fullName && <p id="fullName-err" className="text-[10px] text-red-500 mt-1">{errors.fullName}</p>}
                </div>

                <div>
                  <label htmlFor="email" className="block text-xs font-medium text-neutral-700 mb-1">
                    Email Address *
                  </label>
                  <input
                    id="email"
                    required
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="jane@example.com"
                    aria-describedby={errors.email ? "email-err" : undefined}
                    aria-invalid={!!errors.email}
                    className={`w-full bg-[#F5F5F7] border ${errors.email ? 'border-red-400' : 'border-transparent'} rounded-xl px-4 py-3 text-xs outline-none focus:bg-white focus:ring-2 focus:ring-black/10 transition-all`}
                  />
                  {errors.email && <p id="email-err" className="text-[10px] text-red-500 mt-1">{errors.email}</p>}
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="address" className="block text-xs font-medium text-neutral-700 mb-1">
                    Street Address *
                  </label>
                  <input
                    id="address"
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="123 Serenity Blvd, Suite 4"
                    aria-describedby={errors.address ? "address-err" : undefined}
                    aria-invalid={!!errors.address}
                    className={`w-full bg-[#F5F5F7] border ${errors.address ? 'border-red-400' : 'border-transparent'} rounded-xl px-4 py-3 text-xs outline-none focus:bg-white focus:ring-2 focus:ring-black/10 transition-all`}
                  />
                  {errors.address && <p id="address-err" className="text-[10px] text-red-500 mt-1">{errors.address}</p>}
                </div>

                <div>
                  <label htmlFor="city" className="block text-xs font-medium text-neutral-700 mb-1">
                    City *
                  </label>
                  <input
                    id="city"
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="Stockholm"
                    aria-describedby={errors.city ? "city-err" : undefined}
                    aria-invalid={!!errors.city}
                    className={`w-full bg-[#F5F5F7] border ${errors.city ? 'border-red-400' : 'border-transparent'} rounded-xl px-4 py-3 text-xs outline-none focus:bg-white focus:ring-2 focus:ring-black/10 transition-all`}
                  />
                  {errors.city && <p id="city-err" className="text-[10px] text-red-500 mt-1">{errors.city}</p>}
                </div>

                <div>
                  <label htmlFor="zip" className="block text-xs font-medium text-neutral-700 mb-1">
                    ZIP Code *
                  </label>
                  <input
                    id="zip"
                    type="text"
                    name="zip"
                    value={formData.zip}
                    onChange={handleInputChange}
                    placeholder="111 22"
                    aria-describedby={errors.zip ? "zip-err" : undefined}
                    aria-invalid={!!errors.zip}
                    className={`w-full bg-[#F5F5F7] border ${errors.zip ? 'border-red-400' : 'border-transparent'} rounded-xl px-4 py-3 text-xs outline-none focus:bg-white focus:ring-2 focus:ring-black/10 transition-all`}
                  />
                  {errors.zip && <p id="zip-err" className="text-[10px] text-red-500 mt-1">{errors.zip}</p>}
                </div>
              </div>

              {/* Order summary tile */}
              <div className="bg-[#F5F5F7] p-4 rounded-2xl space-y-2 text-xs text-neutral-600 mt-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-medium text-neutral-900">{currencyFormatter.format(subtotal)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-700">
                    <span>Discount{checkoutDiscount.promoCode ? ` (${checkoutDiscount.promoCode})` : ''}</span>
                    <span className="font-medium">-{currencyFormatter.format(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="font-medium text-neutral-900">{shippingCost === 0 ? 'Free' : currencyFormatter.format(shippingCost)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated Tax (8%)</span>
                  <span className="font-medium text-neutral-900">{currencyFormatter.format(tax)}</span>
                </div>
                <div className="flex justify-between text-neutral-900 font-semibold pt-2 border-t border-black/[0.06]">
                  <span>Total Due</span>
                  <span>{currencyFormatter.format(total)}</span>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: PAYMENT FORM */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-2">
                {['card', 'paypal', 'cod'].map((method) => (
                  <button
                    key={method}
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, paymentMethod: method }))}
                    className={`p-3 rounded-2xl text-xs font-medium text-center transition-all cursor-pointer border ${
                      formData.paymentMethod === method
                        ? 'border-black bg-black text-white shadow-2xs'
                        : 'border-black/[0.08] bg-[#F5F5F7] text-neutral-700 hover:bg-neutral-200'
                    }`}
                  >
                    {method === 'card' && 'Credit Card'}
                    {method === 'paypal' && 'PayPal'}
                    {method === 'cod' && 'Delivery'}
                  </button>
                ))}
              </div>

              {formData.paymentMethod === 'card' && (
                <div className="space-y-3 bg-[#F5F5F7] p-5 rounded-2xl">
                  <div>
                    <label htmlFor="cardNumber" className="block text-xs font-medium text-neutral-700 mb-1">
                      Card Number *
                    </label>
                    <input
                      id="cardNumber"
                      type="text"
                      name="cardNumber"
                      value={formData.cardNumber}
                      onChange={handleInputChange}
                      placeholder="4532 •••• •••• 8921"
                      maxLength={19}
                      className="w-full bg-white rounded-xl px-4 py-2.5 text-xs outline-none focus:ring-2 focus:ring-black/10"
                    />
                    {errors.cardNumber && <p className="text-[10px] text-red-500 mt-1">{errors.cardNumber}</p>}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label htmlFor="cardExpiry" className="block text-xs font-medium text-neutral-700 mb-1">
                        Expiry (MM/YY) *
                      </label>
                      <input
                        id="cardExpiry"
                        type="text"
                        name="cardExpiry"
                        value={formData.cardExpiry}
                        onChange={handleInputChange}
                        placeholder="12/28"
                        maxLength={5}
                        className="w-full bg-white rounded-xl px-4 py-2.5 text-xs outline-none focus:ring-2 focus:ring-black/10"
                      />
                      {errors.cardExpiry && <p className="text-[10px] text-red-500 mt-1">{errors.cardExpiry}</p>}
                    </div>

                    <div>
                      <label htmlFor="cardCvc" className="block text-xs font-medium text-neutral-700 mb-1">
                        CVC *
                      </label>
                      <input
                        id="cardCvc"
                        type="text"
                        name="cardCvc"
                        value={formData.cardCvc}
                        onChange={handleInputChange}
                        placeholder="382"
                        maxLength={4}
                        className="w-full bg-white rounded-xl px-4 py-2.5 text-xs outline-none focus:ring-2 focus:ring-black/10"
                      />
                      {errors.cardCvc && <p className="text-[10px] text-red-500 mt-1">{errors.cardCvc}</p>}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 3: ORDER CONFIRMED */}
          {step === 3 && (
            <div className="text-center space-y-6 py-6">
              <div className="w-14 h-14 bg-neutral-900 text-white rounded-full flex items-center justify-center mx-auto text-2xl shadow-sm">
                <FiCheckCircle />
              </div>

              <div className="space-y-1">
                <h3 className="text-2xl font-semibold tracking-tight text-neutral-900">
                  Thank you for your order
                </h3>
                <p className="text-xs text-neutral-500 font-light">
                  A confirmation receipt has been sent to <span className="font-medium text-neutral-900">{formData.email || 'your email'}</span>.
                </p>
              </div>

              <div className="bg-[#F5F5F7] p-5 rounded-2xl text-left space-y-2.5 text-xs">
                <div className="flex justify-between border-b border-black/[0.04] pb-2">
                  <span className="text-neutral-500">Order Reference</span>
                  <span className="font-mono font-medium text-neutral-900">{orderId}</span>
                </div>
                <div className="flex justify-between border-b border-black/[0.04] pb-2">
                  <span className="text-neutral-500">Delivering To</span>
                  <span className="font-medium text-neutral-900">{formData.fullName}, {formData.city}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Subtotal</span>
                  <span>{currencyFormatter.format(completedOrder?.subtotal ?? 0)}</span>
                </div>
                {(completedOrder?.discount ?? 0) > 0 && (
                  <div className="flex justify-between text-emerald-700">
                    <span>Discount{completedOrder.promoCode ? ` (${completedOrder.promoCode})` : ''}</span>
                    <span>-{currencyFormatter.format(completedOrder.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-neutral-500">Shipping</span>
                  <span>{completedOrder?.shippingCost === 0 ? 'Free' : currencyFormatter.format(completedOrder?.shippingCost ?? 0)}</span>
                </div>
                <div className="flex justify-between border-b border-black/[0.04] pb-2">
                  <span className="text-neutral-500">Tax</span>
                  <span>{currencyFormatter.format(completedOrder?.tax ?? 0)}</span>
                </div>
                <div className="flex justify-between pt-1 font-semibold text-neutral-900">
                  <span>Amount Paid</span>
                  <span>{currencyFormatter.format(completedOrder?.total ?? total)}</span>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* FOOTER */}
        <div className="p-6 bg-[#FBFBFD] border-t border-black/[0.06] flex justify-between items-center shrink-0">
          {step > 1 && step < 3 ? (
            <button
              onClick={() => setStep(1)}
              className="text-xs font-medium text-neutral-600 hover:text-black flex items-center gap-1.5 cursor-pointer"
            >
              <FiArrowLeft /> Back
            </button>
          ) : (
            <div />
          )}

          {step < 3 ? (
            <button
              onClick={handleNext}
              className="bg-[#000000] hover:bg-black text-white text-xs font-semibold tracking-wider uppercase px-8 py-3.5 rounded-full transition-all flex items-center gap-2 cursor-pointer shadow-sm ml-auto"
            >
              {step === 1 ? 'Continue to Payment' : `Complete ${currencyFormatter.format(total)}`}
              <FiArrowRight />
            </button>
          ) : (
            <button
              onClick={handleClose}
              className="w-full bg-[#000000] hover:bg-black text-white text-xs font-semibold tracking-wider uppercase py-3.5 rounded-full transition-all cursor-pointer shadow-sm"
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
