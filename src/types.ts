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

export type CartLine = { item: MenuItem; qty: number };

export type Screen = "splash" | "home" | "restaurant" | "cart" | "tracking";
