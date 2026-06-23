export type MenuItem = {
  id: string;
  name: string;
  desc: string;
  price: number;
  emoji: string;
  photo: string; // image search keyword
  tag?: string;
  popular?: boolean;
};

export type OptionChoice = { id: string; label: string; delta: number };

export type OptionGroup = {
  id: string;
  label: string;
  type: "single" | "multi";
  required?: boolean;
  choices: OptionChoice[];
};

export type Review = {
  user: string;
  rating: number;
  text: string;
  ago: string;
};

export type Restaurant = {
  id: string;
  name: string;
  blurb: string;
  emoji: string;
  photo: string; // hero image search keyword
  gradient: string;
  rating: number;
  reviewsCount: number;
  etaMin: number;
  distanceKm: number;
  priceLevel: string; // e.g. "$$"
  category: string; // display cuisine
  tags: string[];
  sections: { title: string; items: MenuItem[] }[];
  reviews: Review[];
};

// A line in the cart. `lineId` is unique per (item + chosen options + note),
// so the same dish with different options becomes separate lines.
export type CartLine = {
  lineId: string;
  item: MenuItem;
  qty: number;
  unitPrice: number; // base price + option deltas
  selections?: string[]; // human-readable chosen option labels
  note?: string;
};

export type OrderOutcome = "normal" | "early" | "lost" | "gift";

export type OrderItem = {
  id: string;
  name: string;
  photo: string;
  qty: number;
  unitPrice: number;
  selections?: string[];
};

export type Order = {
  id: string;
  restaurantId: string;
  restaurantName: string;
  restaurantPhoto: string;
  items: OrderItem[];
  subtotal: number;
  placedAt: number; // epoch ms
  etaMin: number; // real delivery minutes
  outcome: OrderOutcome;
  status: "active" | "delivered";
  rating?: number;
  review?: string;
};

export type Screen = "splash" | "home" | "restaurant" | "cart" | "tracking";
