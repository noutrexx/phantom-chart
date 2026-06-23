export type MenuItem = {
  id: string;
  name: string;
  desc: string;
  price: number;
  emoji: string;
  tag?: string;
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
  gradient: string;
  rating: number;
  reviewsCount: number;
  etaMin: number;
  distanceKm: number;
  tags: string[];
  sections: { title: string; items: MenuItem[] }[];
  reviews: Review[];
};

export type CartLine = { item: MenuItem; qty: number };

export type Screen = "splash" | "home" | "restaurant" | "cart" | "tracking";
