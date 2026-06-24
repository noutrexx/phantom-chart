import { useMemo, useState } from "react";
import { CATEGORIES, RESTAURANTS } from "../data";
import type { Restaurant } from "../types";
import type { Savings } from "../hooks/useSavings";
import { feedback, isMuted, setMuted } from "../lib/feedback";
import { foodImg } from "../lib/img";
import FoodImage from "./FoodImage";
import {
  Bag,
  ChevronDown,
  Clock,
  Heart,
  Pin,
  Search,
  Sliders,
  Star,
  VolumeOff,
  VolumeOn,
  X,
} from "./icons";

type FilterKey = "offers" | "fast" | "top" | "fees";

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: "offers", label: "Offers" },
  { key: "fast", label: "Under 30 min" },
  { key: "top", label: "Top rated" },
  { key: "fees", label: "Low fees" },
];

const COUPONS = ["CRAVE20", "CARTZEN", "VOIDPAY", "RITUAL15"];

function categoryPhoto(key: string): { photo: string; gradient: string; name: string } {
  const match = key === "all" ? RESTAURANTS[0] : RESTAURANTS.find((restaurant) => restaurant.tags.includes(key));
  const restaurant = match ?? RESTAURANTS[0];
  return { photo: restaurant.photo, gradient: restaurant.gradient, name: restaurant.name };
}

