# Phantom Eats

<p align="center">
  <img src="docs/screenshots/home.png" alt="Phantom Eats home screen" width="900" />
</p>

<p align="center">
  <strong>A dopamine-first food delivery simulation.</strong><br />
  Browse the craving, build the cart, track the order, keep the money.
</p>

<p align="center">
  <img alt="React" src="https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=06131f" />
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white" />
  <img alt="Vite" src="https://img.shields.io/badge/Vite-6-646CFF?logo=vite&logoColor=white" />
  <img alt="Tailwind CSS" src="https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white" />
  <img alt="LocalStorage" src="https://img.shields.io/badge/Persistence-localStorage-0B0B0C" />
  <img alt="Mobile first" src="https://img.shields.io/badge/UI-Mobile_first-06C167" />
</p>

## Overview

Phantom Eats looks and behaves like a polished delivery app, but it never places a real order, collects payment, or requires an account. The product is built around the ritual of ordering: search, browse, customize, checkout, track, review, and earn rewards while spending `$0.00`.

> Simulation only. No real orders, no payments, no accounts.

## Screens

| Splash | Restaurant |
| --- | --- |
| <img src="docs/screenshots/splash.png" alt="Splash screen" width="420" /> | <img src="docs/screenshots/restaurant.png" alt="Restaurant screen" width="420" /> |

| Cart | Rewards |
| --- | --- |
| <img src="docs/screenshots/cart.png" alt="Cart screen" width="420" /> | <img src="docs/screenshots/rewards.png" alt="Rewards screen" width="420" /> |

## Highlights

- Photo-led marketplace home with search, cuisine filters, top picks, and restaurant cards.
- Restaurant detail pages with hero imagery, sticky menu navigation, most-ordered items, reviews, and item sheets.
- Product customization with required/optional option groups, notes, quantity controls, and a cart CTA.
- Cart flow with delivery choices, promo theater, `$0.00` total, and savings summary.
- Live order tracking with map motion, ETA states, courier card, and achievement reveal.
- Rewards loop with saved money, avoided calories, streaks, badges, and fake coupons.
- Order history with reorder actions, ratings, and written reviews.
- Favorites, sound/haptics toggle, and persisted local state.

## Tech Stack

- **React 18** for the app shell and component model.
- **TypeScript** for typed screens, restaurants, orders, carts, and rewards.
- **Vite 6** for local development and production builds.
- **Tailwind CSS v4** for the visual system and responsive mobile UI.
- **localStorage** for cart-adjacent progress, orders, favorites, savings, and streaks.
- **Unsplash CDN** for real food photography.
- **Web Audio + Vibration API** for lightweight dopamine feedback.

## Local Development

```bash
npm install
npm run dev -- --port 5180 --strictPort
```

Open:

```text
http://localhost:5180/
```

Production check:

```bash
npm run build
```

## Project Structure

```text
src/
  App.tsx                 screen state machine and app shell
  data.ts                 restaurants, menus, reviews, and photo ids
  types.ts                shared domain types
  hooks/
    useCart.ts            cart state
    useFavorites.ts       persisted favorite restaurants
    useOrders.ts          order history and reviews
    useSavings.ts         persisted savings and streaks
  lib/
    feedback.ts           audio and haptic feedback
    img.ts                image URL builder
    options.ts            product option groups
  components/
    Splash.tsx            entry screen
    Home.tsx              marketplace feed
    RestaurantView.tsx    restaurant, menu, item sheet
    Cart.tsx              checkout simulation
    Tracking.tsx          courier tracking and reveal
    Orders.tsx            history, reorder, reviews
    Rewards.tsx           progress and badges
    Account.tsx           profile, favorites, settings
```

## Product Direction

Phantom Eats is designed to feel like a real food delivery app while making the non-purchase the reward. The UI intentionally borrows familiar delivery patterns, then flips the outcome: the cart ritual completes, the payment stays zero, and the user gets a visible win for not spending.

## Quality Checklist

Before pushing changes:

```bash
npm run build
git diff --check
```
