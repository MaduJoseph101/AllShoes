import { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react'

const CartContext = createContext(null)

const USERS_DB_KEY = 'allshoes_users_db'
const CURRENT_USER_KEY = 'allshoes_active_user'
const LEGACY_CART_KEY = 'allshoes_cart'
const LEGACY_WISHLIST_KEY = 'allshoes_wishlist'
const LEGACY_USER_KEY = 'allshoes_user'
const LOGIN_ATTEMPTS_KEY_PREFIX = 'allshoes_login_attempts_'
const MAX_LOGIN_ATTEMPTS = 5
const LOGIN_LOCKOUT_DURATION_MS = 60 * 1000
const PASSWORD_HASH_ITERATIONS = 210000
const PASSWORD_SALT_BYTES = 16
const PASSWORD_HASH_BYTES = 32

function bytesToHex(bytes) {
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('')
}

function hexToBytes(hex) {
  if (typeof hex !== 'string' || hex.length % 2 !== 0 || !/^[\da-f]+$/i.test(hex)) {
    throw new Error('Stored password credentials are invalid.')
  }

  return Uint8Array.from(hex.match(/.{2}/g), (byte) => Number.parseInt(byte, 16))
}

async function derivePasswordHash(password, salt, iterations = PASSWORD_HASH_ITERATIONS) {
  if (!globalThis.crypto?.subtle || !globalThis.crypto?.getRandomValues) {
    throw new Error('Password hashing is unavailable. Use a modern browser over HTTPS or localhost.')
  }

  const keyMaterial = await globalThis.crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(password),
    'PBKDF2',
    false,
    ['deriveBits']
  )
  const hashBits = await globalThis.crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt, iterations, hash: 'SHA-256' },
    keyMaterial,
    PASSWORD_HASH_BYTES * 8
  )

  return bytesToHex(new Uint8Array(hashBits))
}

async function createPasswordCredentials(password) {
  const salt = globalThis.crypto.getRandomValues(new Uint8Array(PASSWORD_SALT_BYTES))
  const passwordSalt = bytesToHex(salt)
  const passwordHash = await derivePasswordHash(password, salt)

  return { passwordHash, passwordSalt, passwordHashIterations: PASSWORD_HASH_ITERATIONS }
}

function hasPasswordHash(user) {
  return typeof user.passwordHash === 'string'
    && typeof user.passwordSalt === 'string'
    && Number.isInteger(user.passwordHashIterations)
    && user.passwordHashIterations >= 100000
    && user.passwordHashIterations <= 600000
}

function stripPasswordCredentials(user) {
  const publicUser = { ...user }
  delete publicUser.password
  delete publicUser.passwordHash
  delete publicUser.passwordSalt
  delete publicUser.passwordHashIterations
  return publicUser
}

async function migrateLegacyPasswords() {
  const users = loadUsersDb()
  let didMigrate = false
  const migratedUsers = []

  for (const user of users) {
    if (typeof user.password !== 'string') {
      migratedUsers.push(user)
      continue
    }

    const credentials = await createPasswordCredentials(user.password)
    const migratedUser = { ...user, ...credentials }
    delete migratedUser.password
    migratedUsers.push(migratedUser)
    didMigrate = true
  }

  if (didMigrate && !saveUsersDb(migratedUsers)) {
    throw new Error('Could not save secured account credentials to this browser.')
  }
}

function getLoginAttemptsKey(email) {
  return `${LOGIN_ATTEMPTS_KEY_PREFIX}${encodeURIComponent(normalizeEmail(email))}`
}

function loadLoginAttempts(email) {
  try {
    const raw = localStorage.getItem(getLoginAttemptsKey(email))
    if (!raw) return { failedAttempts: 0, lockedUntil: 0 }

    const parsed = JSON.parse(raw)
    if (!Number.isInteger(parsed.failedAttempts) || !Number.isFinite(parsed.lockedUntil)) {
      console.error('Stored sign-in attempt data is invalid.')
      return null
    }

    return parsed
  } catch (error) {
    console.error('Failed to load sign-in attempt data from localStorage:', error)
    return null
  }
}

function saveLoginAttempts(email, attempts) {
  try {
    localStorage.setItem(getLoginAttemptsKey(email), JSON.stringify(attempts))
    return true
  } catch (error) {
    console.error('Failed to save sign-in attempt data to localStorage:', error)
    return false
  }
}

