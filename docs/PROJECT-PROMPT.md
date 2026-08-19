# PROJECT PROMPT: GIGO Shop (gigo-shop)

## Overview
A React Native (Expo, Expo Router) mobile e-commerce app with a companion admin panel, built on top of starter code/assets from a GreatStack YouTube tutorial ("Build E-Commerce App with React Native & Expo | Mobile App Development Step by Step Tutorial 2026"), adapted to match salvadev-sketch's existing stack conventions.

## GitHub
- Account: salvadev-sketch
- Repo: gigo-shop (renamed from ecomm-native-app; new, public)
- Push workflow: user pastes a GitHub PAT in chat when ready to push ("do it yourself"). Clone with token embedded in URL, commit, push, delete local clone, verify push succeeded (don't just trust exit code — re-check a changed file's raw URL), then tell user to revoke/regenerate the token.

## Stack decisions (already made)
- Frontend: React Native + Expo + Expo Router (file-based routing), TypeScript, NativeWind/Tailwind classes
- Backend: Node.js + Express + Mongoose
- Database: MongoDB Atlas, shared cluster `cluster0.aerbtfv.mongodb.net` (db user tuyisengeemmanuel526_db_user), own database name for this project (not yet named)
- Auth: **Firebase** (switched from the tutorial's Clerk) — matches other GIGO apps. This means `auth/sign-in.tsx` and `auth/sign-up.tsx` from the original assets are being rewritten from Clerk hooks (`useSignIn`/`useSignUp`) to Firebase Auth (email/password), with a `firebaseUid` field linking Firebase users to Mongo `User` documents.
- Admin auth: role field (`user` | `admin`) on the User model, same pattern as gigo-business-company

## Source assets (from Ecomm-Native-App-Assets.zip, treated as the real starter codebase)
- `assets/auth/` — sign-in.tsx, sign-up.tsx (being ported to Firebase)
- `assets/admin/` — `_layout.tsx`, `index.tsx` (dashboard), `orders.tsx`, `products/` (add, edit/[id], index)
- `assets/orders/` — index.tsx (list), [id].tsx (detail)
- `assets/addresses/` — index.tsx
- `assets/constants/` — `index.ts` (COLORS, CATEGORIES, PROFILE_MENU, getStatusColor), `types.ts` (User, Product, CartItem, Address, Order, Wishlist types)
- `assets/types/` — `express.d.ts`, `index.ts` (backend-side types)
- `assets/scripts/seedProducts.ts` — product seed script (being ported to backend/scripts/seedProducts.js)
- `assets/products-images/` — 50+ real product photos (p_img1–52 plus variants)
- `assets/assets.ts` — local asset registry
- `logo.png`, `favicon.png/svg`
- Note: `Get_Rewards.pdf` (a personal ₹250 Domino's voucher) was in the same zip but is unrelated — not part of the app, ignored.

## Data model (from types.ts, Mongoose versions being built in backend/models/)
- **User**: firebaseUid, name, email, role (user/admin), phone, address — DONE
- **Product**: name, description, price, comparePrice, images[], sizes[], category, stock, ratings{average,count}, isFeatured, isActive — DONE
- **Address**: user ref, type (Home/Work/Other), street, city, state, zipCode, country, isDefault — DONE
- **Order**: user ref, orderNumber, items[] (product ref, name, quantity, price, image, size), shippingAddress, paymentMethod, paymentStatus (pending/paid/failed/refunded), orderStatus (placed/processing/shipped/delivered/cancelled), subtotal, shippingCost, tax, totalAmount, notes, deliveredAt — NOT YET BUILT
- Wishlist support exists in types (`WishlistContextType`) — not yet a persisted model, may just be client-side or embedded on User

## App structure (from tutorial screen recordings + assets)
### Customer-facing
- Home (categories row, popular/featured products, per-category horizontal scroll)
- Product listing (Shop) + Product details (sizes, add to cart)
- Cart
- Checkout (shipping address selection/add, payment method: Cash on Delivery / Pay with Card, order summary with subtotal/shipping/tax/total)
- Order confirmation
- Profile: guest state ("Login/Sign Up") vs logged-in state (name, email, Admin Panel button if admin, My Orders, Shipping Addresses, My Reviews, Settings, Log Out)
- Order history + order detail
- Address book (add/edit/select, typed Home/Work/Other)
- Auth: sign-in, sign-up (Firebase email/password — no email-code 2FA needed unless requested)

### Admin panel (role === "admin")
- Dashboard: total revenue, total orders, product count, user count, recent orders list
- Products: list/manage, add product (name, price, category, stock, sizes, images — max 5, description), edit product
- Orders: list with customer + shipping info + items + total, update order status via modal (Placed/Processing/Shipped/Cancelled — tutorial also implies Delivered per the Order model)

## Progress so far
- [x] Repo name decided: gigo-shop (originally ecomm-native-app, renamed per GIGO branding decision)
- [x] Backend/frontend folder skeleton created
- [x] backend/package.json (express, mongoose, firebase-admin, bcryptjs, cors, dotenv, multer, nodemailer)
- [x] backend/models/User.js
- [x] backend/models/Product.js
- [x] backend/models/Address.js
- [x] backend/models/Order.js
- [ ] backend/middleware (Firebase ID token verification + admin role check)
- [ ] backend/routes (auth-sync, products, orders, addresses)
- [ ] backend/config (Mongo connection, Firebase Admin init)
- [ ] backend/index.js (server entry)
- [ ] backend/scripts/seedProducts.js (ported from assets/scripts/seedProducts.ts)
- [ ] frontend: copy in assets, rewrite auth pages for Firebase, wire up API base URL, set up Expo project files (package.json, app.json, tsconfig.json, babel.config.js, tailwind/nativewind config)
- [ ] Local build/type-check verification before any push (per established lesson: run `npx tsc --noEmit` for backend/frontend TS, don't just assume correctness)
- [x] Create GitHub repo (gigo-shop) and push — done, confirmed already committed
- [ ] Deploy: backend to Render, frontend — TBD (Expo apps aren't Vercel-deployable the way web apps are; likely EAS Build / Expo Go for testing, discuss with user before assuming)

## Open questions / not yet decided
- Database name for this project on the shared Atlas cluster
- Whether to keep the tutorial's USD ($) pricing or switch to FRw/BIF like other GIGO projects
- Whether Wishlist becomes a real backend feature or stays out of scope for v1
- Whether "Delivered" status and "Pay with Card" (real payment gateway vs UI-only) are in scope for v1, or COD-only + manual status updates for now
- Mobile deployment/distribution plan (EAS Build, TestFlight/Play internal testing, or just Expo Go for dev)

## Recurring gotchas to double-check for this project too
(see main session doc — Atlas 0.0.0.0/0 network access, Render env vars need redeploy, mongoose.connect() must be awaited before app.listen(), manually-inserted Atlas docs bypass schema validation, etc.)
