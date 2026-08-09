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

## Stage 2 — Backend Foundation ✅ DONE
- [x] `backend/package.json` (express, mongoose, firebase-admin, bcryptjs, cors, dotenv, multer, nodemailer)
- [x] `backend/models/User.js`, `Product.js`, `Address.js`, `Order.js`
- [x] `backend/middleware/auth.js` — Firebase ID token verification + admin role check
- [x] `backend/config/db.js`, `config/firebase.js` — Mongo connection, Firebase Admin init
- [x] `backend/routes/` — auth (sync/me), products (CRUD), orders (create/list/admin/status), addresses (CRUD)
- [x] `backend/index.js` — server entry (mongoose.connect() awaited before app.listen(), verified locally)
- [x] `backend/.env.example` committed
- [ ] `backend/scripts/seedProducts.js` — ported from assets/scripts/seedProducts.ts (raw .ts version pushed under frontend/assets/scripts, JS port for backend not yet done)
- [ ] Real env vars set on Render: MONGO_URI (dedicated `ecomm-native-app` database on shared cluster), FIREBASE_* service account creds — not deployed yet

## Stage 3 — Frontend Foundation ✅ DONE
- [x] Expo project files: `app.json`, `package.json`, `tsconfig.json`, `babel.config.js`, NativeWind/Tailwind config, `global.css`
- [x] Product images, logo/favicon, constants, types, seed script pushed to `frontend/assets/`
- [x] All starter screens (auth, admin, orders, addresses) moved into `app/` and wired as real Expo Router routes — confirmed via `npx tsc --noEmit` (0 errors) after the move
- [x] Firebase client SDK setup (`config/firebaseConfig.ts`) — persistence via AsyncStorage, safe against Fast Refresh double-init
- [x] API base URL wiring (`config/api.ts`, `EXPO_PUBLIC_API_URL` with localhost fallback)
- [x] `components/Header.tsx` shared component
- [x] `.gitignore` for node_modules/.expo/.env

## Stage 4 — Customer App Screens ✅ DONE (one known gap)
- [x] Home screen (category rows, per-category horizontal scroll)
- [x] Product detail (size selection, add to cart)
- [x] Cart (quantity controls, remove, live subtotal)
- [x] Checkout (payment method toggle COD/Card, order summary, places real order via `/api/orders`)
- [x] Profile (guest vs logged-in states, wired to real Firebase auth state)
- [x] Shop screen (category filter, grid)
- [x] Order history + order detail (existing from starter assets)
- [x] Address book screen (existing from starter assets)
- [x] Shared `context/CartContext.tsx` + tab bar layout (`app/(tabs)/_layout.tsx`)
- [ ] **Known gap:** Checkout doesn't yet pull a real address from `/addresses` — currently submits an empty placeholder `shippingAddress`. Needs an address-picker wired in before this is truly usable.

## Stage 5 — Auth (Clerk → Firebase port) ✅ DONE
- [x] `app/auth/sign-in.tsx` uses Firebase `signInWithEmailAndPassword`, then calls `/api/auth/sync`
- [x] `app/auth/sign-up.tsx` ported the same way
- [x] Firebase users linked to Mongo `User` docs via `firebaseUid` (backend `/api/auth/sync` route)
- [ ] Guest vs authenticated navigation states — needs a look once Profile screen (Stage 4) is built

## Stage 6 — Admin Panel ✅ DONE
- [x] `app/admin/index.tsx` — dashboard
- [x] `app/admin/products/` — index (list), add, edit/[id]
- [x] `app/admin/orders.tsx` — order list + status update
- [x] Role-gating fixed: `app/admin/_layout.tsx` previously used a hardcoded `dummyUser` + Clerk-style `publicMetadata.role` check left over from the original tutorial code (a real bug — admin gating wasn't actually checking real auth). Replaced with real Firebase `onAuthStateChanged` + `/api/auth/me` role lookup, verified via `tsc --noEmit` and a diff confirming the old pattern is gone from the pushed file.
- [ ] Dashboard/Products/Orders admin screens still read dummy data (`dummyProducts`/`dummyOrders`) rather than real API calls — expected until Stage 8 deployment, same gap as the customer screens

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
