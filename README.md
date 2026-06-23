# Phantom Eats

A dopamine food-delivery simulation: order the feeling, never the food.

Phantom Eats looks and behaves like a polished delivery app, but it never places a
real order, collects payment, or asks for an account. The user gets the full
ritual: browse restaurants, search cravings, build a cart, check out for $0.00,
track a courier, and unlock a reward for not spending money.

> Simulation only. No real orders, no payments, no accounts.

## Experience

- **Marketplace home**: search, cuisine categories, offer filters, campaign cards, rewards, and bottom navigation.
- **Restaurant pages**: hero imagery, menu sections, most-ordered carousel, reviews, and item detail sheets.
- **Checkout flow**: delivery address, ETA, handoff options, priority toggle, promo code, fake payment, and savings summary.
- **Live tracking**: map route, ETA metrics, current status, courier card, call/message actions, and variable outcomes.
- **Dopamine loop**: wallet savings, calorie avoidance, night streak, badges, fake coupon spin, confetti, and achievement reveal.
- **Persistence**: savings and streak state are stored in `localStorage`.
- **Feedback**: Web Audio and vibration feedback, with a mute control and reduced-motion support.

## Tech

React + Vite + TypeScript + Tailwind CSS v4.

## Develop

```bash
npm install
npm run dev
npm run build
```

Local dev server:

```text
http://localhost:5173
```

## Project Structure

```text
src/
  App.tsx                 screen state machine
  data.ts                 restaurants, menus, reviews, imagery
  types.ts                shared domain types
  hooks/
    useCart.ts            cart reducer
    useSavings.ts         persisted savings and streak state
  lib/
    feedback.ts           sound and haptics
    img.ts                remote food image URLs
  components/
    Splash.tsx
    Home.tsx
    RestaurantView.tsx
    Cart.tsx
    Tracking.tsx
    PrimaryButton.tsx
    FoodImage.tsx
    StatusBar.tsx
    icons.tsx
```

## Quality Checks

Use this before publishing changes:

```bash
npm run build
```
