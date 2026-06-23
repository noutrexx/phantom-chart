# Phantom Eats

A dopamine site: order the feeling, never the food.

Inspired by the South Korean dopamine-site trend, Phantom Eats is a fake food-delivery
app where you go through the entire ritual: browse menus, read reviews, fill a cart,
"place" an order, and watch a courier ride toward your couch on a live map, except
nothing is ever actually ordered. No payments, no account, no bill. The journey *is*
the product, and your wallet stays full.

> This is a simulation. No real orders, no payments, ever.

## Features

- **Full fake-delivery funnel**: Splash -> Home -> Restaurant (menu/reviews) -> Cart -> Tracking -> Reveal
- **"You will pay $0.00"** checkout gag with a satisfying, frictionless flow
- **Savings wallet + night streak**: persists how much money & calories you "saved" by not ordering (localStorage)
- **Sound + haptics**: synthesized Web Audio feedback and vibration, with a mute toggle (respects `prefers-reduced-motion`)
- **Variable courier outcomes**: the ride randomly resolves as normal / early / lost / a surprise free dessert, so it never feels the same twice
- **Mobile-first** phone-frame UI, zero image assets (emoji-based)

## Tech

React + Vite + TypeScript + Tailwind CSS v4.

## Develop

```bash
npm install
npm run dev      # http://localhost:5173
npm run build
```

## Project structure

```
src/
  App.tsx              # screen state machine
  data.ts              # restaurants / menus / reviews
  types.ts
  hooks/
    useCart.ts         # cart reducer
    useSavings.ts      # persisted savings + streak
  lib/
    feedback.ts        # sound + haptics
  components/
    Splash, Home, RestaurantView, Cart, Tracking, PrimaryButton
```
