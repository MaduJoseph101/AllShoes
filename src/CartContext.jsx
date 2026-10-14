import { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react'

const CartContext = createContext(null)

const USERS_DB_KEY = 'allshoes_users_db'
const CURRENT_USER_KEY = 'allshoes_active_user'
const LEGACY_CART_KEY = 'allshoes_cart'
const LEGACY_WISHLIST_KEY = 'allshoes_wishlist'
const LEGACY_USER_KEY = 'allshoes_user'

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
  } catch (error) {
    console.error('Failed to save users database to localStorage:', error)
  }
}

function loadActiveUser() {
  try {
    const raw = localStorage.getItem(CURRENT_USER_KEY)
    if (!raw) {
      // LEGACY KEY PRESENCE FOR MIGRATION
      const legacyRaw = localStorage.getItem(LEGACY_USER_KEY)
      if (legacyRaw) {
        localStorage.removeItem(LEGACY_USER_KEY)
        localStorage.setItem(CURRENT_USER_KEY, legacyRaw)
        return JSON.parse(legacyRaw)
      }
      return null
    }
    return JSON.parse(raw)
  } catch (error) {
    console.error('Failed to load active user session:', error)
    localStorage.removeItem(CURRENT_USER_KEY)
    return null
  }
}

function saveActiveUser(user) {
  try {
    if (user) {
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user))
    } else {
      localStorage.removeItem(CURRENT_USER_KEY)
    }
  } catch (error) {
    console.error('Failed to save active user session:', error)
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
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)

  // LOADED USER EMAIL TO PREVENT DUPLICATES
  const loadedEmailRef = useRef(user ? normalizeEmail(user.email) : null)

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
  const registerUser = useCallback((userData) => {
    const users = loadUsersDb()
    const emailKey = normalizeEmail(userData.email)
    const existing = users.find((u) => normalizeEmail(u.email) === emailKey)

    if (existing) {
      return { success: false, message: 'An account with this email address already exists. Please sign in.' }
    }

    const newUser = {
      ...userData,
      email: emailKey,
      registeredAt: userData.registeredAt || new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      }),
    }

    const updatedUsers = [...users, newUser]
    saveUsersDb(updatedUsers)
    saveActiveUser(newUser)

    loadedEmailRef.current = emailKey
    setUser(newUser)

    // Load any existing cart/wishlist for this email (or start fresh)
    const existingCart = loadUserCart(newUser)
    const existingWishlist = loadUserWishlist(newUser)
    setCartItems(existingCart)
    setWishlistItems(existingWishlist)

    return { success: true, user: newUser }
  }, [])

  const loginUser = useCallback(({ email, password }) => {
    const users = loadUsersDb()
    const emailKey = normalizeEmail(email)
    const found = users.find((u) => normalizeEmail(u.email) === emailKey)

    if (!found) {
      return { success: false, message: 'No registered account found with this email. Please create an account.' }
    }

    if (found.password && found.password !== password) {
      return { success: false, message: 'Incorrect password. Please try again.' }
    }

    saveActiveUser(found)

    loadedEmailRef.current = emailKey
    setUser(found)

    // Load user's tied cart and wishlist
    const userCart = loadUserCart(found)
    const userWishlist = loadUserWishlist(found)
    setCartItems(userCart)
    setWishlistItems(userWishlist)

    return { success: true, user: found }
  }, [])

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
        saveUser: registerUser,
        registerUser,
        loginUser,
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
