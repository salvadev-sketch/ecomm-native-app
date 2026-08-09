# ecomm-native-app — Project Stages & Phases

React Native (Expo Router) e-commerce app with an admin panel and an Express/MongoDB backend. Built on starter code adapted from a GreatStack tutorial, with Firebase auth (instead of Clerk) to match other salvadev-sketch projects, and a shared MongoDB Atlas cluster.

Repo: https://github.com/salvadev-sketch/ecomm-native-app

---

## Stage 1 — Source Assets & Planning ✅ DONE
- [x] Received starter code/assets (Expo Router pages, types, product images, seed script) from tutorial zip
- [x] Confirmed unrelated file (Get_Rewards.pdf, a personal Domino's voucher) is not part of the app
- [x] Stack decisions locked: Firebase auth (not Clerk), shared Atlas cluster, new repo
- [x] Repo created: `ecomm-native-app`
- [x] Full project spec written (`docs/PROJECT-PROMPT.md`)
- [x] Standalone interactive HTML prototype pushed (`frontend/prototype.html`) — customer app + admin panel toggle, matches gigo-food's static-prototype pattern

## Stage 2 — Backend Foundation (in progress)
- [x] `backend/package.json` (express, mongoose, firebase-admin, bcryptjs, cors, dotenv, multer, nodemailer)
- [x] `backend/models/User.js` (firebaseUid, name, email, role, phone, address)
- [x] `backend/models/Product.js` (name, price, comparePrice, images, sizes, category, stock, ratings, isFeatured/isActive)
- [x] `backend/models/Address.js` (type Home/Work/Other, isDefault)
- [ ] `backend/models/Order.js` (items, shippingAddress, paymentMethod, paymentStatus, orderStatus, totals)
- [ ] `backend/middleware/` — Firebase ID token verification + admin role check
- [ ] `backend/config/` — Mongo connection, Firebase Admin init
- [ ] `backend/routes/` — auth-sync, products, orders, addresses
- [ ] `backend/index.js` — server entry (mongoose.connect() awaited before app.listen())
- [ ] `backend/scripts/seedProducts.js` — ported from assets/scripts/seedProducts.ts
- [ ] Env vars: MONGO_URI (dedicated `ecomm-native-app` database on shared cluster), FIREBASE_* service account creds

## Stage 3 — Frontend Foundation (in progress)
- [ ] Expo project files: `app.json`, `package.json`, `tsconfig.json`, `babel.config.js`, NativeWind/Tailwind config
- [x] Product images, logo/favicon, constants, types, seed script pushed to `frontend/assets/`
- [ ] Copy in remaining real starter assets (auth, admin, orders, addresses screen code — Home done, rest pending)
- [ ] Firebase client SDK setup (`firebaseConfig.ts`)
- [ ] API base URL wiring (`EXPO_PUBLIC_API_URL` or similar)

## Stage 4 — Customer App Screens
- [x] Home screen (`.tsx`, category rows, per-category horizontal scroll) — done as prototype reference
- [ ] Product listing (Shop) + Product details (sizes, add to cart)
- [ ] Cart
- [ ] Checkout (address selection, Cash on Delivery / Pay with Card, order summary)
- [ ] Order confirmation
- [ ] Profile (guest vs logged-in states)
- [ ] Order history + order detail
- [ ] Address book (add/edit/select)

## Stage 5 — Auth (Clerk → Firebase port)
- [ ] Rewrite `auth/sign-in.tsx` from Clerk hooks to Firebase Auth (email/password)
- [ ] Rewrite `auth/sign-up.tsx` same way
- [ ] Link Firebase users to Mongo `User` docs via `firebaseUid`
- [ ] Guest vs authenticated navigation states

## Stage 6 — Admin Panel
- [ ] Dashboard (revenue, orders, products, users stats + recent orders)
- [ ] Products: list/manage, add product (images max 5, sizes, stock), edit product
- [ ] Orders: list with customer + shipping info, update order status (Placed/Processing/Shipped/Delivered/Cancelled)
- [ ] Role-gate admin routes (role === "admin")

## Stage 7 — Build Verification & Push
- [ ] `npx tsc --noEmit` on backend and frontend before any push (lesson learned from other projects)
- [ ] Verify `git push` actually succeeded (re-fetch a changed file's raw URL, don't just trust exit code)
- [ ] Push Stage 2–6 work to `ecomm-native-app` (not yet done — only the docs file has been discussed for push so far)

## Stage 8 — Deployment
- [ ] Backend → Render (Atlas 0.0.0.0/0 network access, env vars set + redeployed)
- [ ] Frontend distribution plan — TBD: EAS Build, TestFlight/Play internal testing, or Expo Go for dev only (needs a decision, unlike web apps this isn't a Vercel deploy)

## Stage 9 — Polish / Post-launch
- [ ] Decide: keep tutorial's USD pricing or switch to FRw/BIF like other GIGO projects
- [ ] Decide: Wishlist as a real backend feature or out of scope for v1
- [ ] Decide: "Pay with Card" — real payment gateway or COD-only for v1
- [ ] Seed sample products (`seedProducts.js`)

---

## Open decisions
- Database name for this project on the shared Atlas cluster (not yet chosen)
- Pricing currency (USD vs FRw/BIF)
- Wishlist scope for v1
- Real card payments vs COD-only for v1
- Mobile distribution plan (EAS/TestFlight/Play/Expo Go)
