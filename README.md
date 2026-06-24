# Phantom Eats

![Phantom Eats banner](assets/banner.png)

**A dopamine-first food delivery simulation with realistic checkout UI, fake authorization, and reward loops.**

![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=06131f)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-6-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Payment](https://img.shields.io/badge/Payment-Simulated-FF6B35?style=for-the-badge)
![Persistence](https://img.shields.io/badge/Persistence-localStorage-111315?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-111315?style=for-the-badge)
[![CI](https://img.shields.io/github/actions/workflow/status/noutrexx/phantom-chart/ci.yml?branch=main&style=for-the-badge&label=CI)](https://github.com/noutrexx/phantom-chart/actions/workflows/ci.yml)

[Overview](#overview) · [Preview](#preview) · [Features](#features) · [Tech Stack](#tech-stack) · [Flow](#flow) · [Installation](#installation) · [License](#license)

---

## Overview

Phantom Eats is a polished food delivery simulation where the checkout ritual is the product. Users browse restaurants, customize meals, enter a realistic card form, authorize a simulated payment, track a courier-style delivery, review the experience, and collect rewards.

The interface borrows familiar delivery-app patterns, then flips the outcome: the craving gets satisfied through interaction, the payment authorization stays local, and the reward system celebrates avoiding the real charge.

> **Simulation only:** Phantom Eats does not place real orders, process payments, store card data, create accounts, or connect to restaurants.

---

## Preview

### Home

![Home screen](docs/screenshots/home.png)

### Core screens

| Splash | Restaurant | Checkout |
| --- | --- | --- |
| ![Splash screen](docs/screenshots/splash.png) | ![Restaurant screen](docs/screenshots/restaurant.png) | ![Checkout screen](docs/screenshots/cart.png) |

### Rewards

![Rewards screen](docs/screenshots/rewards.png)

---

## Features

| Area | What it does |
| --- | --- |
| Marketplace | Photo-led restaurant feed with search, cuisine filters, top picks, promo surfaces, and quick cart access. |
| Restaurant Detail | Hero imagery, sticky menu tabs, reviews, most-ordered highlights, and menu sections designed for scanning. |
| Item Builder | Required and optional modifiers, notes, quantity controls, and a cart CTA with lightweight feedback. |
| Simulated Checkout | Delivery choices, service/tax/tip math, realistic card entry, fake authorization, and payment safety copy. |
| Live Tracking | Courier-style status timeline, ETA states, map motion, and a reveal when the fake order completes. |
| Reviews | Order history with reorder actions, star ratings, and written review capture. |
| Rewards | Saved money, avoided calories, streaks, badges, fake coupons, and progress moments. |
| Persistence | Favorites, orders, savings, cart state, mute setting, and streaks remain in localStorage. |

---

## Tech Stack

| Layer | Technology |
| --- | --- |
| App | React 18, TypeScript |
| Build | Vite 6 |
| Styling | Tailwind CSS v4 |
| State | React hooks and localStorage |
| Testing | Playwright mobile E2E |
| Feedback | Web Audio and Vibration API |
| Media | Unsplash photo ids rendered through a local image helper |

---

## Flow

```text
Splash
  -> Home feed
  -> Restaurant detail
  -> Item builder
  -> Simulated checkout
  -> Live tracking
  -> Rewards + order review
```

---

## Project Structure

```text
src/
  App.tsx                 screen state machine and app shell
  data.ts                 restaurants, menus, reviews, and photo ids
  types.ts                shared domain types
  hooks/
    useCart.ts            cart state
    useFavorites.ts       persisted favorite restaurants
    useOrders.ts          order history, ratings, and reviews
    useSavings.ts         persisted savings and streaks
  lib/
    feedback.ts           audio and haptic feedback
    img.ts                image URL builder
    options.ts            product option groups
  components/
    Splash.tsx            entry screen
    Home.tsx              marketplace feed
    RestaurantView.tsx    restaurant, menu, and item sheet
    Cart.tsx              checkout simulation
    Tracking.tsx          courier tracking and reward reveal
    Orders.tsx            history, reorder, ratings, and reviews
    Rewards.tsx           progress, badges, and fake coupons
    Account.tsx           profile, favorites, and settings
docs/
  screenshots/            README gallery images
assets/
  banner.png              README header artwork
```

---

## Installation

```bash
npm install
npm run dev -- --port 5180 --strictPort
```

Open:

```text
http://localhost:5180/
```

Production build:

```bash
npm run build
```

---

## Quality

```bash
npm run build
npm run test:e2e
git diff --check
```

---

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.

---

## Disclaimer

Phantom Eats is a frontend simulation for product and UI experimentation. It is not affiliated with Uber Eats or any real delivery platform, and it does not perform real checkout, payment, account, courier, or restaurant operations.
