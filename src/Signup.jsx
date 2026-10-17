import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useCart } from './CartContext'
import FadeIn from './FadeIn'
import {
  FiUser,
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff,
  FiMapPin,
  FiPhone,
  FiCheckCircle,
  FiTrash2,
  FiEdit3,
  FiShoppingBag,
  FiArrowRight,
  FiHeart,
  FiX,
  FiLogOut,
  FiAlertCircle
} from 'react-icons/fi'

function Signup() {
  const {
    user,
    registerUser,
    loginUser,
    updateUser,
    deleteUser,
    logoutUser,
    openCheckout,
    wishlistItems,
    cartItems
  } = useCart()

  const [searchParams] = useSearchParams()
  const initialTab = searchParams.get('tab') === 'signin' ? 'signin' : 'signup'

  // Tab: 'SINGUP' or 'SIGNIN'
  const [authMode, setAuthMode] = useState(initialTab)
  const [showPassword, setShowPassword] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [notification, setNotification] = useState(null) // { type: 'success' | 'error', message: '' }

  // Sync tab with URL search parameter if changed
  useEffect(() => {
    const tab = searchParams.get('tab')
    if (tab === 'signin' || tab === 'signup') {
      setAuthMode(tab)
    }
  }, [searchParams])

  // SIGNUP/SIGNIN
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    address: '',
    city: '',
    zip: '',
    phone: '',
  })

  // EDIT FORM STATES
  const [editData, setEditData] = useState({
    fullName: '',
    email: '',
    address: '',
    city: '',
    zip: '',
    phone: '',
  })

  const [errors, setErrors] = useState({})

  const showToast = (type, message) => {
    setNotification({ type, message })
    setTimeout(() => {
      setNotification(null)
    }, 4500)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

  const handleEditChange = (e) => {
    const { name, value } = e.target
    setEditData((prev) => ({ ...prev, [name]: value }))
  }

  const startEditing = () => {
    if (user) {
      setEditData({
        fullName: user.fullName || '',
        email: user.email || '',
        address: user.address || '',
        city: user.city || '',
        zip: user.zip || '',
        phone: user.phone || '',
      })
      setIsEditing(true)
    }
  }

  const handleSaveEdit = (e) => {
    e.preventDefault()
    if (!editData.fullName.trim() || !editData.email.trim()) {
      showToast('error', 'Full Name and Email are required.')
      return
    }
    updateUser(editData)
    setIsEditing(false)
    showToast('success', 'Your profile and shipping details have been updated.')
  }

  const validateSignup = () => {
    const newErrors = {}
    if (!formData.fullName.trim()) newErrors.fullName = 'Full Name is required'
    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }
    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validateSignin = () => {
    const newErrors = {}
    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }
    if (!formData.password) {
      newErrors.password = 'Password is required'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (authMode === 'signup') {
      if (!validateSignup()) return

      const newUser = {
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        password: formData.password,
        address: formData.address.trim(),
        city: formData.city.trim(),
        zip: formData.zip.trim(),
        phone: formData.phone.trim(),
        registeredAt: new Date().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        }),
      }

      const res = registerUser(newUser)
      if (!res.success) {
        showToast('error', res.message)
        return
      }

      showToast('success', `Welcome to AllShoes, ${newUser.fullName}! Your account has been created.`)
      setFormData({
        fullName: '',
        email: '',
        password: '',
        address: '',
        city: '',
        zip: '',
        phone: '',
      })
    } else {
      if (!validateSignin()) return

      const res = loginUser({
        email: formData.email.trim(),
        password: formData.password,
      })

      if (!res.success) {
        showToast('error', res.message)
        return
      }

      showToast('success', `Welcome back, ${res.user.fullName || res.user.email}!`)
      setFormData({
        fullName: '',
        email: '',
        password: '',
        address: '',
        city: '',
        zip: '',
        phone: '',
      })
    }
  }

  const handleDeleteAccount = () => {
    deleteUser()
    setShowDeleteConfirm(false)
    setIsEditing(false)
    showToast('success', 'Your account and personal cart have been permanently deleted.')
  }

  const handleSignOut = () => {
    logoutUser()
    setIsEditing(false)
    showToast('success', 'You have been signed out.')
  }

  // SIGNED IN / REGISTERED USER VIEW
  if (user) {
    const initials = user.fullName
      ? user.fullName
          .split(' ')
          .map((n) => n[0])
          .join('')
          .toUpperCase()
          .slice(0, 2)
      : 'AS'

    return (
      <FadeIn>
        <div className='min-h-[85vh] bg-[#ECE9E2] font-jakarta py-10 px-4 sm:px-8'>
          <div className='max-w-4xl mx-auto space-y-6'>

            {/* FLOATING TOAST NOTIFICATION */}
            {notification && (
              <div
                className={`fixed top-20 left-1/2 right-auto -translate-x-1/2 w-[calc(100%-2rem)] sm:left-auto sm:right-4 sm:translate-x-0 sm:w-auto z-50 max-w-md p-4 rounded-2xl shadow-xl border flex items-center justify-between gap-3 transition-all ${
                  notification.type === 'success'
                    ? 'bg-[#212121] text-white border-neutral-700'
                    : 'bg-red-950 text-red-100 border-red-800'
                }`}
              >
                <div className='flex items-center gap-2.5 text-xs font-semibold'>
                  {notification.type === 'success' ? (
                    <FiCheckCircle className='text-base shrink-0 text-white' />
                  ) : (
                    <FiAlertCircle className='text-base shrink-0 text-red-400' />
                  )}
                  <span>{notification.message}</span>
                </div>
                <button
                  onClick={() => setNotification(null)}
                  className='text-white/60 hover:text-white p-1 cursor-pointer'
                >
                  <FiX />
                </button>
              </div>
            )}

            {/* DASHBOARD HEADER */}
            <div className='bg-[#212121] text-white rounded-3xl p-6 sm:p-10 shadow-xl border border-neutral-800 flex flex-col md:flex-row md:items-center justify-between gap-6'>
              <div className='flex items-center gap-5'>
                <div className='w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-[#333] to-[#555] border-2 border-neutral-700 flex items-center justify-center text-white text-2xl font-black shadow-inner'>
                  {initials}
                </div>
                <div>
                
                  <p className='text-xs sm:text-sm text-gray-400 font-medium'>{user.email}</p>
                  <p className='text-[11px] text-gray-500 mt-1'>
                    Member since {user.registeredAt || 'Recently'}
                  </p>
                </div>
              </div>

              {/* CTAS */}
              <div className='flex flex-wrap items-center gap-2.5'>
                <button
                  onClick={startEditing}
                  className='inline-flex items-center gap-2 bg-white text-black hover:bg-gray-100 font-bold text-xs uppercase tracking-wider px-5 py-3 rounded-full transition-all cursor-pointer shadow-sm hover:scale-[1.02] active:scale-[0.98]'
                >
                  <FiEdit3 />
                  Edit Details
                </button>

                <button
                  onClick={handleSignOut}
                  className='inline-flex items-center gap-2 bg-neutral-800 text-gray-300 hover:text-white hover:bg-neutral-700 border border-neutral-700 font-bold text-xs uppercase tracking-wider px-4 py-3 rounded-full transition-all cursor-pointer'
                  title='Sign out of this session'
                >
                  <FiLogOut />
                  Sign Out
                </button>

                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className='inline-flex items-center gap-2 bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-600 hover:text-white font-bold text-xs uppercase tracking-wider px-4 py-3 rounded-full transition-all cursor-pointer'
                  title='Permanently delete account'
                >
                  <FiTrash2 />
                  Delete Account
                </button>
              </div>
            </div>

            {/* DELETE ACCOUNT MODAL CONFIRMATION */}
            {showDeleteConfirm && (
              <div className='fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4'>
                <div className='bg-[#ECE9E2] border border-gray-300 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-5 text-center animate-in fade-in zoom-in-95 duration-200'>
                  {/* <div className='w-14 h-14 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center mx-auto text-2xl shadow-xs'>
                    <FiTrash2 />
                  </div> */}
                  <div className='space-y-2'>
                    <h3 className='text-xl font-black text-gray-950 uppercase tracking-wide'>
                      Delete Account
                    </h3>
                    <p className='text-xs text-gray-600 leading-relaxed'>
                      Are you sure you want to permanently delete your account? This will remove your
                      saved profile, default shipping address, and your personal cart and wishlist.
                    </p>
                  </div>
                  <div className='flex items-center justify-center gap-4 pt-2'>
                    <button
                      onClick={() => setShowDeleteConfirm(false)}
                      className='bg-white text-gray-800 font-bold text-xs uppercase tracking-wider px-6 py-3 rounded-full hover:bg-gray-100 transition-colors border border-gray-300 cursor-pointer'
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleDeleteAccount}
                      className='bg-red-600 text-white font-bold text-xs uppercase tracking-wider px-6 py-3 rounded-full hover:bg-red-700 transition-colors cursor-pointer shadow-sm'
                    >
                      Yes, Delete Account
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* EDIT PROFILE DRAWER / CARD */}
            {isEditing && (
              <div className='bg-white rounded-3xl p-6 sm:p-8 border border-gray-300/80 shadow-md space-y-6 animate-in fade-in duration-200'>
                <div className='flex items-center justify-between border-b border-gray-100 pb-4'>
                  <div>
                    <h2 className='text-base font-black uppercase tracking-wide text-gray-950'>
                      Edit Profile & Shipping Information
                    </h2>
                    <p className='text-xs text-gray-500'>
                      Update your account information and default shipping destination.
                    </p>
                  </div>
                  <button
                    onClick={() => setIsEditing(false)}
                    className='text-gray-400 hover:text-black p-2 rounded-full cursor-pointer'
                  >
                    <FiX className='text-lg' />
                  </button>
                </div>

                <form onSubmit={handleSaveEdit} className='space-y-4'>
                  <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                    <div>
                      <label className='block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1'>
                        Full Name *
                      </label>
                      <input
                        type='text'
                        name='fullName'
                        value={editData.fullName}
                        onChange={handleEditChange}
                        className='w-full bg-[#ECE9E2]/50 border border-gray-300 rounded-2xl px-4 py-3 text-xs outline-none focus:border-black transition-colors'
                      />
                    </div>
                    <div>
                      <label className='block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1'>
                        Email Address *
                      </label>
                      <input
                        type='email'
                        name='email'
                        value={editData.email}
                        onChange={handleEditChange}
                        className='w-full bg-[#ECE9E2]/50 border border-gray-300 rounded-2xl px-4 py-3 text-xs outline-none focus:border-black transition-colors'
                      />
                    </div>
                    <div>
                      <label className='block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1'>
                        Phone Number
                      </label>
                      <input
                        type='tel'
                        name='phone'
                        value={editData.phone}
                        onChange={handleEditChange}
                        placeholder='+1 (555) 000-0000'
                        className='w-full bg-[#ECE9E2]/50 border border-gray-300 rounded-2xl px-4 py-3 text-xs outline-none focus:border-black transition-colors'
                      />
                    </div>
                    <div>
                      <label className='block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1'>
                        Street Address
                      </label>
                      <input
                        type='text'
                        name='address'
                        value={editData.address}
                        onChange={handleEditChange}
                        placeholder='123 Main St, Apt 4B'
                        className='w-full bg-[#ECE9E2]/50 border border-gray-300 rounded-2xl px-4 py-3 text-xs outline-none focus:border-black transition-colors'
                      />
                    </div>
                    <div>
                      <label className='block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1'>
                        City
                      </label>
                      <input
                        type='text'
                        name='city'
                        value={editData.city}
                        onChange={handleEditChange}
                        placeholder='New York'
                        className='w-full bg-[#ECE9E2]/50 border border-gray-300 rounded-2xl px-4 py-3 text-xs outline-none focus:border-black transition-colors'
                      />
                    </div>
                    <div>
                      <label className='block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1'>
                        ZIP / Postal Code
                      </label>
                      <input
                        type='text'
                        name='zip'
                        value={editData.zip}
                        onChange={handleEditChange}
                        placeholder='10001'
                        className='w-full bg-[#ECE9E2]/50 border border-gray-300 rounded-2xl px-4 py-3 text-xs outline-none focus:border-black transition-colors'
                      />
                    </div>
                  </div>

                  <div className='flex justify-end gap-3 pt-4 border-t border-gray-100'>
                    <button
                      type='button'
                      onClick={() => setIsEditing(false)}
                      className='bg-gray-100 text-gray-700 font-bold text-xs uppercase tracking-wider px-6 py-3 rounded-full hover:bg-gray-200 transition-colors cursor-pointer'
                    >
                      Cancel
                    </button>
                    <button
                      type='submit'
                      className='bg-[#212121] text-white font-bold text-xs uppercase tracking-wider px-8 py-3 rounded-full hover:bg-black transition-all cursor-pointer shadow-sm'
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* DETAILS GRID */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>

              {/* SHIPPING INFORMATION CARD */}
              <div className='bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/80 shadow-sm flex flex-col justify-between'>
                <div className='space-y-4'>
                  <div className='flex items-center justify-center'>
                    <h3 className='text-xs font-extrabold uppercase tracking-wider text-gray-900'>
                       Shipping Address
                    </h3>
                   
                  </div>

                  <div className='bg-[#ECE9E2]/60 rounded-2xl p-4 text-xs space-y-1.5 border border-gray-200/60'>
                    <p className='font-bold text-gray-900 text-sm'>
                      {user.fullName || 'Registered Member'}
                    </p>
                    <p className='text-gray-700'>
                      {user.address ? (
                        user.address
                      ) : (
                        <span className='text-gray-400 italic'>No street address specified</span>
                      )}
                    </p>
                    <p className='text-gray-700'>
                      {user.city || user.zip ? (
                        `${user.city || ''} ${user.zip ? `— ${user.zip}` : ''}`
                      ) : (
                        <span className='text-gray-400 italic'>City & ZIP not set</span>
                      )}
                    </p>
                    <p className='text-gray-600 pt-1'>
                      {user.phone ? (
                        `Phone: ${user.phone}`
                      ) : (
                        <span className='text-gray-400 italic'>Phone number not set</span>
                      )}
                    </p>
                  </div>

                  <div className='rounded-2xl p-3 flex items-start gap-2.5 text-[11px] text-black'>
                    <span>
                      When you proceed to checkout, these shipping details will automatically prefill Step 1 for instant checkout.
                    </span>
                  </div>
                </div>

              </div>

              {/* ACCOUNT PREFERENCES / TIED CART & SAVED OVERVIEW */}
              <div className='bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/80 shadow-sm flex flex-col justify-between'>
                <div className='space-y-4'>
                  {/* <div className='flex items-center justify-center'>
                    <h3 className='text-xs font-extrabold uppercase tracking-wider text-gray-900'>
                      Account Overview
                    </h3>
                  </div> */}

                  <div className='space-y-3 text-xs'>

                    <Link to='/cart' className='flex items-center justify-between p-3.5 rounded-2xl bg-gray-50 border border-gray-200/60 hover:scale-[1.01] transition-all duration-100 ease-linear' >
                          <div className='flex items-center gap-2'>
                          <FiShoppingBag className='text-gray-500' />
                          <span className='font-semibold text-gray-700'> Cart</span>
                        </div>
                        <span className='font-bold text-gray-950 bg-white px-2.5 py-1 rounded-xl border border-gray-200'>
                          {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}
                        </span>
                      </Link>

                  
                      <Link to='/saved' className='flex items-center justify-between p-3.5 rounded-2xl bg-gray-50 border border-gray-200/60 hover:scale-[1.01] transition-all duration-100 ease-linear' >
                          <div className='flex items-center gap-2'>
                          <FiHeart className='text-red-500' />
                          <span className='font-semibold text-gray-700'> Wishlist</span>
                        </div>
                        <span className='font-bold text-gray-950 bg-white px-2.5 py-1 rounded-xl border border-gray-200'>
                          {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'}
                        </span>
                      </Link>

                      <Link to='/saved' className='flex items-center justify-between p-3.5 rounded-2xl bg-gray-50 border border-gray-200/60 hover:scale-[1.01] transition-all duration-100 ease-linear' >
                          <div className='flex items-center gap-2'>
                           <FiShoppingBag className='text-gray-500' />

                          <span className='font-semibold text-gray-700'> Browse Catalog</span>
                        </div>

                        <FiArrowRight/>
                       
                      </Link>
                  </div>
                </div>
              </div>
              
              
            </div>

          </div>
        </div>
      </FadeIn>
    )
  }

  // UNREGISTERED / SIGN UP & SIGN IN FORM
  return (
    <FadeIn>
      <div className='min-h-[calc(100vh-4rem)] bg-[#ECE9E2] font-jakarta py-4 sm:py-6 lg:py-8 px-4 sm:px-6 lg:px-8 flex items-center justify-center'>
        <div className={`w-full transition-all duration-300 ${authMode === 'signup' ? 'max-w-4xl' : 'max-w-lg'}`}>

          {/* FLOATING TOAST NOTIFICATION */}
          {notification && (
            <div
              className={`fixed top-20 left-1/2 right-auto -translate-x-1/2 w-[calc(100%-2rem)] sm:left-auto sm:right-4 sm:translate-x-0 sm:w-auto z-50 max-w-md p-4 rounded-2xl shadow-xl border flex items-center justify-between gap-3 transition-all ${
                notification.type === 'success'
                  ? 'bg-[#212121] text-white border-neutral-700'
                  : 'bg-red-950 text-red-100 border-red-800'
              }`}
            >
              <div className='flex items-center gap-2.5 text-xs font-semibold'>
                {notification.type === 'success' ? (
                  <FiCheckCircle className='text-base shrink-0 text-white' />
                ) : (
                  <FiAlertCircle className='text-base shrink-0 text-red-400' />
                )}
                <span>{notification.message}</span>
              </div>
              <button
                onClick={() => setNotification(null)}
                className='text-white/60 hover:text-white p-1 cursor-pointer'
              >
                <FiX />
              </button>
            </div>
          )}

          {/* MAIN CARD */}
          <div className='bg-white rounded-3xl p-6 sm:p-8 lg:p-9 border border-gray-200/80 shadow-lg space-y-5'>

            {/* CARD HEADER & TAB SELECTOR */}
            <div className='flex flex-col gap-4 pb-5 border-b border-gray-100'>
              <div className='flex items-center gap-3'>
              
                <div className=' flex w-full flex-col gap-1 justify-center items-center'>
                  <h1 className='text-base lg:text-lg font-black text-gray-950 uppercase tracking-tight leading-tight'>
                    {authMode === 'signup' ? 'Create an Account' : 'Welcome Back'}
                  </h1>
                  
                </div>
              </div>

              {/* TABS */}
              <div className='inline-flex p-1.5 bg-[#ECE9E2] rounded-full border border-gray-200 text-2xl font-bold uppercase tracking-wider self-center shrink-0'>
                <button
                  type='button'
                  onClick={() => {
                    setAuthMode('signin')
                    setErrors({})
                  }}
                  className={`px-4 sm:px-5 py-1.5 rounded-full transition-all cursor-pointer text-[11px] ${
                    authMode === 'signin'
                      ? 'bg-[#212121] text-white shadow-xs'
                      : 'text-gray-600 hover:text-black'
                  }`}
                >
                  Sign In
                </button>
                <button
                  type='button'
                  onClick={() => {
                    setAuthMode('signup')
                    setErrors({})
                  }}
                  className={`px-4 py-3 sm:px-5  rounded-full transition-all cursor-pointer text-[11px] ${
                    authMode === 'signup'
                      ? 'bg-[#212121] text-white shadow-xs'
                      : 'text-gray-600 hover:text-black'
                  }`}
                >
                  Create Account
                </button>
              </div>
            </div>

            {/* FORM */}
            <form onSubmit={handleSubmit} className='space-y-3'>

              {authMode === 'signup' ? (
                /* DESKTOP GRID */
                <div className='grid grid-cols-1 lg:grid-cols-2 gap-3.5 lg:gap-4'>

                  {/* LEFT COLUMN: ACCOUNT CREDENTIALS */}
                  <div className='space-y-2.5 bg-[#ECE9E2]/30 p-3 sm:p-4 rounded-2xl border border-gray-200/60 flex flex-col justify-between '>
                    <div className='space-y-4'>
                      <div className='flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-wider text-gray-900 border-b border-gray-200/60 pb-1.5'>
                        <FiUser className='text-xs' />
                        <span>Account Credentials</span>
                      </div>

                      {/* FULL NAME */}
                      <div>
                        <label
                          htmlFor='fullName'
                          className='block px-2 text-xs font-bold text-gray-700 uppercase tracking-wide mb-1'
                        >
                          Full Name *
                        </label>
                        <div className='relative'>
                          <input
                            id='fullName'
                            type='text'
                            name='fullName'
                            value={formData.fullName}
                            onChange={handleInputChange}
                            placeholder='James Stephen'
                            className={`w-full bg-white border ${
                              errors.fullName ? 'border-red-500' : 'border-gray-300'
                            } rounded-2xl pl-9 pr-4 py-3 text-xs outline-none focus:border-black transition-colors`}
                          />
                          <FiUser className='absolute left-3 top-3.5 text-gray-400 text-xs' />
                        </div>
                        {errors.fullName && (
                          <p className='text-[10px] text-red-500 font-semibold mt-1 px-1'>{errors.fullName}</p>
                        )}
                      </div>

                      {/* EMAIL */}
                      <div>
                        <label
                          htmlFor='email'
                          className='block px-2 text-xs font-bold text-gray-700 uppercase tracking-wide mb-1'
                        >
                          Email Address *
                        </label>
                        <div className='relative'>
                          <input
                            id='email'
                            type='email'
                            name='email'
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder='james@example.com'
                            className={`w-full bg-white border ${
                              errors.email ? 'border-red-500' : 'border-gray-300'
                            } rounded-2xl pl-9 pr-4 py-3 text-xs outline-none focus:border-black transition-colors`}
                          />
                          <FiMail className='absolute left-3 top-3.5 text-gray-400 text-xs' />
                        </div>
                        {errors.email && (
                          <p className='text-[10px] text-red-500 font-semibold mt-1 px-1'>{errors.email}</p>
                        )}
                      </div>

                      {/* PASSWORD */}
                      <div>
                        <label
                          htmlFor='password'
                          className='block px-2 text-xs font-bold text-gray-700 uppercase tracking-wide mb-1'
                        >
                          Password *
                        </label>
                        <div className='relative'>
                          <input
                            id='password'
                            type={showPassword ? 'text' : 'password'}
                            name='password'
                            value={formData.password}
                            onChange={handleInputChange}
                            placeholder='••••••••'
                            className={`w-full bg-white border ${
                              errors.password ? 'border-red-500' : 'border-gray-300'
                            } rounded-2xl pl-9 pr-4 py-3 text-xs outline-none focus:border-black transition-colors`}
                          />
                          <FiLock className='absolute left-3 top-3.5 text-gray-400 text-xs' />
                          <button
                            type='button'
                            onClick={() => setShowPassword(!showPassword)}
                            className='absolute right-3 top-3.5 text-gray-400 hover:text-gray-700 cursor-pointer'
                          >
                            {showPassword ? <FiEyeOff className='text-xs' /> : <FiEye className='text-xs' />}
                          </button>
                        </div>
                        {errors.password && (
                          <p className='text-[10px] text-red-500 font-semibold mt-1 px-1'>{errors.password}</p>
                        )}
                      </div>
                    </div>

                  
                  </div>

                  {/* RIGHT COLUMN: SHIPPING & AUTOFILL DETAILS */}
                  <div className='space-y-4 bg-[#ECE9E2]/30 p-3 sm:p-4 rounded-2xl border border-gray-200/60'>
                    <div className='flex items-center justify-between border-b border-gray-200/60 pb-1.5'>
                      <div className='flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-wider text-gray-900'>
                        <FiMapPin className='text-xs' />
                        <span>Shipping & Checkout </span>
                      </div>
                     
                    </div>

                    {/* STREET ADDRESS */}
                    <div>
                      <label
                        htmlFor='address'
                        className='block px-2 text-xs font-bold text-gray-700 uppercase tracking-wide mb-1'
                      >
                        Street Address
                      </label>
                      <input
                        id='address'
                        type='text'
                        name='address'
                        value={formData.address}
                        onChange={handleInputChange}
                        placeholder='123 Main St, Apt 4B'
                        className='w-full bg-white border border-gray-300 rounded-2xl px-4 py-3 text-xs outline-none focus:border-black transition-colors'
                      />
                    </div>

                    {/* CITY & ZIP */}
                    <div className='grid grid-cols-2 gap-2'>
                      <div>
                        <label
                          htmlFor='city'
                          className='block px-2 text-xs font-bold text-gray-700 uppercase tracking-wide mb-1'
                        >
                          City
                        </label>
                        <input
                          id='city'
                          type='text'
                          name='city'
                          value={formData.city}
                          onChange={handleInputChange}
                          placeholder='Lagos'
                          className='w-full bg-white border border-gray-300 rounded-2xl px-4 py-3 text-xs outline-none focus:border-black transition-colors'
                        />
                      </div>
                      <div>
                        <label
                          htmlFor='zip'
                          className='block px-2 text-xs font-bold text-gray-700 uppercase tracking-wide mb-1'
                        >
                          ZIP Code
                        </label>
                        <input
                          id='zip'
                          type='text'
                          name='zip'
                          value={formData.zip}
                          onChange={handleInputChange}
                          placeholder='10001'
                          className='w-full bg-white border border-gray-300 rounded-2xl px-4 py-3 text-xs outline-none focus:border-black transition-colors'
                        />
                      </div>
                    </div>

                    {/* PHONE */}
                    <div>
                      <label
                        htmlFor='phone'
                        className='block px-2 text-xs font-bold text-gray-700 uppercase tracking-wide mb-1'
                      >
                        Phone Number
                      </label>
                      <div className='relative'>
                        <input
                          id='phone'
                          type='tel'
                          name='phone'
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder='+234 (555) 000-0000'
                          className='w-full bg-white border border-gray-300 rounded-2xl pl-9 pr-4 py-3 text-xs outline-none focus:border-black transition-colors'
                        />
                        <FiPhone className='absolute left-3 top-3.5 text-gray-400 text-xs' />
                      </div>
                    </div>
                  </div>

                </div>
              ) : (
                /* SIGN IN FORM LAYOUT */
                <div className='space-y-4 py-2 w-full'>
                  {/* EMAIL */}
                  <div>
                    <label
                      htmlFor='email'
                      className='block px-1 text-xs font-bold text-gray-700 uppercase tracking-wide mb-1'
                    >
                      Email Address *
                    </label>
                    <div className='relative'>
                      <input
                        id='email'
                        type='email'
                        name='email'
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder='james@example.com'
                        className={`w-full bg-[#ECE9E2]/50 border ${
                          errors.email ? 'border-red-500' : 'border-gray-300'
                        } rounded-2xl pl-11 pr-4 py-3 text-xs outline-none focus:border-black transition-colors`}
                      />
                      <FiMail className='absolute left-4 top-3.5 text-gray-400 text-sm' />
                    </div>
                    {errors.email && (
                      <p className='text-[10px] text-red-500 font-semibold mt-1 px-1'>{errors.email}</p>
                    )}
                  </div>

                  {/* PASSWORD */}
                  <div>
                    <label
                      htmlFor='password'
                      className='block px-1 text-xs font-bold text-gray-700 uppercase tracking-wide mb-1'
                    >
                      Password *
                    </label>
                    <div className='relative'>
                      <input
                        id='password'
                        type={showPassword ? 'text' : 'password'}
                        name='password'
                        value={formData.password}
                        onChange={handleInputChange}
                        placeholder='••••••••'
                        className={`w-full bg-[#ECE9E2]/50 border ${
                          errors.password ? 'border-red-500' : 'border-gray-300'
                        } rounded-2xl pl-11 pr-11 py-3 text-xs outline-none focus:border-black transition-colors`}
                      />
                      <FiLock className='absolute left-4 top-3.5 text-gray-400 text-sm' />
                      <button
                        type='button'
                        onClick={() => setShowPassword(!showPassword)}
                        className='absolute right-4 top-3.5 text-gray-400 hover:text-gray-700 cursor-pointer'
                      >
                        {showPassword ? <FiEyeOff className='text-sm' /> : <FiEye className='text-sm' />}
                      </button>
                    </div>
                    {errors.password && (
                      <p className='text-[10px] text-red-500 font-semibold mt-1 px-1'>{errors.password}</p>
                    )}
                  </div>
                </div>
              )}

              {/* ACTION BAR & SUBMIT BUTTON */}
              <div className='pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-gray-100'>
                <p className='text-[11px] text-gray-500 text-center sm:text-left order-2 sm:order-1'>
                  {authMode === 'signup' ? (
                    <>
                      Already registered?{' '}
                      <button
                        type='button'
                        onClick={() => {
                          setAuthMode('signin')
                          setErrors({})
                        }}
                        className='underline text-gray-900 font-bold hover:text-black cursor-pointer'
                      >
                        Sign in here
                      </button>
                    </>
                  ) : (
                    <>
                      Need an account?{' '}
                      <button
                        type='button'
                        onClick={() => {
                          setAuthMode('signup')
                          setErrors({})
                        }}
                        className='underline text-gray-900 font-bold hover:text-black cursor-pointer'
                      >
                        Create one now
                      </button>
                    </>
                  )}
                </p>

                <button
                  type='submit'
                  className='w-full sm:w-auto px-7 py-4 bg-[#212121] text-white hover:bg-black font-extrabold text-xs uppercase tracking-wider rounded-full transition-all cursor-pointer shadow-md hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 order-1 sm:order-2 shrink-0'
                >
                  <span>{authMode === 'signup' ? 'Create Account' : 'Sign In'}</span>
                  <FiArrowRight />
                </button>
              </div>
            </form>

          </div>


        </div>
      </div>
    </FadeIn>
  )
}

export default Signup