function clearLoginAttempts(email) {
  try {
    localStorage.removeItem(getLoginAttemptsKey(email))
    return true
  } catch (error) {
    console.error('Failed to clear sign-in attempt data from localStorage:', error)
    return false
  }
}

// USER DATABASE (LOCAL STORAGE SIMULATION)
function loadUsersDb() {
  try {
    const raw = localStorage.getItem(USERS_DB_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch (error) {
    console.error('Failed to load users database from localStorage:', error)
    return []
  }
}

function saveUsersDb(users) {
  try {
    if (Array.isArray(users) && users.length > 0) {
      localStorage.setItem(USERS_DB_KEY, JSON.stringify(users))
    } else {
      localStorage.removeItem(USERS_DB_KEY)
    }
    return true
  } catch (error) {
    console.error('Failed to save users database to localStorage:', error)
    return false
  }
}

function loadActiveUser() {
  try {
    const raw = localStorage.getItem(CURRENT_USER_KEY)
    if (!raw) {
      // LEGACY KEY PRESENCE FOR MIGRATION
      const legacyRaw = localStorage.getItem(LEGACY_USER_KEY)
      if (legacyRaw) {
        const legacyUser = JSON.parse(legacyRaw)
        localStorage.removeItem(LEGACY_USER_KEY)
        saveActiveUser(legacyUser)
        return stripPasswordCredentials(legacyUser)
      }
      return null
    }
    const activeUser = JSON.parse(raw)
    const publicUser = stripPasswordCredentials(activeUser)
    if (Object.keys(publicUser).length !== Object.keys(activeUser).length) {
      saveActiveUser(publicUser)
    }
    return publicUser
  } catch (error) {
    console.error('Failed to load active user session:', error)
    localStorage.removeItem(CURRENT_USER_KEY)
    return null
  }
}

function saveActiveUser(user) {
  try {
    if (user) {
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(stripPasswordCredentials(user)))
    } else {
      localStorage.removeItem(CURRENT_USER_KEY)
    }
    return true
  } catch (error) {
    console.error('Failed to save active user session:', error)
    return false
  }
}

// USER-TIED CART & WISHLIST STORAGE HELPERS
const REQUIRED_CART_FIELDS = ['key', 'id', 'title', 'price', 'thumbnail', 'size', 'color', 'quantity']

function isValidCartItem(item) {
  if (!item || typeof item !== 'object') return false
  return REQUIRED_CART_FIELDS.every((field) => field in item)
}

function normalizeEmail(email) {
  return email ? email.toLowerCase().trim() : ''
}

function getCartStorageKey(user) {
  if (!user || !user.email) return null
  return `allshoes_cart_${normalizeEmail(user.email)}`
}

function getWishlistStorageKey(user) {
  if (!user || !user.email) return null
  return `allshoes_wishlist_${normalizeEmail(user.email)}`
}

function loadUserCart(user) {
  if (!user || !user.email) return []
  const key = getCartStorageKey(user)
  try {
    let stored = localStorage.getItem(key)

    if (!stored) {
      const legacyCart = localStorage.getItem(LEGACY_CART_KEY)
      if (legacyCart) {
        localStorage.removeItem(LEGACY_CART_KEY)
        localStorage.setItem(key, legacyCart)
        stored = legacyCart
      }
    }

    if (!stored) return []
    const parsed = JSON.parse(stored)
    if (!Array.isArray(parsed)) return []
    return parsed.filter(isValidCartItem)
  } catch (error) {
    console.error('Failed to load user cart from localStorage:', error)
    return []
  }
}

const REQUIRED_WISHLIST_FIELDS = ['id', 'title', 'price', 'thumbnail']

function isValidWishlistItem(item) {
  if (!item || typeof item !== 'object') return false
  return REQUIRED_WISHLIST_FIELDS.every((field) => field in item)
}

function loadUserWishlist(user) {
  if (!user || !user.email) return []
  const key = getWishlistStorageKey(user)
  try {
    let stored = localStorage.getItem(key)

    if (!stored) {
      const legacyWishlist = localStorage.getItem(LEGACY_WISHLIST_KEY)
      if (legacyWishlist) {
        localStorage.removeItem(LEGACY_WISHLIST_KEY)
        localStorage.setItem(key, legacyWishlist)
        stored = legacyWishlist
      }
    }

    if (!stored) return []
    const parsed = JSON.parse(stored)
    if (!Array.isArray(parsed)) return []
    return parsed.filter(isValidWishlistItem)
  } catch (error) {
    console.error('Failed to load user wishlist from localStorage:', error)
    return []
  }
}

export function CartProvider({ children }) {
  const [user, setUser] = useState(loadActiveUser)
  const [cartItems, setCartItems] = useState(() => loadUserCart(user))
  const [wishlistItems, setWishlistItems] = useState(() => loadUserWishlist(user))
  const [passwordStorageStatus, setPasswordStorageStatus] = useState('checking')
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)
  const passwordMigrationRef = useRef(null)

  // LOADED USER EMAIL TO PREVENT DUPLICATES
  const loadedEmailRef = useRef(user ? normalizeEmail(user.email) : null)

  useEffect(() => {
    let isMounted = true

    if (!passwordMigrationRef.current) {
      passwordMigrationRef.current = migrateLegacyPasswords()
    }

    passwordMigrationRef.current
      .then(() => {
        if (isMounted) setPasswordStorageStatus('ready')
      })
      .catch((error) => {
        console.error('Failed to migrate existing account passwords:', error)
        if (isMounted) setPasswordStorageStatus('error')
      })

    return () => {
      isMounted = false
    }
  }, [])

  // AUTH PROMPT MODAL STATE
  const [authPrompt, setAuthPrompt] = useState({
    isOpen: false,
    action: 'cart', 
    productTitle: '',
  })

  const openAuthPrompt = useCallback((action = 'cart', productTitle = '') => {
    setAuthPrompt({
      isOpen: true,
      action,
      productTitle,
    })
  }, [])

  const closeAuthPrompt = useCallback(() => {
    setAuthPrompt((prev) => ({ ...prev, isOpen: false }))
  }, [])

  // UNDO STATE FOR ITEM REMOVAL
  const [lastRemovedItem, setLastRemovedItem] = useState(null)
  const [undoToastVisible, setUndoToastVisible] = useState(false)

  // OPTIMIZED STORAGE SYNC:
  useEffect(() => {
    if (!user || !user.email) return

    const userEmail = normalizeEmail(user.email)
    // Only persist if the memory state corresponds to this user (prevents overwriting during fast user switches)
    if (loadedEmailRef.current !== userEmail) return

    const key = getCartStorageKey(user)
    try {
      if (cartItems.length > 0) {
        localStorage.setItem(key, JSON.stringify(cartItems))
      } else {

        localStorage.removeItem(key)
      }
    } catch (err) {
      console.error('Error saving user cart to localStorage:', err)
    }
  }, [cartItems, user])

  useEffect(() => {
    if (!user || !user.email) return

    const userEmail = normalizeEmail(user.email)
    if (loadedEmailRef.current !== userEmail) return

    const key = getWishlistStorageKey(user)
    try {
      if (wishlistItems.length > 0) {
        localStorage.setItem(key, JSON.stringify(wishlistItems))
      } else {

        localStorage.removeItem(key)
      }
    } catch (err) {
      console.error('Error saving user wishlist to localStorage:', err)
    }
  }, [wishlistItems, user])

  // MULTI-TAB SYNCHRONIZATION
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === CURRENT_USER_KEY) {
        const updatedUser = loadActiveUser()
        setUser(updatedUser)
        if (updatedUser) {
          loadedEmailRef.current = normalizeEmail(updatedUser.email)
          setCartItems(loadUserCart(updatedUser))
          setWishlistItems(loadUserWishlist(updatedUser))
        } else {
          loadedEmailRef.current = null
          setCartItems([])
          setWishlistItems([])
        }
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  // AUTHENTICATION & USER DATABASE HANDLERS
  const registerUser = useCallback(async (userData) => {
    if (passwordStorageStatus !== 'ready') {
      return { success: false, message: 'Account security setup is not ready. Please reload and try again.' }
    }

    const users = loadUsersDb()
    const emailKey = normalizeEmail(userData.email)
    const existing = users.find((u) => normalizeEmail(u.email) === emailKey)

    if (existing) {
      return { success: false, message: 'An account with this email address already exists. Please sign in.' }
    }

    const credentials = await createPasswordCredentials(userData.password)
    const newUser = {
      ...stripPasswordCredentials(userData),
      ...credentials,
      email: emailKey,
      registeredAt: userData.registeredAt || new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      }),
    }

    const updatedUsers = [...users, newUser]
    if (!saveUsersDb(updatedUsers)) {
      return { success: false, message: 'Unable to save the account in this browser. Please try again.' }
    }

    const activeUser = stripPasswordCredentials(newUser)
    saveActiveUser(activeUser)
    loadedEmailRef.current = emailKey
    setUser(activeUser)

    // Load any existing cart/wishlist for this email (or start fresh)
    const existingCart = loadUserCart(activeUser)
    const existingWishlist = loadUserWishlist(activeUser)
    setCartItems(existingCart)
    setWishlistItems(existingWishlist)

    return { success: true, user: activeUser }
  }, [passwordStorageStatus])

  const loginUser = useCallback(async ({ email, password }) => {
    if (passwordStorageStatus !== 'ready') {
      return { success: false, message: 'Account security setup is not ready. Please reload and try again.' }
    }

    const users = loadUsersDb()
    const emailKey = normalizeEmail(email)
    const found = users.find((u) => normalizeEmail(u.email) === emailKey)
    const invalidCredentialsMessage = 'Unable to sign in with those details. Please check and try again.'
    const attempts = loadLoginAttempts(emailKey)

    if (!attempts) {
      return { success: false, message: 'Unable to check sign-in protection. Please try again.' }
    }

    const now = Date.now()
    if (attempts.lockedUntil > now) {
      const minutesRemaining = Math.ceil((attempts.lockedUntil - now) / 60000)
      return {
        success: false,
        message: `Too many unsuccessful attempts. Try again in ${minutesRemaining} ${minutesRemaining === 1 ? 'minute' : 'minutes'}.`,
        lockedUntil: attempts.lockedUntil,
      }
    }

    let passwordMatches = false
    if (found && hasPasswordHash(found)) {
      passwordMatches = await derivePasswordHash(
        password,
        hexToBytes(found.passwordSalt),
        found.passwordHashIterations
      ) === found.passwordHash
    }

    if (!passwordMatches) {
      const failedAttempts = attempts.lockedUntil ? 1 : attempts.failedAttempts + 1
      const lockedUntil = failedAttempts >= MAX_LOGIN_ATTEMPTS
        ? now + LOGIN_LOCKOUT_DURATION_MS
        : 0

      if (!saveLoginAttempts(emailKey, { failedAttempts, lockedUntil })) {
        return { success: false, message: 'Unable to record this sign-in attempt. Please try again.' }
      }

      if (lockedUntil) {
        return {
          success: false,
          message: 'Too many unsuccessful attempts. Sign-in is temporarily locked for 1 minute.',
          lockedUntil,
        }
      }

      return { success: false, message: invalidCredentialsMessage }
    }

    if (!clearLoginAttempts(emailKey)) {
      return { success: false, message: 'Unable to complete sign-in. Please try again.' }
    }

    const activeUser = stripPasswordCredentials(found)
    saveActiveUser(activeUser)

    loadedEmailRef.current = emailKey
    setUser(activeUser)

    // Load user's tied cart and wishlist
    const userCart = loadUserCart(activeUser)
    const userWishlist = loadUserWishlist(activeUser)
    setCartItems(userCart)
    setWishlistItems(userWishlist)

    return { success: true, user: activeUser }
  }, [passwordStorageStatus])

  const resetPassword = useCallback(async ({ email, password }) => {
    if (passwordStorageStatus !== 'ready') {
      return { success: false, message: 'Account security setup is not ready. Please reload and try again.' }
    }

    const emailKey = normalizeEmail(email)
    const users = loadUsersDb()
    const userIndex = users.findIndex((u) => normalizeEmail(u.email) === emailKey)

    if (userIndex === -1) {
      return { success: false, message: 'No account was found with that email address.' }
    }

    const credentials = await createPasswordCredentials(password)
    const updatedUsers = users.map((storedUser, index) => {
      if (index !== userIndex) return storedUser
      const updatedUser = { ...storedUser, ...credentials }
      delete updatedUser.password
      return updatedUser
    })

    if (!saveUsersDb(updatedUsers)) {
      return { success: false, message: 'Unable to save the new password. Please try again.' }
    }

    if (!clearLoginAttempts(emailKey)) {
      return {
        success: true,
        message: 'Password updated, but sign-in attempt data could not be cleared. Please reload and try again.',
      }
    }

    return { success: true }
  }, [passwordStorageStatus])

  const updateUser = useCallback((updatedFields) => {
    setUser((prev) => {
      if (!prev) return null

      const oldEmail = normalizeEmail(prev.email)
      const newEmail = updatedFields.email ? normalizeEmail(updatedFields.email) : oldEmail
      const updated = { ...prev, ...updatedFields, email: newEmail }

      // STORAGE KEY MIGRATION IN CASES OF CHANGED EMAIL
      if (oldEmail && newEmail && oldEmail !== newEmail) {
        const oldCartKey = `allshoes_cart_${oldEmail}`
        const newCartKey = `allshoes_cart_${newEmail}`
        const oldCart = localStorage.getItem(oldCartKey)
        if (oldCart) {
          localStorage.setItem(newCartKey, oldCart)
          localStorage.removeItem(oldCartKey)
        }

        const oldWishlistKey = `allshoes_wishlist_${oldEmail}`
        const newWishlistKey = `allshoes_wishlist_${newEmail}`
        const oldWishlist = localStorage.getItem(oldWishlistKey)
        if (oldWishlist) {
          localStorage.setItem(newWishlistKey, oldWishlist)
          localStorage.removeItem(oldWishlistKey)
        }
      }

      saveActiveUser(updated)
      loadedEmailRef.current = newEmail

      const users = loadUsersDb()
      const newUsers = users.map((u) =>
        normalizeEmail(u.email) === oldEmail ? { ...u, ...updatedFields, email: newEmail } : u
      )
      saveUsersDb(newUsers)
      return updated
    })
  }, [])

  const logoutUser = useCallback(() => {
    saveActiveUser(null)
    loadedEmailRef.current = null
    setUser(null)
    setCartItems([])
    setWishlistItems([])
  }, [])

  const deleteUser = useCallback(() => {
    if (user && user.email) {
      const emailKey = normalizeEmail(user.email)

      // REMOVAL OF USER'S DATABASE
      const users = loadUsersDb()
      const filteredUsers = users.filter((u) => normalizeEmail(u.email) !== emailKey)
      saveUsersDb(filteredUsers)

      localStorage.removeItem(`allshoes_cart_${emailKey}`)
      localStorage.removeItem(`allshoes_wishlist_${emailKey}`)

      // LINGERING LEGACY KEYS
      localStorage.removeItem(LEGACY_CART_KEY)
      localStorage.removeItem(LEGACY_WISHLIST_KEY)
      localStorage.removeItem(LEGACY_USER_KEY)
    }

    saveActiveUser(null)
    loadedEmailRef.current = null
    setUser(null)
    setCartItems([])
    setWishlistItems([])
  }, [user])

  // DRAWER AND CHECKOUT CONTROLS
  const openDrawer = useCallback(() => setIsDrawerOpen(true), [])
  const closeDrawer = useCallback(() => setIsDrawerOpen(false), [])
  const openCheckout = useCallback(() => {
    setIsDrawerOpen(false)
    setIsCheckoutOpen(true)
  }, [])
  const closeCheckout = useCallback(() => setIsCheckoutOpen(false), [])

  // ITEM STOCK LIMIT RESTRICTION & AUTH GUARD
  const addToCart = useCallback((product, size, color, openDrawerAfter = true) => {
    if (!user) {
      openAuthPrompt('cart', product?.title || 'Shoe')
      return false
    }

    const stockLimit = product.stock ?? 99
    let maxReached = false

    setCartItems((prev) => {
      const key = `${product.id}-${size}-${color.name}`
      const existing = prev.find((i) => i.key === key)

      if (existing) {
        if (existing.quantity >= stockLimit) {
          maxReached = true
          return prev
        }
        return prev.map((i) =>
          i.key === key ? { ...i, quantity: Math.min(stockLimit, i.quantity + 1) } : i
        )
      }

      return [
        ...prev,
        {
          key,
          id: product.id,
          title: product.title,
          price: product.price,
          thumbnail: product.thumbnail,
          brand: product.brand || 'AllShoes',
          size,
          color,
          stock: stockLimit,
          quantity: 1,
        },
      ]
    })

    if (openDrawerAfter && !maxReached) {
      setIsDrawerOpen(true)
    }

    return !maxReached
  }, [user, openAuthPrompt])

  const removeFromCart = useCallback((key) => {
    setCartItems((prev) => {
      const itemToRemove = prev.find((i) => i.key === key)
      if (itemToRemove) {
        setLastRemovedItem(itemToRemove)
        setUndoToastVisible(true)
      }
      return prev.filter((i) => i.key !== key)
    })
  }, [])

  // UNDO REMOVE OPERATION
  const undoRemove = useCallback(() => {
    if (!lastRemovedItem) return
    setCartItems((prev) => {
      const existing = prev.find((i) => i.key === lastRemovedItem.key)
      if (existing) return prev
      return [...prev, lastRemovedItem]
    })
    setLastRemovedItem(null)
    setUndoToastVisible(false)
  }, [lastRemovedItem])

  const dismissUndoToast = useCallback(() => {
    setUndoToastVisible(false)
  }, [])

  // STOCK LIMIT ENFORCEMENT
  const updateQuantity = useCallback((key, delta) => {
    setCartItems((prev) =>
      prev
        .map((i) => {
          if (i.key !== key) return i
          const maxStock = i.stock ?? 99
          const newQty = Math.min(maxStock, Math.max(0, i.quantity + delta))
          return { ...i, quantity: newQty }
        })
        .filter((i) => i.quantity > 0)
    )
  }, [])

  // CLEAR CART
  const clearCart = useCallback(() => {
    setCartItems([])
    if (user && user.email) {
      const key = getCartStorageKey(user)
      if (key) {
        localStorage.removeItem(key)
      }
    }
  }, [user])

  // WISHLIST TOAST AND UNDO STATE
  const [lastRemovedWishlistItem, setLastRemovedWishlistItem] = useState(null)
  const [wishlistToast, setWishlistToast] = useState({
    visible: false,
    message: '',
    item: null,
    action: 'added',
  })

  const dismissWishlistToast = useCallback(() => {
    setWishlistToast((prev) => ({ ...prev, visible: false }))
  }, [])

  const undoWishlistRemove = useCallback(() => {
    if (!lastRemovedWishlistItem) return
    setWishlistItems((prev) => {
      const exists = prev.some((i) => i.id === lastRemovedWishlistItem.id)
      if (exists) return prev
      return [...prev, lastRemovedWishlistItem]
    })
    setLastRemovedWishlistItem(null)
    setWishlistToast((prev) => ({ ...prev, visible: false }))
  }, [lastRemovedWishlistItem])

  // WISHLIST TOGGLE WITH AUTH GUARD
  const toggleWishlist = useCallback((product) => {
    
    if (!user) {
      openAuthPrompt('saved', product?.title || 'Shoe')
      return false
    }

    setWishlistItems((prev) => {
      const exists = prev.some((i) => i.id === product.id)
      if (exists) {
        const itemToRemove = prev.find((i) => i.id === product.id) || product
        setLastRemovedWishlistItem(itemToRemove)
        setWishlistToast({
          visible: true,
          message: `Removed "${product.title}" from saved items`,
          item: itemToRemove,
          action: 'removed',
        })
        return prev.filter((i) => i.id !== product.id)
      } else {
        const newItem = {
          id: product.id,
          title: product.title,
          price: product.price,
          thumbnail: product.thumbnail,
          brand: product.brand || 'AllShoes',
        }
        setWishlistToast({
          visible: true,
          message: `Saved "${product.title}" for later!`,
          item: newItem,
          action: 'added',
        })
        return [...prev, newItem]
      }
    })
    return true
  }, [user, openAuthPrompt])

  const isInWishlist = useCallback((id) => {
    return wishlistItems.some((i) => i.id === id)
  }, [wishlistItems])

  const itemCount = cartItems.reduce((sum, i) => sum + i.quantity, 0)
  const subtotal = cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0)

  return (
    <CartContext.Provider
      value={{
        cartItems,
        wishlistItems,
        addToCart,
        removeFromCart,
        undoRemove,
        undoToastVisible,
        dismissUndoToast,
        lastRemovedItem,
        updateQuantity,
        clearCart,
        itemCount,
        subtotal,
        isDrawerOpen,
        openDrawer,
        closeDrawer,
        isCheckoutOpen,
        openCheckout,
        closeCheckout,
        toggleWishlist,
        isInWishlist,
        wishlistToast,
        dismissWishlistToast,
        undoWishlistRemove,
        lastRemovedWishlistItem,
        user,
        passwordStorageStatus,
        saveUser: registerUser,
        registerUser,
        loginUser,
        resetPassword,
        updateUser,
        deleteUser,
        logoutUser,
        authPrompt,
        openAuthPrompt,
        closeAuthPrompt,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used inside CartProvider')
  return ctx
}

export const useUser = useCart
