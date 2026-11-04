import { useState, useRef, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useCart } from './CartContext'
import FadeIn from './FadeIn'
import useFocusTrap from './useFocusTrap'
import {
  FiEye,
  FiEyeOff,
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

function NotificationToast({ notification, onDismiss }) {
  if (!notification) return null

  return (
    <div
      role={notification.type === 'error' ? 'alert' : 'status'}
      aria-live={notification.type === 'error' ? 'assertive' : 'polite'}
      className="fixed top-20 right-6 z-50 max-w-sm p-4 rounded-2xl shadow-xl bg-neutral-900 text-white flex items-center justify-between gap-3"
    >
      <div className="flex items-center gap-2.5 text-xs font-medium">
        {notification.type === 'success' ? (
          <FiCheckCircle className="text-sm shrink-0 text-emerald-400" />
        ) : (
          <FiAlertCircle className="text-sm shrink-0 text-red-400" />
        )}
        <span>{notification.message}</span>
      </div>
      <button
        onClick={onDismiss}
        className="text-white/60 hover:text-white p-1"
        aria-label="Dismiss notification"
      >
        <FiX />
      </button>
    </div>
  )
}

function Signup() {
  const {
    user,
    passwordStorageStatus,
    registerUser,
    loginUser,
    resetPassword,
    updateUser,
    deleteUser,
    logoutUser,
    wishlistItems,
    cartItems
  } = useCart()

  const [searchParams, setSearchParams] = useSearchParams()
  const tabParam = searchParams.get('tab')
  const authMode = tabParam === 'signin' ? 'signin' : 'signup'

  const setAuthMode = (mode) => {
    setSearchParams({ tab: mode })
  }
  const [showPassword, setShowPassword] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [isPasswordReset, setIsPasswordReset] = useState(false)
  const [resetFormData, setResetFormData] = useState({ email: '', password: '', confirmPassword: '' })
  const [resetErrors, setResetErrors] = useState({})
  const [signInLockoutUntil, setSignInLockoutUntil] = useState(null)
  const [lockoutRemainingMs, setLockoutRemainingMs] = useState(0)
  const [isAuthSubmitting, setIsAuthSubmitting] = useState(false)
  const deleteDialogRef = useRef(null)
  useFocusTrap(deleteDialogRef, showDeleteConfirm, () => setShowDeleteConfirm(false))
  const [notification, setNotification] = useState(null)

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    address: '',
    city: '',
    zip: '',
    phone: '',
  })

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
  }

  useEffect(() => {
    if (!notification) return undefined

    const timeoutId = setTimeout(() => {
      setNotification(null)
    }, 4500)

    return () => clearTimeout(timeoutId)
  }, [notification])

  useEffect(() => {
    if (!signInLockoutUntil) return undefined

    const updateRemainingTime = () => {
      const remaining = Math.max(0, signInLockoutUntil - Date.now())
      setLockoutRemainingMs(remaining)
      if (remaining === 0) setSignInLockoutUntil(null)
    }

    const intervalId = setInterval(updateRemainingTime, 1000)
    return () => clearInterval(intervalId)
  }, [signInLockoutUntil])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (name === 'email') {
      setSignInLockoutUntil(null)
      setLockoutRemainingMs(0)
    }
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

  const handleResetInputChange = (e) => {
    const { name, value } = e.target
    setResetFormData((prev) => ({ ...prev, [name]: value }))
    const errorsToClear = name === 'password' ? ['password', 'confirmPassword'] : [name]
    if (errorsToClear.some((field) => resetErrors[field])) {
      setResetErrors((prev) => {
        const next = { ...prev }
        errorsToClear.forEach((field) => {
          next[field] = ''
        })
        return next
      })
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
    showToast('success', 'Profile and address updated.')
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

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (authMode === 'signup' ? !validateSignup() : !validateSignin()) return

    setIsAuthSubmitting(true)
    try {
      if (authMode === 'signup') {
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

        const res = await registerUser(newUser)
        if (!res.success) {
          showToast('error', res.message)
          return
        }

        showToast('success', `Welcome to AllShoes, ${newUser.fullName}!`)
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
        const res = await loginUser({
          email: formData.email.trim(),
          password: formData.password,
        })

        if (!res.success) {
          if (res.lockedUntil) {
            setSignInLockoutUntil(res.lockedUntil)
            setLockoutRemainingMs(Math.max(0, res.lockedUntil - Date.now()))
          }
          showToast('error', res.message)
          return
        }

        setSignInLockoutUntil(null)
        setLockoutRemainingMs(0)
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
    } catch (error) {
      console.error('Authentication failed:', error)
      showToast('error', error.message || 'Unable to complete authentication in this browser.')
    } finally {
      setIsAuthSubmitting(false)
    }
  }

  const handlePasswordReset = async (e) => {
    e.preventDefault()

    const newErrors = {}
    if (!resetFormData.email.trim()) {
      newErrors.email = 'Email address is required'
    } else if (!/\S+@\S+\.\S+/.test(resetFormData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }
    if (!resetFormData.password) {
      newErrors.password = 'New password is required'
    } else if (resetFormData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }
    if (!resetFormData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your new password'
    } else if (resetFormData.password !== resetFormData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    setResetErrors(newErrors)
    if (Object.keys(newErrors).length > 0) return

    setIsAuthSubmitting(true)
    try {
      const result = await resetPassword({
        email: resetFormData.email.trim(),
        password: resetFormData.password,
      })

      if (!result.success) {
        showToast('error', result.message)
        return
      }

      setFormData((prev) => ({ ...prev, email: resetFormData.email.trim(), password: '' }))
      setResetFormData({ email: '', password: '', confirmPassword: '' })
      setIsPasswordReset(false)
      setSignInLockoutUntil(null)
      setLockoutRemainingMs(0)
      setAuthMode('signin')
      showToast('success', result.message || 'Password updated in this browser. You can now sign in.')
    } catch (error) {
      console.error('Password reset failed:', error)
      showToast('error', error.message || 'Unable to update the password in this browser.')
    } finally {
      setIsAuthSubmitting(false)
    }
  }

  const handleDeleteAccount = () => {
    deleteUser()
    setShowDeleteConfirm(false)
    setIsEditing(false)
    showToast('success', 'Your account has been deleted.')
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
        <div className="min-h-[85vh] bg-[#FBFBFD] font-jakarta py-10 sm:py-12 px-4 sm:px-8">
          <div className="max-w-5xl mx-auto space-y-8">

            <NotificationToast
              notification={notification}
              onDismiss={() => setNotification(null)}
            />

            <header className="space-y-2">
              
              <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-neutral-900">Welcome {user.fullName || 'AllShoes Member'}</h1>
              <p className="text-sm text-neutral-500">Manage your personal information, delivery details, and saved styles.</p>
            </header>

            <section aria-labelledby="account-profile-title" className="bg-white rounded-3xl p-5 sm:p-8 border border-neutral-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div className="flex items-center gap-4 sm:gap-5 min-w-0">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-neutral-900 text-white flex items-center justify-center text-xl sm:text-2xl font-semibold shrink-0">
                  {initials}
                </div>
                <div className="min-w-0">
                 
                  <p className="text-sm text-neutral-500 truncate">{user.email}</p>
                  <p className="text-xs text-neutral-400 mt-1">Member since {user.registeredAt || 'Recently'}</p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2.5 sm:justify-end">
                <button
                  onClick={startEditing}
                  className="inline-flex items-center justify-center gap-2 bg-[#000000] text-white hover:bg-black text-xs font-medium px-5 py-2.5 rounded-full transition-all cursor-pointer shadow-2xs"
                >
                  <FiEdit3 />
                  Edit Profile
                </button>
                <button
                  onClick={handleSignOut}
                  className="inline-flex items-center justify-center gap-2 bg-neutral-100 text-neutral-700 hover:text-black hover:bg-neutral-200 text-xs font-medium px-4 py-2.5 rounded-full transition-all cursor-pointer"
                >
                  <FiLogOut />
                  Sign Out
                </button>
              </div>
            </section>

            {/* DELETE MODAL */}
            {showDeleteConfirm && (
              <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
                <div
                  ref={deleteDialogRef}
                  role="dialog"
                  aria-modal="true"
                  aria-labelledby="delete-dialog-title"
                  className="bg-white border border-black/[0.06] rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-5 text-center"
                >
                  <div className="space-y-2">
                    <h2 id="delete-dialog-title" className="text-lg font-semibold text-neutral-900">
                      Delete Account
                    </h2>
                    <p className="text-xs text-neutral-500 leading-relaxed font-light">
                      Are you sure you want to delete your profile? This removes your saved shipping information and wishlist permanently.
                    </p>
                  </div>
                  <div className="flex items-center justify-center gap-3 pt-2">
                    <button
                      onClick={() => setShowDeleteConfirm(false)}
                      className="bg-neutral-100 text-neutral-700 text-xs font-medium px-6 py-2.5 rounded-full hover:bg-neutral-200 transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleDeleteAccount}
                      className="bg-red-600 text-white text-xs font-medium px-6 py-2.5 rounded-full hover:bg-red-700 transition-colors cursor-pointer shadow-sm"
                    >
                      Yes, Delete Account
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* EDIT PROFILE FORM */}
            {isEditing && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-300 shadow-sm space-y-6">
                <div className="flex items-center justify-between border-b border-black/[0.06] pb-4">
                  <div>
                    <h2 className="text-base font-semibold text-neutral-900">
                      Edit Profile & Shipping Destination
                    </h2>
                    <p className="text-xs text-neutral-500 font-light">
                      Update your account contact and default destination.
                    </p>
                  </div>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="text-neutral-400 hover:text-black p-2 rounded-full cursor-pointer"
                    aria-label="Close edit mode"
                  >
                    <FiX className="text-lg" />
                  </button>
                </div>

                <form onSubmit={handleSaveEdit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="edit-fullName" className="block text-xs font-medium text-neutral-700 mb-1">
                        Full Name *
                      </label>
                      <input
                        id="edit-fullName"
                        type="text"
                        name="fullName"
                        value={editData.fullName}
                        onChange={handleEditChange}
                        className="w-full bg-[#F5F5F7] border border-neutral-300 focus:border-black rounded-xl px-4 py-3 text-xs outline-none focus:bg-white focus:ring-2 focus:ring-black/10 transition-all"
                      />
                    </div>
                    <div>
                      <label htmlFor="edit-email" className="block text-xs font-medium text-neutral-700 mb-1">
                        Email Address *
                      </label>
                      <input
                        id="edit-email"
                        type="email"
                        name="email"
                        value={editData.email}
                        onChange={handleEditChange}
                        className="w-full bg-[#F5F5F7] border border-neutral-300 focus:border-black rounded-xl px-4 py-3 text-xs outline-none focus:bg-white focus:ring-2 focus:ring-black/10 transition-all"
                      />
                    </div>
                    <div>
                      <label htmlFor="edit-phone" className="block text-xs font-medium text-neutral-700 mb-1">
                        Phone Number
                      </label>
                      <input
                        id="edit-phone"
                        type="tel"
                        name="phone"
                        value={editData.phone}
                        onChange={handleEditChange}
                        placeholder="+1 (555) 000-0000"
                        className="w-full bg-[#F5F5F7] border border-neutral-300 focus:border-black rounded-xl px-4 py-3 text-xs outline-none focus:bg-white focus:ring-2 focus:ring-black/10 transition-all"
                      />
                    </div>
                    <div>
                      <label htmlFor="edit-address" className="block text-xs font-medium text-neutral-700 mb-1">
                        Street Address
                      </label>
                      <input
                        id="edit-address"
                        type="text"
                        name="address"
                        value={editData.address}
                        onChange={handleEditChange}
                        placeholder="123 Serenity Blvd"
                        className="w-full bg-[#F5F5F7] border border-neutral-300 focus:border-black rounded-xl px-4 py-3 text-xs outline-none focus:bg-white focus:ring-2 focus:ring-black/10 transition-all"
                      />
                    </div>
                    <div>
                      <label htmlFor="edit-city" className="block text-xs font-medium text-neutral-700 mb-1">
                        City
                      </label>
                      <input
                        id="edit-city"
                        type="text"
                        name="city"
                        value={editData.city}
                        onChange={handleEditChange}
                        className="w-full bg-[#F5F5F7] border border-neutral-300 focus:border-black rounded-xl px-4 py-3 text-xs outline-none focus:bg-white focus:ring-2 focus:ring-black/10 transition-all"
                      />
                    </div>
                    <div>
                      <label htmlFor="edit-zip" className="block text-xs font-medium text-neutral-700 mb-1">
                        ZIP / Postal Code
                      </label>
                      <input
                        id="edit-zip"
                        type="text"
                        name="zip"
                        value={editData.zip}
                        onChange={handleEditChange}
                        className="w-full bg-[#F5F5F7] border border-neutral-300 focus:border-black rounded-xl px-4 py-3 text-xs outline-none focus:bg-white focus:ring-2 focus:ring-black/10 transition-all"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-4 border-t border-black/[0.06]">
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="bg-neutral-100 text-neutral-700 text-xs font-medium px-5 py-2.5 rounded-full hover:bg-neutral-200 transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-[#000000] hover:bg-black text-white text-xs font-medium px-6 py-2.5 rounded-full transition-all cursor-pointer shadow-sm"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              </div>
            )}

            <section aria-label="Account shortcuts" className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Link to="/cart" className="group bg-white rounded-2xl p-4 border border-neutral-200 shadow-xs hover:shadow-sm hover:border-neutral-300 transition-all flex items-center gap-3">
                <span className="w-10 h-10 rounded-xl bg-neutral-100 flex items-center justify-center text-neutral-700">
                  <FiShoppingBag />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-xs font-semibold text-neutral-900">Shopping Cart</span>
                  <span className="block text-[11px] text-neutral-500">{cartItems.length} {cartItems.length === 1 ? 'product' : 'products'}</span>
                </span>
                <FiArrowRight className="text-neutral-400 group-hover:text-neutral-900 transition-colors" />
              </Link>

              <Link to="/saved" className="group bg-white rounded-2xl p-4 border border-neutral-200 shadow-xs hover:shadow-sm hover:border-neutral-300 transition-all flex items-center gap-3">
                <span className="w-10 h-10 rounded-xl bg-neutral-100 flex items-center justify-center text-neutral-700">
                  <FiHeart />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-xs font-semibold text-neutral-900">Saved Styles</span>
                  <span className="block text-[11px] text-neutral-500">{wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'} saved</span>
                </span>
                <FiArrowRight className="text-neutral-400 group-hover:text-neutral-900 transition-colors" />
              </Link>

              <Link to="/all" className="group bg-white rounded-2xl p-4 border border-neutral-200 shadow-xs hover:shadow-sm hover:border-neutral-300 transition-all flex items-center gap-3">
                <span className="w-10 h-10 rounded-xl bg-neutral-100 flex items-center justify-center text-neutral-700">
                  <FiArrowRight />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-xs font-semibold text-neutral-900">Browse Catalog</span>
                  <span className="block text-[11px] text-neutral-500">Explore all footwear</span>
                </span>
                <FiArrowRight className="text-neutral-400 group-hover:text-neutral-900 transition-colors" />
              </Link>
            </section>

            <section aria-label="Profile and delivery information" className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="bg-white rounded-3xl p-6 sm:p-7 border border-neutral-200 shadow-sm space-y-5">
                <div>
                  <h2 className="text-base font-semibold text-neutral-900">Personal Information</h2>
                  <p className="mt-1 text-xs text-neutral-500">Your account contact details.</p>
                </div>
                <dl className="space-y-4">
                  <div className="border-b border-neutral-100 pb-3">
                    <dt className="text-[11px] text-neutral-500">Full name</dt>
                    <dd className="mt-1 text-sm font-medium text-neutral-900">{user.fullName || 'Not provided'}</dd>
                  </div>
                  <div className="border-b border-neutral-100 pb-3">
                    <dt className="text-[11px] text-neutral-500">Email address</dt>
                    <dd className="mt-1 text-sm font-medium text-neutral-900 break-all">{user.email}</dd>
                  </div>
                  <div>
                    <dt className="text-[11px] text-neutral-500">Phone number</dt>
                    <dd className="mt-1 text-sm font-medium text-neutral-900">{user.phone || 'Not provided'}</dd>
                  </div>
                </dl>
                <button
                  onClick={startEditing}
                  className="text-xs font-semibold text-neutral-700 hover:text-black underline underline-offset-4 cursor-pointer"
                >
                  Update personal information
                </button>
              </div>

              <div className="bg-white rounded-3xl p-6 sm:p-7 border border-neutral-200 shadow-sm space-y-5">
                <div>
                  <h2 className="text-base font-semibold text-neutral-900">Default Shipping Address</h2>
                  <p className="mt-1 text-xs text-neutral-500">Used to prefill your checkout details.</p>
                </div>
                <address className="not-italic rounded-2xl bg-[#F5F5F7] border border-neutral-200 p-4 text-sm leading-6 text-neutral-700">
                  <span className="block font-medium text-neutral-900">{user.fullName || 'Name not provided'}</span>
                  <span className="block">{user.address || 'Street address not provided'}</span>
                  <span className="block">{user.city || user.zip ? `${user.city || ''} ${user.zip || ''}` : 'City and postal code not provided'}</span>
                  {user.phone && <span className="block">{user.phone}</span>}
                </address>
                <button
                  onClick={startEditing}
                  className="text-xs font-semibold text-neutral-700 hover:text-black underline underline-offset-4 cursor-pointer"
                >
                  Update shipping address
                </button>
              </div>
            </section>

            <section aria-label="Account management" className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-t border-neutral-200 pt-5">
              <div>
                <h2 className="text-sm font-semibold text-neutral-900">Account management</h2>
                <p className="mt-1 text-xs text-neutral-500">Account deletion permanently removes your profile and saved information.</p>
              </div>
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="inline-flex items-center gap-2 self-start sm:self-auto text-xs font-medium text-red-700 hover:text-red-800 px-3 py-2 rounded-full hover:bg-red-50 transition-colors cursor-pointer"
              >
                <FiTrash2 />
                Delete Account
              </button>
            </section>

          </div>
        </div>
      </FadeIn>
    )
  }

  // UNREGISTERED VIEW (Sign in / Sign up)
  return (
    <FadeIn>
      <div className="min-h-[calc(100vh-4rem)] bg-[#FBFBFD] font-jakarta py-12 px-4 sm:px-6 flex items-center justify-center">
        <NotificationToast
          notification={notification}
          onDismiss={() => setNotification(null)}
        />
        <div className={`w-full transition-all duration-300 ${authMode === 'signup' ? 'max-w-3xl' : 'max-w-md'}`}>

          {/* MAIN CARD */}
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-neutral-300 shadow-sm space-y-6">

            {/* HEADER & TAB SWITCH */}
            <div className="flex flex-col items-center gap-4 pb-4 border-b border-black/[0.06]">
              <h1 className="text-xl sm:text-2xl font-semibold text-neutral-900 tracking-tight">
                {isPasswordReset
                  ? 'Reset Your Password'
                  : authMode === 'signup'
                    ? 'Create an Account'
                    : 'Welcome Back'}
              </h1>

              {isPasswordReset ? (
                <p className="max-w-sm text-center text-xs text-neutral-500 leading-relaxed">
                  Update the password for your local demo account.
                </p>
              ) : (
                <div className="inline-flex p-1 bg-[#F5F5F7] border border-neutral-200 rounded-full text-xs font-medium">
                  <button
                    type="button"
                    onClick={() => {
                      setIsPasswordReset(false)
                      setAuthMode('signin')
                      setErrors({})
                    }}
                    className={`px-5 py-1.5 rounded-full transition-all cursor-pointer ${
                      authMode === 'signin'
                        ? 'bg-white text-black shadow-2xs font-semibold'
                        : 'text-neutral-500 hover:text-black'
                    }`}
                  >
                    Sign In
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsPasswordReset(false)
                      setAuthMode('signup')
                      setErrors({})
                    }}
                    className={`px-5 py-1.5 rounded-full transition-all cursor-pointer ${
                      authMode === 'signup'
                        ? 'bg-white text-black shadow-2xs font-semibold'
                        : 'text-neutral-500 hover:text-black'
                    }`}
                  >
                    Register
                  </button>
                </div>
              )}
            </div>

            {passwordStorageStatus === 'checking' && (
              <p role="status" className="text-center text-xs text-neutral-500">
                Securing existing account passwords in this browser…
              </p>
            )}
            {passwordStorageStatus === 'error' && (
              <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs leading-relaxed text-red-700">
                Account security setup could not be completed. Sign-in and registration are unavailable; reload the page and try again.
              </p>
            )}

            {/* FORM */}
            {isPasswordReset ? (
              <form onSubmit={handlePasswordReset} className="space-y-4">
                <div role="note" className="rounded-xl border border-neutral-200 bg-[#F5F5F7] p-3 text-xs leading-relaxed text-neutral-600">
                  Demo only: no email will be sent and account ownership is not verified. This changes the password saved in this browser.
                </div>

                <div>
                  <label htmlFor="reset-email" className="block text-xs font-medium text-neutral-700 mb-1">
                    Email Address *
                  </label>
                  <input
                    id="reset-email"
                    type="email"
                    name="email"
                    autoComplete="email"
                    value={resetFormData.email}
                    onChange={handleResetInputChange}
                    placeholder="jane@example.com"
                    className="w-full bg-[#F5F5F7] border border-neutral-300 focus:border-black rounded-xl px-4 py-3 text-xs outline-none focus:bg-white focus:ring-2 focus:ring-black/10 transition-all"
                  />
                  {resetErrors.email && <p className="text-[10px] text-red-500 mt-1">{resetErrors.email}</p>}
                </div>

                <div>
                  <label htmlFor="reset-password" className="block text-xs font-medium text-neutral-700 mb-1">
                    New Password *
                  </label>
                  <input
                    id="reset-password"
                    type="password"
                    name="password"
                    autoComplete="new-password"
                    value={resetFormData.password}
                    onChange={handleResetInputChange}
                    className="w-full bg-[#F5F5F7] border border-neutral-300 focus:border-black rounded-xl px-4 py-3 text-xs outline-none focus:bg-white focus:ring-2 focus:ring-black/10 transition-all"
                  />
                  {resetErrors.password && <p className="text-[10px] text-red-500 mt-1">{resetErrors.password}</p>}
                </div>

                <div>
                  <label htmlFor="reset-confirm-password" className="block text-xs font-medium text-neutral-700 mb-1">
                    Confirm New Password *
                  </label>
                  <input
                    id="reset-confirm-password"
                    type="password"
                    name="confirmPassword"
                    autoComplete="new-password"
                    value={resetFormData.confirmPassword}
                    onChange={handleResetInputChange}
                    className="w-full bg-[#F5F5F7] border border-neutral-300 focus:border-black rounded-xl px-4 py-3 text-xs outline-none focus:bg-white focus:ring-2 focus:ring-black/10 transition-all"
                  />
                  {resetErrors.confirmPassword && <p className="text-[10px] text-red-500 mt-1">{resetErrors.confirmPassword}</p>}
                </div>

                <div className="pt-4 flex flex-col-reverse sm:flex-row sm:items-center justify-between gap-4 border-t border-black/[0.06]">
                  <button
                    type="button"
                    onClick={() => {
                      setIsPasswordReset(false)
                      setResetErrors({})
                    }}
                    className="text-center sm:text-left text-xs text-neutral-500 hover:text-black font-light underline"
                  >
                    Back to sign in
                  </button>
                  <button
                    type="submit"
                    disabled={passwordStorageStatus !== 'ready' || isAuthSubmitting}
                    className="w-full sm:w-auto whitespace-nowrap bg-[#000000] hover:bg-black disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-medium tracking-wide px-7 py-3 rounded-full transition-all shadow-sm"
                  >
                    {isAuthSubmitting ? 'Updating…' : 'Update Password'}
                  </button>
                </div>
              </form>
            ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {authMode === 'signup' ? (
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
                      className="w-full bg-[#F5F5F7] border border-neutral-300 focus:border-black rounded-xl px-4 py-3 text-xs outline-none focus:bg-white focus:ring-2 focus:ring-black/10 transition-all"
                    />
                    {errors.fullName && <p className="text-[10px] text-red-500 mt-1">{errors.fullName}</p>}
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-xs font-medium text-neutral-700 mb-1">
                      Email Address *
                    </label>
                    <input
                      id="email"
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="jane@example.com"
                      className="w-full bg-[#F5F5F7] border border-neutral-300 focus:border-black rounded-xl px-4 py-3 text-xs outline-none focus:bg-white focus:ring-2 focus:ring-black/10 transition-all"
                    />
                    {errors.email && <p className="text-[10px] text-red-500 mt-1">{errors.email}</p>}
                  </div>

                  <div className="sm:col-span-2">
                    <label htmlFor="password" className="block text-xs font-medium text-neutral-700 mb-1">
                      Password *
                    </label>
                    <div className="relative">
                      <input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        placeholder="••••••••"
                        className="w-full bg-[#F5F5F7] border border-neutral-300 focus:border-black rounded-xl pl-4 pr-10 py-3 text-xs outline-none focus:bg-white focus:ring-2 focus:ring-black/10 transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                        className="absolute right-3.5 top-3.5 text-neutral-400 hover:text-black cursor-pointer"
                      >
                        {showPassword ? <FiEyeOff className="text-xs" /> : <FiEye className="text-xs" />}
                      </button>
                    </div>
                    {errors.password && <p className="text-[10px] text-red-500 mt-1">{errors.password}</p>}
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label htmlFor="email" className="block text-xs font-medium text-neutral-700 mb-1">
                      Email Address *
                    </label>
                    <input
                      id="email"
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="jane@example.com"
                      className="w-full bg-[#F5F5F7] border border-neutral-300 focus:border-black rounded-xl px-4 py-3 text-xs outline-none focus:bg-white focus:ring-2 focus:ring-black/10 transition-all"
                    />
                    {errors.email && <p className="text-[10px] text-red-500 mt-1">{errors.email}</p>}
                  </div>

                  <div>
                    <label htmlFor="password" className="block text-xs font-medium text-neutral-700 mb-1">
                      Password *
                    </label>
                    <div className="relative">
                      <input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        placeholder="••••••••"
                        className="w-full bg-[#F5F5F7] border border-neutral-300 focus:border-black rounded-xl pl-4 pr-10 py-3 text-xs outline-none focus:bg-white focus:ring-2 focus:ring-black/10 transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                        className="absolute right-3.5 top-3.5 text-neutral-400 hover:text-black cursor-pointer"
                      >
                        {showPassword ? <FiEyeOff className="text-xs" /> : <FiEye className="text-xs" />}
                      </button>
                    </div>
                    {errors.password && <p className="text-[10px] text-red-500 mt-1">{errors.password}</p>}
                    <div className="flex justify-end mt-2">
                      <button
                        type="button"
                        disabled={passwordStorageStatus !== 'ready' || isAuthSubmitting}
                        onClick={() => {
                          setResetFormData((prev) => ({ ...prev, email: formData.email }))
                          setResetErrors({})
                          setIsPasswordReset(true)
                        }}
                        className="text-xs text-neutral-500 hover:text-black disabled:opacity-50 disabled:cursor-not-allowed underline underline-offset-2"
                      >
                        Forgot password?
                      </button>
                    </div>
                  </div>
                  {lockoutRemainingMs > 0 && (
                    <p role="alert" className="text-xs text-red-600" aria-live="assertive">
                      Sign-in is temporarily locked. Try again in {Math.ceil(lockoutRemainingMs / 60000)} {Math.ceil(lockoutRemainingMs / 60000) === 1 ? 'minute' : 'minutes'}.
                    </p>
                  )}
                </div>
              )}

              <div className="pt-4 flex flex-col-reverse sm:flex-row sm:items-center justify-between gap-4 border-t border-black/[0.06]">
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode(authMode === 'signup' ? 'signin' : 'signup')
                    setErrors({})
                  }}
                  className="text-center sm:text-left text-xs text-neutral-500 hover:text-black font-light underline"
                >
                  {authMode === 'signup' ? 'Already registered? Sign in' : 'Need an account? Register'}
                </button>

                <button
                  type="submit"
                  disabled={passwordStorageStatus !== 'ready' || isAuthSubmitting || (authMode === 'signin' && lockoutRemainingMs > 0)}
                  className="w-full sm:w-auto whitespace-nowrap bg-[#000000] hover:bg-black disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-medium tracking-wide px-7 py-3 rounded-full transition-all shadow-sm"
                >
                  {isAuthSubmitting ? 'Please wait…' : authMode === 'signup' ? 'Create Account' : 'Sign In'}
                </button>
              </div>
            </form>
            )}

          </div>

        </div>
      </div>
    </FadeIn>
  )
}

export default Signup
