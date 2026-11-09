<img width="956" height="506" alt="Screenshot 2026-11-09 225232" src="https://github.com/user-attachments/assets/96df5de9-b8af-4dcd-95ca-88297472057d" />
# AllShoes

A responsive frontend shoe-store demo built with **React 19**, **Tailwind CSS 4**, and **Vite 8**. Browse men's and women's footwear, manage a cart with stock-aware quantities, save items to a wishlist, and explore a simulated checkout flow.

> **[View the live demo](https://allshoes-theta.vercel.app/)**

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)

---

## Features

| Area | Details |
|---|---|
| **Product Catalog** | Fetches men's & women's shoes from the [DummyJSON API](https://dummyjson.com/), with category pages, product detail views, and a combined "Shop All" page |
| **Search** | Debounced live search with keyboard-navigable dropdown suggestions on the Shop All page |
| **Shopping Cart** | Add-to-cart with size & color selection, quantity stepper with stock limits, slide-in cart drawer, undo-remove toast, promo codes (`ALLSHOES10`, `SAVE20`) |
| **Wishlist** | Heart-toggle to save items for later with toast notifications and undo support |
| **User Accounts** | Client-side sign up / sign in with localStorage-based user database; per-user cart & wishlist isolation; profile editing with shipping address autofill at checkout |
| **Checkout** | Multi-step checkout modal (Shipping → Payment → Confirmation) with order summary, tax, and free-shipping progress bar |
| **Animations** | Scroll-triggered fade-ins via Framer Motion, hover-expand carousel cards, smooth page transitions |
| **Responsive Design** | Mobile-first layout with hamburger menu, swipeable product carousel (touch + pointer drag), and adaptive grid breakpoints |
| **Multi-Tab Sync** | Cart, wishlist, and auth state stay in sync across browser tabs via the `storage` event |
| **Accessibility** | ARIA labels, keyboard-navigable carousels & size selectors, screen-reader live regions |

> **Demo limitations:** This is a frontend-only project. Accounts, passwords, cart, and wishlist data are stored in the browser's `localStorage`; there is no authentication backend, server-side security, or real user database. Browser storage can be inspected, modified, or cleared, so use demo credentials only. Checkout is simulated: it does not charge a payment method, send an email receipt, or save an order to a server. Do not enter real payment-card details.

---

## Tech Stack

- **Framework:** [React 19](https://react.dev/) (with React Router DOM v7)
- **Build Tool:** [Vite 8](https://vite.dev/)
- **Styling:** [Tailwind CSS 4](https://tailwindcss.com/) (via `@tailwindcss/vite` plugin)
- **Animations:** [Framer Motion 13](https://www.framer.com/motion/)
- **Icons:** [React Icons](https://react-icons.github.io/react-icons/) (Feather, Font Awesome, Remix, etc.)
- **Fonts:** [Inter](https://fonts.google.com/specimen/Inter) and [Plus Jakarta Sans](https://fonts.google.com/specimen/Plus+Jakarta+Sans) (Google Fonts)
- **API:** [DummyJSON](https://dummyjson.com/) — product data for shoes
- **Linting:** ESLint 10 with `eslint-plugin-react-hooks` & `eslint-plugin-react-refresh`
- **Deployment:** Vercel (with SPA rewrites via `vercel.json`)

---

## Project Structure

```
AllShoes/
├── public/                      # Static assets served as-is
│   ├── AllShoes.svg             # Favicon
│   ├── home1.jpg                # Homepage hero background
│   ├── model.jpg                # Prefooter model image
│   ├── CarouselImages/          # Carousel card backgrounds
│   │   ├── Blue.jpg
│   │   ├── Brown.jpg
│   │   ├── Green.jpg
│   │   └── Pink.jpg
│   └── DisplayImages/           # Featured collection images
│       ├── athlete.jpg
│       ├── jordanD.jpg
│       ├── men-shoe.jpg
│       ├── menshoeD.jpg
│       ├── women-shoe.jpg
│       ├── womenitems-shoe.jpg
│       └── womenshoeD.jpg
│
├── src/
│   ├── main.jsx                 # App entry — routes, providers, global layout
│   ├── CartContext.jsx          # Global state: cart, wishlist, auth, multi-tab sync
│   ├── Commerce.css             # Tailwind import & global styles
│   ├── FadeIn.jsx               # Reusable scroll-triggered animation wrapper
│   ├── Header.jsx               # Desktop & mobile navigation with cart/wishlist badges
│   ├── Footer.jsx               # Site footer with links, newsletter, social icons
│   ├── Homepage.jsx             # Landing page — hero, carousel, best sellers, display
│   ├── Signup.jsx               # Sign up / sign in forms + user dashboard
│   ├── useFocusTrap.js          # Keyboard focus management for dialogs and menus
│   │
│   ├── AllPoducts/
│   │   └── Allitems.jsx         # "Shop All" page with live search & product grid
│   ├── api/
│   │   └── products.js          # DummyJSON product API helpers
│   │
│   ├── MenProducts/
│   │   └── MenItems.jsx         # Men's shoes category page
│   │
│   ├── WomenProducts/
│   │   └── WomenItems.jsx       # Women's shoes category page
│   │
│   ├── Homepages/
│   │   ├── BestSellers.jsx      # Infinite-loop product carousel with drag support
│   │   ├── Carousel.jsx         # Hover-expand category cards
│   │   ├── Display.jsx          # Featured collection image grid
│   │   └── Prefooter.jsx        # CTA banner section
│   │
│   ├── Props/
│   │   ├── FAQ.jsx              # Accordion FAQ component
│   │   ├── MenButton.jsx        # Reusable link button (men's)
│   │   ├── WomenButton.jsx      # Reusable link button (women's)
│   │   └── NewArrivals.jsx      # Reusable link button (new arrivals)
│   │
│   └── Purchase/
│       ├── ProductDetails.jsx   # Full product page — gallery, sizes, colors, reviews
│       ├── pricing.js           # Shared cart and checkout pricing rules
│       ├── ProductsDisplay.jsx  # "You May Also Like" recommendations grid
│       ├── Cart.jsx             # Full cart page with promo codes & order summary
│       ├── CartDrawer.jsx       # Slide-in mini cart overlay
│       ├── CheckoutModal.jsx    # Multi-step checkout flow
│       ├── SavedItems.jsx       # Wishlist / saved-for-later page
│       ├── AuthPromptModal.jsx  # "Sign in to continue" prompt
│       ├── UndoToast.jsx        # Undo notification for cart removal
│       └── WishlistToast.jsx    # Notification for wishlist add/remove
│
├── index.html                   # HTML shell
├── package.json                 # Dependencies & scripts
├── vite.config.js               # Vite + React + Tailwind plugin config
├── eslint.config.js             # ESLint flat config
├── vercel.json                  # Vercel SPA rewrite rules
└── .gitignore
```

---

## Getting Started

### Prerequisites

- **Node.js** `^20.19.0` or `>=22.12.0` (required by the installed Vite version)
- **npm** (used for the commands below)

### Installation

```bash
# Clone the repository
git clone https://github.com/MaduJoseph101/AllShoes.git
cd AllShoes

# Install dependencies
npm install
```

### Development

```bash
npm run dev
```

Opens the app at `http://localhost:5173` with hot module replacement.

### Build for Production

```bash
npm run build
```

Outputs optimized static files to `dist/`.

### Preview Production Build

```bash
npm run preview
```

### Lint

```bash
npm run lint
```

---

## Routes

| Path | Component | Description |
|---|---|---|
| `/` | `Homepage` | Hero banner, carousel, best sellers, featured collections |
| `/all` | `Allitems` | Full product catalog with live search |
| `/men` | `MenItems` | Men's shoes category |
| `/women` | `WomenItems` | Women's shoes category |
| `/productdetails/:id` | `ProductDetails` | Individual product page |
| `/cart` | `Cart` | Full shopping cart with order summary |
| `/saved` | `SavedItems` | Wishlist / saved items |
| `/signup` | `Signup` | Account creation, sign in, and user dashboard |
| `/faq` | `FAQ` | Frequently asked questions |

---

## State Management

All global state lives in [`CartContext.jsx`](src/CartContext.jsx), provided via React Context:

- **Cart** — items with size/color variants, quantity limits per stock, add/remove/update/clear
- **Wishlist** — toggle save, undo remove
- **Auth** — register, login, logout, delete account, profile edit (all localStorage-backed)
- **UI** — drawer open/close, checkout modal, undo toasts, auth prompt modal
- **Multi-tab sync** — listens to `storage` events to keep all tabs consistent

---

## Styling

- **Tailwind CSS 4** with the Vite plugin — no `tailwind.config.js` needed
- Custom font stack prioritizes Inter, with system sans-serif and Plus Jakarta Sans fallbacks
- Off-white page background (`#FBFBFD`) with black accents (`#000000`)
- Fully responsive from `320px` mobile to wide desktop

---

## API

Product data is fetched from the public **[DummyJSON API](https://dummyjson.com/)**:

| Endpoint | Usage |
|---|---|
| `/products/category/mens-shoes` | Men's shoes catalog |
| `/products/category/womens-shoes` | Women's shoes catalog |
| `/products/:id` | Individual product details |
| `/products/search?q=...` | Live search suggestions |

> **Note:** No API key is required. Product data comes from a public demo API and requires an internet connection. Account and commerce state are frontend simulations; no real transactions are processed.

---

## Verification

There is currently no automated test suite configured. Before submitting changes, run the available checks:

```bash
npm run lint
npm run build
```

---

## Deployment

The project is configured for **Vercel** out of the box:

1. Push to GitHub
2. Import the repo in [Vercel](https://vercel.com)
3. Vercel auto-detects Vite — no additional config needed
4. The included `vercel.json` handles SPA client-side routing rewrites

---

## Contributing

Contributions are welcome! Feel free to open an issue or submit a pull request.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature`)
3. Commit your changes (`git commit -m 'Add feature'`)
4. Push to the branch (`git push origin feature`)
5. Open a Pull Request
