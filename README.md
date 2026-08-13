# GIGO Shop

React Native (Expo Router) e-commerce app with an admin panel and an Express/MongoDB backend.

Built on top of starter code adapted from a GreatStack tutorial, with Firebase auth (instead of Clerk) to match other salvadev-sketch projects, and a shared MongoDB Atlas cluster.

See `docs/PROJECT-PROMPT.md` for the full project spec, decisions, and progress checklist.

## Structure
- `backend/` — Express + Mongoose API (models: User, Product, Address, Order)
- `frontend/` — Expo Router app (customer app + admin panel)
- `docs/` — project spec

## Status
Early scaffold — backend models in progress, frontend auth being ported from Clerk to Firebase. Not yet build-verified or deployed. See docs/PROJECT-PROMPT.md for the checklist.
