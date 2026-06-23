import type { Restaurant } from "./types";

export const CATEGORIES = [
  { key: "all", label: "All", emoji: "🍽️" },
  { key: "burger", label: "Burgers", emoji: "🍔" },
  { key: "noodle", label: "Noodles", emoji: "🍜" },
  { key: "sushi", label: "Sushi", emoji: "🍣" },
  { key: "pizza", label: "Pizza", emoji: "🍕" },
  { key: "sweet", label: "Dessert", emoji: "🍰" },
  { key: "coffee", label: "Coffee", emoji: "☕" },
];

export const RESTAURANTS: Restaurant[] = [
  {
    id: "midnight-diner",
    name: "Midnight Diner",
    blurb: "Smash burgers · Loaded fries · Shakes",
    emoji: "🍔",
    photo: "1568901346375-23c9450c58cd",
    gradient: "linear-gradient(135deg,#f7b733,#fc4a1a)",
    rating: 4.9,
    reviewsCount: 2841,
    etaMin: 18,
    distanceKm: 1.2,
    priceLevel: "$$",
    category: "American",
    tags: ["burger"],
    sections: [
      {
        title: "Popular",
        items: [
          { id: "md1", name: "The Phantom Double", desc: "Two smashed patties, molten cheddar, house sauce, pickles", price: 12.5, emoji: "🍔", photo: "1571091718767-18b5b1457add", tag: "Popular", popular: true },
          { id: "md2", name: "Truffle Loaded Fries", desc: "Hand-cut fries, parmesan, truffle oil, chives", price: 8.0, emoji: "🍟", photo: "1573080496219-bb080dd4f877", popular: true },
          { id: "md3", name: "Crispy Chicken Stack", desc: "Buttermilk-fried chicken, pickles, honey heat", price: 11.0, emoji: "🍗", photo: "1626645738196-c2a7c87a8f58" },
        ],
      },
      {
        title: "Sides & drinks",
        items: [
          { id: "md4", name: "Mozzarella Lava Sticks", desc: "Six pieces, marinara dip", price: 6.5, emoji: "🧀", photo: "1573080496219-bb080dd4f877" },
          { id: "md5", name: "Vanilla Malt Shake", desc: "Thick, hand-spun, real vanilla bean", price: 5.5, emoji: "🥤", photo: "1572490122747-3968b75cc699" },
        ],
      },
    ],
    reviews: [
      { user: "nightowl", rating: 5, text: "Browsed at 3am for 40 minutes. Slept great. Spent nothing.", ago: "2h" },
      { user: "soft.landing", rating: 5, text: "The fries don't exist and I've never been happier.", ago: "1d" },
      { user: "j.kim", rating: 4, text: "Cart full, wallet untouched. Honestly therapeutic.", ago: "3d" },
    ],
  },
  {
    id: "slurp-house",
    name: "Slurp House",
    blurb: "Hand-pulled ramen · Rich tonkotsu broth",
    emoji: "🍜",
    photo: "1569718212165-3a8278d5f624",
    gradient: "linear-gradient(135deg,#f5a623,#f76b1c)",
    rating: 4.8,
    reviewsCount: 1932,
    etaMin: 24,
    distanceKm: 2.1,
    priceLevel: "$$",
    category: "Japanese",
    tags: ["noodle"],
    sections: [
      {
        title: "Signature bowls",
        items: [
          { id: "sh1", name: "Golden Tonkotsu", desc: "18-hour pork broth, chashu, ajitama egg, scallion", price: 14.0, emoji: "🍜", photo: "1591814468924-caf88d1232e1", tag: "Chef's pick", popular: true },
          { id: "sh2", name: "Spicy Miso Tantanmen", desc: "Sesame, chili oil, minced pork, bok choy", price: 13.5, emoji: "🌶️", photo: "1557872943-16a5ac26437e", popular: true },
          { id: "sh3", name: "Yuzu Shio Clear", desc: "Light citrus broth, chicken, bamboo shoots", price: 12.5, emoji: "🥢", photo: "1569718212165-3a8278d5f624" },
        ],
      },
      {
        title: "Sides",
        items: [
          { id: "sh4", name: "Pork Gyoza (6)", desc: "Pan-seared, crispy skirt, ponzu", price: 7.0, emoji: "🥟", photo: "1496116218417-1a781b1c416c" },
          { id: "sh5", name: "Matcha Soft Serve", desc: "Stone-ground matcha, faintly bitter", price: 5.0, emoji: "🍦", photo: "1515823064-d6e0c04616a7" },
        ],
      },
    ],
    reviews: [
      { user: "broth.believer", rating: 5, text: "I watch the steam loop and forget I was hungry.", ago: "5h" },
      { user: "tired.intern", rating: 5, text: "Added the egg, removed it, added it again. Bliss.", ago: "2d" },
      { user: "minji", rating: 5, text: "No delivery fee because no delivery. Genius.", ago: "4d" },
    ],
  },
  {
    id: "drift-sushi",
    name: "Drift Sushi",
    blurb: "Omakase sets · Nigiri · Signature rolls",
    emoji: "🍣",
    photo: "1579871494447-9811cf80d66c",
    gradient: "linear-gradient(135deg,#11998e,#38ef7d)",
    rating: 4.9,
    reviewsCount: 1577,
    etaMin: 29,
    distanceKm: 3.4,
    priceLevel: "$$$",
    category: "Sushi",
    tags: ["sushi"],
    sections: [
      {
        title: "Sets",
        items: [
          { id: "ds1", name: "Drifter's Omakase", desc: "12 chef-selected pieces, daily catch", price: 28.0, emoji: "🍣", photo: "1583623025817-d180a2221d0a", tag: "Premium", popular: true },
          { id: "ds2", name: "Salmon Trio", desc: "Nigiri, aburi, and ikura — pink everywhere", price: 16.0, emoji: "🍥", photo: "1607301406259-dfb186e15de8", popular: true },
          { id: "ds3", name: "Dragon Roll", desc: "Eel, avocado, cucumber, unagi glaze", price: 15.0, emoji: "🐉", photo: "1617196034796-73dfa7b1fd56" },
        ],
      },
      {
        title: "Drinks",
        items: [
          { id: "ds4", name: "Cold Junmai Sake", desc: "Served frosty, 180ml carafe", price: 9.0, emoji: "🍶", photo: "1514362545857-3bc16c4c7d1b" },
          { id: "ds5", name: "Yuzu Sparkling", desc: "Bright, fizzy, zero alcohol", price: 4.5, emoji: "🥂", photo: "1536935338788-846bb9981813" },
        ],
      },
    ],
    reviews: [
      { user: "wallet.zen", rating: 5, text: "Ordered the $28 omakase nightly. Balance: untouched.", ago: "8h" },
      { user: "han.s", rating: 4, text: "The conveyor animation is hypnotic. Stayed 20 min.", ago: "2d" },
      { user: "quietquit", rating: 5, text: "All the luxury, none of the bill. This is the future.", ago: "6d" },
    ],
  },
  {
    id: "dough-theory",
    name: "Dough Theory",
    blurb: "Sourdough pizza · Wood-fired · Shareable",
    emoji: "🍕",
    photo: "1513104890138-7c749659a591",
    gradient: "linear-gradient(135deg,#ee0979,#ff6a00)",
    rating: 4.7,
    reviewsCount: 1204,
    etaMin: 22,
    distanceKm: 1.8,
    priceLevel: "$$",
    category: "Italian",
    tags: ["pizza"],
    sections: [
      {
        title: "From the oven",
        items: [
          { id: "dt1", name: "Hot Honey Pepperoni", desc: "Cup-and-char pepperoni, chili honey drizzle", price: 16.5, emoji: "🍕", photo: "1628840042765-356cda07504e", tag: "Popular", popular: true },
          { id: "dt2", name: "Burrata Margherita", desc: "San Marzano, torn basil, creamy burrata", price: 15.0, emoji: "🧀", photo: "1574071318508-1cdbab80d002", popular: true },
          { id: "dt3", name: "Wild Mushroom & Truffle", desc: "Fontina, thyme, truffle cream", price: 17.0, emoji: "🍄", photo: "1604382354936-07c5d9983bd3" },
        ],
      },
      {
        title: "Sides & dessert",
        items: [
          { id: "dt4", name: "Garlic Knots (5)", desc: "Buttery, herby, parmesan dust", price: 6.0, emoji: "🥖", photo: "1573140247632-f8fd74997d5c" },
          { id: "dt5", name: "Tiramisu Cup", desc: "Espresso-soaked, mascarpone, cocoa", price: 6.5, emoji: "🍰", photo: "1571877227200-a0d98ea607e9" },
        ],
      },
    ],
    reviews: [
      { user: "carb.dreamer", rating: 5, text: "Built the perfect order, closed the tab, felt complete.", ago: "3h" },
      { user: "ex.foodie", rating: 5, text: "Cancelled my real subscriptions for this fake one.", ago: "1d" },
      { user: "lee.w", rating: 4, text: "The dough-rising animation is chef's kiss.", ago: "5d" },
    ],
  },
];