export default function Home({
  savings,
  liveStreak,
  onOpen,
  isFavorite,
  onToggleFavorite,
  cartCount,
  subtotal,
  onCart,
}: {
  savings: Savings;
  liveStreak: number;
  onOpen: (id: string) => void;
  isFavorite: (id: string) => boolean;
  onToggleFavorite: (id: string) => void;
  cartCount: number;
  subtotal: number;
  onCart: () => void;
}) {
  const [cat, setCat] = useState("all");
  const [query, setQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState<FilterKey[]>([]);
  const [muted, setMutedState] = useState(isMuted());
  const [coupon, setCoupon] = useState(COUPONS[0]);

  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    return RESTAURANTS.filter((r) => {
      const matchesCategory = cat === "all" || r.tags.includes(cat);
      const matchesQuery =
        !q ||
        [r.name, r.blurb, r.category, r.priceLevel, ...r.tags].some((value) => value.toLowerCase().includes(q)) ||
        r.sections.some((section) =>
          section.items.some((item) => [item.name, item.desc].some((value) => value.toLowerCase().includes(q)))
        );
      const matchesFilters = activeFilters.every((filter) => {
        if (filter === "offers") return r.rating >= 4.7;
        if (filter === "fast") return r.etaMin < 30;
        if (filter === "top") return r.rating >= 4.8;
        return true;
      });
      return matchesCategory && matchesQuery && matchesFilters;
    }).sort((a, b) => {
      if (activeFilters.includes("fast")) return a.etaMin - b.etaMin;
      if (activeFilters.includes("top")) return b.rating - a.rating;
      return b.rating - a.rating || a.etaMin - b.etaMin;
    });
  }, [activeFilters, cat, query]);

  function toggleMute() {
    const next = !muted;
    setMuted(next);
    setMutedState(next);
    if (!next) feedback.tap();
  }

  function toggleFilter(key: FilterKey) {
    feedback.tap();
    setActiveFilters((current) => (current.includes(key) ? current.filter((item) => item !== key) : [...current, key]));
  }

  function spinCoupon() {
    feedback.surprise();
    setCoupon((current) => {
      const index = COUPONS.indexOf(current);
      return COUPONS[(index + 1) % COUPONS.length];
    });
  }

  const heading = query.trim()
    ? `Results for "${query.trim()}"`
    : cat === "all"
      ? "Featured near you"
      : CATEGORIES.find((c) => c.key === cat)?.label ?? "Featured near you";
  const heroRestaurant = list[0] ?? RESTAURANTS[0];
  const tonightPicks = list.slice(0, 4);

  return (
    <div className="h-full overflow-y-auto pb-40 bg-[var(--color-bg)]">
      <div className="sticky top-0 z-20 bg-[var(--color-bg)]/95 backdrop-blur border-b border-[var(--color-line)] px-5 pt-3 pb-3">
        <div className="flex items-center justify-between">
          <button className="flex items-center gap-1.5 active:opacity-60 transition" aria-label="Change delivery location">
            <Pin size={18} className="text-[var(--color-ink)]" />
            <span className="text-[16px] font-extrabold tracking-tight">Your couch</span>
            <ChevronDown size={16} className="text-[var(--color-ink-2)]" />
          </button>
          <button
            onClick={toggleMute}
            aria-label={muted ? "Unmute" : "Mute"}
            className="w-9 h-9 rounded-full grid place-items-center bg-[var(--color-soft)] text-[var(--color-ink)] active:scale-90 transition"
          >
            {muted ? <VolumeOff size={18} /> : <VolumeOn size={18} />}
          </button>
        </div>

        <div className="mt-3 flex items-center gap-2.5 rounded-xl bg-[var(--color-soft)] px-3.5 h-11">
          <Search size={19} className="text-[var(--color-ink-3)]" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search Phantom Eats"
            className="min-w-0 flex-1 bg-transparent outline-none text-[14.5px] text-[var(--color-ink)] placeholder:text-[var(--color-ink-3)]"
            inputMode="search"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              aria-label="Clear search"
              className="w-7 h-7 rounded-full grid place-items-center active:bg-[var(--color-line)] transition"
            >
              <X size={15} className="text-[var(--color-ink-3)]" />
            </button>
          )}
        </div>
      </div>

      <div className="px-5 pt-3">
        <HomeHero savings={savings} liveStreak={liveStreak} coupon={coupon} onSpin={spinCoupon} featured={heroRestaurant} onOpen={onOpen} />
      </div>

      <div className="flex gap-2.5 overflow-x-auto hide-scroll px-5 pt-3 pb-1">
        {CATEGORIES.map((c) => {
          const on = cat === c.key;
          const visual = categoryPhoto(c.key);
          return (
            <button
              key={c.key}
              onClick={() => {
                feedback.tap();
                setCat(c.key);
              }}
              className={`shrink-0 h-11 rounded-full border py-1 pl-1.5 pr-3 flex items-center gap-2 active:scale-95 transition ${
                on ? "bg-[var(--color-ink)] border-[var(--color-ink)] text-white" : "bg-[var(--color-surface)] border-[var(--color-line)] text-[var(--color-ink)]"
              }`}
            >
              <FoodImage src={foodImg(visual.photo, `${c.key}-cat`, 90, 90)} alt={c.label} className="h-8 w-8 rounded-full shrink-0" gradient={visual.gradient} />
              <span className="text-[12.5px] font-extrabold whitespace-nowrap">{c.label}</span>
            </button>
          );
        })}
      </div>

      <div className="flex gap-2 overflow-x-auto hide-scroll px-5 pt-3">
        <span className="shrink-0 h-9 px-3 rounded-full bg-[var(--color-soft)] text-[var(--color-ink)] flex items-center gap-1.5 text-[12.5px] font-bold">
          <Sliders size={15} />
          Filters
        </span>
        {FILTERS.map((filter) => {
          const active = activeFilters.includes(filter.key);
          return (
            <button
              key={filter.key}
              onClick={() => toggleFilter(filter.key)}
              className={`shrink-0 h-9 px-3 rounded-full border text-[12.5px] font-bold transition ${
                active
                  ? "bg-[var(--color-ink)] border-[var(--color-ink)] text-white"
                  : "bg-[var(--color-surface)] border-[var(--color-line-2)] text-[var(--color-ink)]"
              }`}
            >
              {filter.label}
            </button>
          );
        })}
      </div>

      {tonightPicks.length > 0 && (
        <div className="pt-4">
          <div className="px-5 flex items-center justify-between">
            <h2 className="text-[17px] font-extrabold tracking-tight">Tonight picks</h2>
            <span className="text-[11.5px] font-bold text-[var(--color-ink-3)]">Top rated</span>
          </div>
          <div className="mt-2 flex gap-3 overflow-x-auto hide-scroll px-5 pb-1">
            {tonightPicks.map((restaurant) => (
              <button key={restaurant.id} onClick={() => onOpen(restaurant.id)} className="shrink-0 w-[132px] text-left active:scale-[0.98] transition">
                <div className="relative h-[92px] overflow-hidden rounded-2xl shadow-soft">
                  <FoodImage src={foodImg(restaurant.photo, `${restaurant.id}-pick`, 260, 190)} alt={restaurant.name} className="absolute inset-0" gradient={restaurant.gradient} />
                  <div className="absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-black/65 to-transparent" />
                  <span className="absolute bottom-2 left-2 right-2 truncate text-[12px] font-extrabold text-white">{restaurant.name}</span>
                </div>
                <p className="mt-1.5 truncate text-[11.5px] font-bold text-[var(--color-ink-2)]">{restaurant.etaMin}-{restaurant.etaMin + 7} min / {restaurant.rating}</p>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="px-5 mt-4">
        <div className="flex items-end justify-between gap-3 mb-3">
          <div>
            <h2 className="text-[20px] font-extrabold tracking-tight">{heading}</h2>
            <p className="text-[12.5px] text-[var(--color-ink-3)] mt-0.5 tabular-nums">
              {list.length} place{list.length === 1 ? "" : "s"} available now
            </p>
          </div>
          <span className="shrink-0 rounded-full bg-[var(--color-green)]/10 px-2.5 py-1 text-[11.5px] font-extrabold text-[var(--color-green-ink)]">Crave score</span>
        </div>
        <div className="flex flex-col gap-4 stagger">
          {list.map((r, index) => (
            <RestaurantCard key={r.id} r={r} rank={index + 1} onOpen={() => onOpen(r.id)} fav={isFavorite(r.id)} onToggleFav={() => onToggleFavorite(r.id)} />
          ))}
          {list.length === 0 && (
            <div className="py-10 text-center">
              <p className="text-[15px] font-bold">No phantom meals found</p>
              <p className="text-[13px] text-[var(--color-ink-2)] mt-1">Try clearing a filter or searching another craving.</p>
            </div>
          )}
        </div>
      </div>

      {cartCount > 0 && <FloatingCart count={cartCount} subtotal={subtotal} onCart={onCart} />}
    </div>
  );
}

function HomeHero({
  savings,
  liveStreak,
  coupon,
  onSpin,
  featured,
  onOpen,
}: {
  savings: Savings;
  liveStreak: number;
  coupon: string;
  onSpin: () => void;
  featured: Restaurant;
  onOpen: (id: string) => void;
}) {
  return (
    <div className="relative h-[204px] overflow-hidden rounded-[22px] bg-[var(--color-ink)] text-white shadow-lift">
      <FoodImage src={foodImg(featured.photo, `${featured.id}-home-hero`, 760, 420)} alt={featured.name} className="absolute inset-0" gradient={featured.gradient} />
      <div className="absolute inset-0 bg-gradient-to-t from-black/76 via-black/34 to-black/12" />
      <div className="absolute inset-x-0 bottom-0 p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <p className="text-[10.5px] font-extrabold tracking-[0.16em] uppercase text-white/70">Tonight's pick</p>
            <h1 className="mt-1 truncate text-[25px] font-extrabold tracking-tight leading-tight">{featured.name}</h1>
            <p className="mt-1 line-clamp-2 text-[12.5px] text-white/78 leading-snug">{featured.blurb}</p>
          </div>
          <div className="shrink-0 rounded-2xl bg-white px-3 py-2 text-right text-[var(--color-ink)] shadow-soft">
            <p className="text-[18px] font-extrabold tabular-nums leading-none">${savings.totalSaved.toFixed(0)}</p>
            <p className="text-[10px] font-bold text-[var(--color-ink-3)] mt-1">saved</p>
          </div>
        </div>

        <div className="mt-3 grid grid-cols-3 gap-2">
          <HeroStat value={String(savings.orders)} label="orders" />
          <HeroStat value={`${liveStreak}x`} label="streak" />
          <HeroStat value={coupon} label="coupon" />
        </div>

        <div className="mt-3 grid grid-cols-[1fr_auto] gap-2">
          <button onClick={() => onOpen(featured.id)} className="h-10 rounded-xl bg-white text-[var(--color-ink)] text-[13px] font-extrabold active:scale-[0.98] transition">
            Open place
          </button>
          <button onClick={onSpin} className="h-10 rounded-xl bg-white/14 px-3 text-[12.5px] font-extrabold text-white backdrop-blur active:scale-[0.98] transition">
            Refresh
          </button>
        </div>
      </div>
    </div>
  );
}

function HeroStat({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-xl bg-white/10 px-2.5 py-2">
      <p className="text-[14px] font-extrabold tabular-nums leading-none truncate">{value}</p>
      <p className="text-[10px] text-white/55 font-bold mt-1">{label}</p>
    </div>
  );
}

function RestaurantCard({ r, rank, onOpen, fav, onToggleFav }: { r: Restaurant; rank: number; onOpen: () => void; fav: boolean; onToggleFav: () => void }) {
  const deal = r.rating >= 4.8 ? "Premium checkout ritual" : "Simulated delivery fee";
  const fast = r.etaMin < 21;

  return (
    <div className="relative">
      <button onClick={onOpen} aria-label={`Open ${r.name}`} className="block w-full text-left active:opacity-95 transition">
      <div className="rounded-[18px] border border-[var(--color-line)] bg-[var(--color-surface)] shadow-soft overflow-hidden">
      <div className="relative overflow-hidden aspect-[16/9]">
        <FoodImage src={foodImg(r.photo, r.id, 720, 460)} alt={r.name} className="absolute inset-0" gradient={r.gradient} />
        <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-black/34 to-transparent" />
        <span className="absolute top-3 left-3 bg-white text-[11.5px] font-extrabold rounded-full px-2.5 py-1.5 shadow-soft tabular-nums">
          #{rank} near you
        </span>
        <span className="absolute bottom-3 left-3 flex items-center gap-1.5 bg-white rounded-full pl-2 pr-3 py-1.5 shadow-soft">
          <Clock size={14} className="text-[var(--color-ink)]" />
          <span className="text-[12.5px] font-bold tracking-tight">{r.etaMin}-{r.etaMin + 7} min</span>
        </span>
        <span className="absolute bottom-3 right-3 bg-[var(--color-green)] text-white text-[11.5px] font-bold rounded-full px-2.5 py-1.5">
          Mock pay
        </span>
      </div>
      <div className="p-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="text-[17px] font-extrabold tracking-tight leading-tight truncate">{r.name}</h3>
            <p className="text-[13px] text-[var(--color-ink-2)] mt-0.5 truncate">
              {r.category} / {r.priceLevel} / {r.distanceKm} km away
            </p>
          </div>
          <span className="shrink-0 flex items-center gap-1 bg-[var(--color-soft)] rounded-full px-2.5 py-1">
            <Star size={12} className="text-[var(--color-ink)]" />
            <span className="text-[12.5px] font-bold tabular-nums">{r.rating}</span>
          </span>
        </div>
        <div className="mt-2.5 flex items-center gap-2 overflow-hidden">
          <span className="shrink-0 rounded-full bg-[var(--color-green)]/10 text-[var(--color-green-ink)] px-2.5 py-1 text-[11.5px] font-extrabold">
            {deal}
          </span>
          {fast && <span className="shrink-0 rounded-full bg-[var(--color-soft)] px-2.5 py-1 text-[11.5px] font-bold">Fast favorite</span>}
          <span className="min-w-0 truncate text-[12px] text-[var(--color-ink-3)]">{r.blurb}</span>
        </div>
      </div>
      </div>
    </button>
      <button
        onClick={onToggleFav}
        aria-label={fav ? `Remove ${r.name} from favorites` : `Save ${r.name}`}
        className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-white/90 backdrop-blur grid place-items-center shadow-soft active:scale-90 transition"
      >
        <Heart size={18} className={fav ? "text-[var(--color-red)] fill-current" : "text-[var(--color-ink)]"} />
      </button>
    </div>
  );
}

function FloatingCart({ count, subtotal, onCart }: { count: number; subtotal: number; onCart: () => void }) {
  return (
    <div className="fixed bottom-[72px] left-1/2 -translate-x-1/2 z-30 w-full max-w-[430px] px-5 pb-3 pt-2 pointer-events-none">
      <button
        onClick={onCart}
        className="pointer-events-auto w-full flex items-center justify-between rounded-[14px] bg-[var(--color-ink)] text-white pl-4 pr-3 py-3 shadow-lift active:scale-[0.98] transition fade-up"
      >
        <span className="flex items-center gap-2.5">
          <span className="relative">
            <Bag size={22} />
            <span className="absolute -top-2 -right-2 bg-[var(--color-green)] text-white text-[10px] font-bold rounded-full w-4 h-4 grid place-items-center tabular-nums">
              {count}
            </span>
          </span>
          <span className="text-[15px] font-bold">View cart</span>
        </span>
        <span className="text-[15px] font-bold tabular-nums">${subtotal.toFixed(2)}</span>
      </button>
    </div>
  );
}
