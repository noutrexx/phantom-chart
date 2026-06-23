import type { Restaurant } from "./types";

export const CATEGORIES = [
  { key: "all", label: "All", emoji: "✨" },
  { key: "burger", label: "Burgers", emoji: "🍔" },
  { key: "noodle", label: "Noodles", emoji: "🍜" },
  { key: "sushi", label: "Sushi", emoji: "🍣" },
  { key: "pizza", label: "Pizza", emoji: "🍕" },
  { key: "sweet", label: "Sweets", emoji: "🍰" },
  { key: "coffee", label: "Coffee", emoji: "☕" },
];

export const RESTAURANTS: Restaurant[] = [
  {
    id: "midnight-diner",
    name: "Midnight Diner",
    blurb: "Smash burgers & loaded fries, open till never",
    emoji: "🍔",
    gradient: "linear-gradient(135deg,#ff8a5c,#ff5c8a)",
    rating: 4.9,
    reviewsCount: 2841,
    etaMin: 18,
    distanceKm: 1.2,
    tags: ["burger", "Comfort", "Late night"],
    sections: [
      {
        title: "Most ordered",
        items: [
          { id: "md1", name: "The Phantom Double", desc: "Two smashed patties, molten cheese, secret sauce", price: 12.5, emoji: "🍔", tag: "🔥 #1" },
          { id: "md2", name: "Truffle Loaded Fries", desc: "Parmesan, truffle oil, chives, too much of it", price: 8.0, emoji: "🍟" },
          { id: "md3", name: "Crispy Chicken Stack", desc: "Buttermilk fried, pickles, honey heat", price: 11.0, emoji: "🍗" },
        ],
      },
      {
        title: "On the side",
        items: [
          { id: "md4", name: "Mozzarella Lava Sticks", desc: "Six pieces, dangerously stringy", price: 6.5, emoji: "🧀" },
          { id: "md5", name: "Spiked Vanilla Shake", desc: "Thick enough to stand a spoon in", price: 5.5, emoji: "🥤" },
        ],
      },
    ],
    reviews: [
      { user: "nightowl_22", rating: 5, text: "Browsed this at 3am for 40 minutes. Slept like a baby.", ago: "2h" },
      { user: "soft_landing", rating: 5, text: "The fries don't exist and I have never been happier.", ago: "1d" },
      { user: "j.kim", rating: 4, text: "Cart full, wallet untouched. Therapy honestly.", ago: "3d" },
    ],
  },
  {
    id: "slurp-house",
    name: "Slurp House",
    blurb: "Hand-pulled ramen & rich tonkotsu broth",
    emoji: "🍜",
    gradient: "linear-gradient(135deg,#ffb547,#ff8a5c)",
    rating: 4.8,
    reviewsCount: 1932,
    etaMin: 24,
    distanceKm: 2.1,
    tags: ["noodle", "Cozy", "Soup"],
    sections: [
      {
        title: "Signature bowls",
        items: [
          { id: "sh1", name: "Golden Tonkotsu", desc: "18-hour pork broth, chashu, ajitama egg", price: 14.0, emoji: "🍜", tag: "Chef's pick" },
          { id: "sh2", name: "Spicy Miso Tantan", desc: "Sesame, chili oil, minced pork, scallion", price: 13.5, emoji: "🌶️" },
          { id: "sh3", name: "Yuzu Shio Clear", desc: "Light, citrusy, dangerously sippable", price: 12.5, emoji: "🥢" },
        ],
      },
      {
        title: "Little extras",
        items: [
          { id: "sh4", name: "Pork Gyoza (6)", desc: "Pan-seared, crispy skirt", price: 7.0, emoji: "🥟" },
          { id: "sh5", name: "Matcha Soft Serve", desc: "Stone-ground, faintly bitter, perfect", price: 5.0, emoji: "🍦" },
        ],
      },
    ],
    reviews: [
      { user: "broth_believer", rating: 5, text: "I watch the steam loop and forget I was hungry.", ago: "5h" },
      { user: "tired_intern", rating: 5, text: "Added the egg, removed the egg, added it again. Bliss.", ago: "2d" },
      { user: "minji", rating: 5, text: "No delivery fee because no delivery. Genius.", ago: "4d" },
    ],
  },
  {
    id: "drift-sushi",
    name: "Drift Sushi",
    blurb: "Omakase-style sets, ocean on a conveyor",
    emoji: "🍣",
    gradient: "linear-gradient(135deg,#4fd1a5,#3aa0ff)",
    rating: 4.9,
    reviewsCount: 1577,
    etaMin: 29,
    distanceKm: 3.4,
    tags: ["sushi", "Fresh", "Premium"],
    sections: [
      {
        title: "Sets",
        items: [
          { id: "ds1", name: "Drifter's Omakase", desc: "12 pieces, chef decides, you relax", price: 28.0, emoji: "🍣", tag: "Splurge" },
          { id: "ds2", name: "Salmon Trio", desc: "Nigiri, aburi, and roe — pink everywhere", price: 16.0, emoji: "🍥" },
          { id: "ds3", name: "Dragon Roll", desc: "Eel, avocado, the whole theatrical thing", price: 15.0, emoji: "🐉" },
        ],
      },
      {
        title: "Sips",
        items: [
          { id: "ds4", name: "Cold Sake Carafe", desc: "Junmai, served frosty", price: 9.0, emoji: "🍶" },
          { id: "ds5", name: "Yuzu Sparkling", desc: "Bright, fizzy, zero regret", price: 4.5, emoji: "🥂" },
        ],
      },
    ],
    reviews: [
      { user: "wallet_zen", rating: 5, text: "Ordered the $28 omakase nightly. Bank balance: untouched.", ago: "8h" },
      { user: "han.s", rating: 4, text: "The conveyor animation is hypnotic. Stayed 20 min.", ago: "2d" },
      { user: "quietquit", rating: 5, text: "All the luxury, none of the bill. This is the future.", ago: "6d" },
    ],
  },
  {
    id: "dough-theory",
    name: "Dough Theory",
    blurb: "Sourdough pizza, blistered & honest",
    emoji: "🍕",
    gradient: "linear-gradient(135deg,#ff5c8a,#b15cff)",
    rating: 4.7,
    reviewsCount: 1204,
    etaMin: 22,
    distanceKm: 1.8,
    tags: ["pizza", "Wood-fired", "Shareable"],
    sections: [
      {
        title: "From the oven",
        items: [
          { id: "dt1", name: "Hot Honey Pepperoni", desc: "Cup-and-char pepperoni, chili honey drizzle", price: 16.5, emoji: "🍕", tag: "🔥 #1" },
          { id: "dt2", name: "Burrata Margherita", desc: "San Marzano, torn basil, milky burrata", price: 15.0, emoji: "🧀" },
          { id: "dt3", name: "Mushroom Truffle", desc: "Wild mushrooms, fontina, truffle whisper", price: 17.0, emoji: "🍄" },
        ],
      },
      {
        title: "Add a little",
        items: [
          { id: "dt4", name: "Garlic Knots (5)", desc: "Buttery, herby, gone in seconds", price: 6.0, emoji: "🥖" },
          { id: "dt5", name: "Tiramisu Cup", desc: "Espresso-soaked, cocoa dusted", price: 6.5, emoji: "🍰" },
        ],
      },
    ],
    reviews: [
      { user: "carb_dreamer", rating: 5, text: "Built the perfect order. Closed the tab. Felt complete.", ago: "3h" },
      { user: "ex.foodie", rating: 5, text: "Cancelled my real subscriptions for this fake one.", ago: "1d" },
      { user: "lee.w", rating: 4, text: "The dough rising animation? Chef's kiss.", ago: "5d" },
    ],
  },
];
