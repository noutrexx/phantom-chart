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
  Compass,
  Heart,
  HomeIcon,
  Pin,
  Receipt,
  Search,
  Sliders,
  Star,
  Tag,
  Trophy,
  User,
  VolumeOff,
  VolumeOn,
  X,
} from "./icons";

type FilterKey = "offers" | "fast" | "top" | "free";

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: "offers", label: "Offers" },
  { key: "fast", label: "Under 30 min" },
  { key: "top", label: "Top rated" },
  { key: "free", label: "Free delivery" },
];

const DEALS = [
  {
    title: "$0 comfort fee",
    copy: "Build the cart, skip the charge.",
    accent: "bg-[var(--color-green)]",
  },
  {
    title: "Late-night save streak",
    copy: "Beat one craving and keep the run alive.",
    accent: "bg-[var(--color-amber)]",
  },
  {
    title: "Top phantom picks",
    copy: "High intent, zero checkout damage.",
    accent: "bg-[var(--color-red)]",
  },
];

export default function Home({
  savings,
  liveStreak,
  onOpen,
  cartCount,
  subtotal,
  onCart,
}: {
  savings: Savings;
  liveStreak: number;
  onOpen: (id: string) => void;
  cartCount: number;
  subtotal: number;
  onCart: () => void;
}) {
  const [cat, setCat] = useState("all");
  const [query, setQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState<FilterKey[]>([]);
  const [muted, setMutedState] = useState(isMuted());

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

  const heading = query.trim()
    ? `Results for "${query.trim()}"`
    : cat === "all"
      ? "Featured near you"
      : CATEGORIES.find((c) => c.key === cat)?.label ?? "Featured near you";

  return (
    <div className="h-full overflow-y-auto pb-40 bg-[var(--color-bg)]">
      <div className="sticky top-0 z-20 bg-[var(--color-bg)]/95 backdrop-blur border-b border-[var(--color-line)] px-5 pt-3 pb-3">
        <div className="flex items-center justify-between">
          <button className="flex items-center gap-1.5 active:opacity-60 transition">
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

      <div className="flex gap-5 overflow-x-auto hide-scroll px-5 pt-4 pb-1">
        {CATEGORIES.map((c) => {
          const on = cat === c.key;
          return (
            <button
              key={c.key}
              onClick={() => {
                feedback.tap();
                setCat(c.key);
              }}
              className="shrink-0 flex flex-col items-center gap-1.5 active:scale-95 transition"
            >
              <div className={`w-14 h-14 rounded-2xl grid place-items-center text-[26px] transition ${on ? "bg-[var(--color-ink)]" : "bg-[var(--color-soft)]"}`}>
                <span>{c.emoji}</span>
              </div>
              <span className={`text-[12px] ${on ? "font-bold text-[var(--color-ink)]" : "font-medium text-[var(--color-ink-2)]"}`}>
                {c.label}
              </span>
            </button>
          );
        })}
      </div>

      <div className="flex gap-2 overflow-x-auto hide-scroll px-5 pt-4">
        <span className="shrink-0 h-9 px-3 rounded-full bg-[var(--color-soft)] text-[var(--color-ink)] flex items-center gap-1.5 text-[13px] font-bold">
          <Sliders size={15} />
          Filters
        </span>
        {FILTERS.map((filter) => {
          const active = activeFilters.includes(filter.key);
          return (
            <button
              key={filter.key}
              onClick={() => toggleFilter(filter.key)}
              className={`shrink-0 h-9 px-3 rounded-full border text-[13px] font-bold transition ${
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

      <div className="px-5 mt-4">
        <DealCarousel />
      </div>

      <div className="px-5 mt-3">
        <SavingsStrip savings={savings} liveStreak={liveStreak} />
      </div>

      <div className="px-5 mt-5">
        <div className="flex items-end justify-between gap-3 mb-3">
          <div>
            <h2 className="text-[20px] font-extrabold tracking-tight">{heading}</h2>
            <p className="text-[12.5px] text-[var(--color-ink-3)] mt-0.5 tabular-nums">
              {list.length} place{list.length === 1 ? "" : "s"} available now
            </p>
          </div>
          <span className="shrink-0 text-[12px] font-bold text-[var(--color-green-ink)]">Sorted by crave score</span>
        </div>
        <div className="flex flex-col gap-6 stagger">
          {list.map((r, index) => (
            <RestaurantCard key={r.id} r={r} rank={index + 1} onOpen={() => onOpen(r.id)} />
          ))}
          {list.length === 0 && (
            <div className="py-10 text-center">
              <p className="text-[15px] font-bold">No phantom meals found</p>
              <p className="text-[13px] text-[var(--color-ink-2)] mt-1">Try clearing a filter or searching another craving.</p>
            </div>
          )}
        </div>
      </div>

      <BottomNav />
      {cartCount > 0 && <FloatingCart count={cartCount} subtotal={subtotal} onCart={onCart} />}
    </div>
  );
}

function DealCarousel() {
  return (
    <div className="flex gap-3 overflow-x-auto hide-scroll">
      {DEALS.map((deal) => (
        <div key={deal.title} className="shrink-0 w-[82%] rounded-2xl bg-[var(--color-ink)] text-white p-4 shadow-lift overflow-hidden relative">
          <div className={`absolute -right-8 -top-8 w-28 h-28 rounded-full ${deal.accent} opacity-95`} />
          <div className="relative">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/12 px-2.5 py-1 text-[11px] font-bold">
              <Tag size={12} />
              Tonight's Phantom Deal
            </span>
            <h3 className="mt-3 text-[21px] font-extrabold tracking-tight leading-tight">{deal.title}</h3>
            <p className="mt-1.5 text-[13px] text-white/72 leading-snug max-w-[14rem]">{deal.copy}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function RestaurantCard({ r, rank, onOpen }: { r: Restaurant; rank: number; onOpen: () => void }) {
  const deal = r.rating >= 4.8 ? "Spend $0, save everything" : "$0 delivery fee";
  const fast = r.etaMin < 21;

  return (
    <button onClick={onOpen} className="block w-full text-left active:opacity-95 transition">
      <div className="relative rounded-xl overflow-hidden aspect-[16/9] shadow-soft">
        <FoodImage src={foodImg(r.photo, r.id, 720, 460)} alt={r.name} className="absolute inset-0" gradient={r.gradient} />
        <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-black/34 to-transparent" />
        <span className="absolute top-3 left-3 bg-white text-[11.5px] font-extrabold rounded-full px-2.5 py-1.5 shadow-soft tabular-nums">
          #{rank} near you
        </span>
        <span className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 backdrop-blur grid place-items-center shadow-soft">
          <Heart size={18} className="text-[var(--color-ink)]" />
        </span>
        <span className="absolute bottom-3 left-3 flex items-center gap-1.5 bg-white rounded-full pl-2 pr-3 py-1.5 shadow-soft">
          <Clock size={14} className="text-[var(--color-ink)]" />
          <span className="text-[12.5px] font-bold tracking-tight">{r.etaMin}-{r.etaMin + 7} min</span>
        </span>
        <span className="absolute bottom-3 right-3 bg-[var(--color-green)] text-white text-[11.5px] font-bold rounded-full px-2.5 py-1.5">
          Free delivery
        </span>
      </div>
      <div className="pt-2.5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="text-[17px] font-extrabold tracking-tight leading-tight truncate">{r.name}</h3>
            <p className="text-[13.5px] text-[var(--color-ink-2)] mt-0.5 truncate">
              {r.category} · {r.priceLevel} · {r.distanceKm} km
            </p>
          </div>
          <span className="shrink-0 flex items-center gap-1 bg-[var(--color-soft)] rounded-full px-2 py-1">
            <Star size={12} className="text-[var(--color-ink)]" />
            <span className="text-[12.5px] font-bold tabular-nums">{r.rating}</span>
          </span>
        </div>
        <div className="mt-2 flex items-center gap-2 overflow-hidden">
          <span className="shrink-0 rounded-full bg-[var(--color-green)]/10 text-[var(--color-green-ink)] px-2.5 py-1 text-[11.5px] font-extrabold">
            {deal}
          </span>
          {fast && <span className="shrink-0 rounded-full bg-[var(--color-soft)] px-2.5 py-1 text-[11.5px] font-bold">Fast favorite</span>}
          <span className="min-w-0 truncate text-[12px] text-[var(--color-ink-3)]">{r.blurb}</span>
        </div>
      </div>
    </button>
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

function SavingsStrip({ savings, liveStreak }: { savings: Savings; liveStreak: number }) {
  const fresh = savings.orders === 0;
  return (
    <div className="rounded-xl border border-[var(--color-line)] bg-[var(--color-surface)] shadow-soft p-3.5 flex items-center gap-3">
      <div className="w-11 h-11 rounded-xl bg-[var(--color-green)]/12 grid place-items-center text-[22px]">
        {liveStreak > 0 ? "🔥" : "💸"}
      </div>
      <div className="flex-1 min-w-0">
        {fresh ? (
          <>
            <p className="text-[14px] font-bold tracking-tight">Your wallet is full</p>
            <p className="text-[12.5px] text-[var(--color-ink-2)]">Order nothing tonight and keep it that way.</p>
          </>
        ) : (
          <>
            <p className="text-[14px] font-bold tracking-tight">
              <span className="text-[var(--color-green-ink)] tabular-nums">${savings.totalSaved.toFixed(2)}</span> saved by not ordering
            </p>
            <p className="text-[12.5px] text-[var(--color-ink-2)] tabular-nums">
              {savings.totalKcal.toLocaleString()} kcal avoided · {savings.orders} phantom order{savings.orders === 1 ? "" : "s"}
            </p>
          </>
        )}
      </div>
      {liveStreak > 0 && (
        <div className="text-center shrink-0">
          <div className="text-[18px] font-extrabold tabular-nums leading-none">{liveStreak}</div>
          <div className="text-[10px] text-[var(--color-ink-3)] font-medium">streak</div>
        </div>
      )}
    </div>
  );
}

function BottomNav() {
  const items = [
    { label: "Home", icon: HomeIcon, active: true },
    { label: "Browse", icon: Compass },
    { label: "Rewards", icon: Trophy },
    { label: "Orders", icon: Receipt },
    { label: "Account", icon: User },
  ];

  return (
    <div className="fixed bottom-0 left-1/2 -translate-x-1/2 z-20 w-full max-w-[430px] border-t border-[var(--color-line)] bg-[var(--color-bg)]/96 backdrop-blur px-3 pb-2 pt-2">
      <div className="grid grid-cols-5">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <button key={item.label} className={`h-12 flex flex-col items-center justify-center gap-0.5 ${item.active ? "text-[var(--color-ink)]" : "text-[var(--color-ink-3)]"}`}>
              <Icon size={18} stroke={item.active ? 2.4 : 2} />
              <span className="text-[10.5px] font-bold">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
