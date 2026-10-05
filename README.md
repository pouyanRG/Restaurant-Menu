# Food Delivery Dashboard — Next.js (App Router) + React

Mobile food-delivery home screen (Glassmorphism + soft neumorphism).

## Run
```bash
npm install
npm run dev      # http://localhost:3000
npm run build && npm start
```

## Structure
- `app/` — layout, page, global CSS (design tokens, mesh gradient, glass, curved nav)
- `components/` — AppLayout > HeaderBar (LocationSelector, NotificationButton), SearchSection (FilterModalTrigger), CategoryHorizontalScroller, ProductGrid > ProductCard (WishlistToggle, DiscountBadge, AddToCartCTA), CurvedBottomNavigation (FloatingCartFAB)
- `data/products.js` — categories, products, nav items
- `public/images/` — product images

## Notes
- Food photos were cropped from the reference screenshot (low-res). Replace `public/images/*.png` with transparent-background PNGs (e.g. 600×600) for pixel-perfect results.
- `StatusBar` (9:41) is a mockup element; remove it from `AppLayout` in production.
