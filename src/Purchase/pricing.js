export const FREE_SHIPPING_THRESHOLD = 100
export const PROMO_CODES = {
  ALLSHOES10: 0.1,
  SAVE20: 0.2,
}

export const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
})

const TAX_RATE = 0.08
const SHIPPING_COST = 9.99

const roundCurrency = (amount) => Math.round((amount + Number.EPSILON) * 100) / 100

export function calculateOrderTotals(subtotal, discountRate = 0) {
  const roundedSubtotal = roundCurrency(subtotal)
  const discount = roundCurrency(roundedSubtotal * discountRate)
  const discountedSubtotal = roundCurrency(roundedSubtotal - discount)
  const shippingCost = roundedSubtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST
  const tax = roundCurrency(discountedSubtotal * TAX_RATE)
  const total = roundCurrency(discountedSubtotal + shippingCost + tax)

  return { subtotal: roundedSubtotal, discount, shippingCost, tax, total }
}
