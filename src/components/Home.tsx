import { useState } from "react";
import { CATEGORIES, RESTAURANTS } from "../data";
import type { Restaurant } from "../types";
import type { Savings } from "../hooks/useSavings";
import { feedback, isMuted, setMuted } from "../lib/feedback";
import { foodImg } from "../lib/img";
import FoodImage from "./FoodImage";
import { Search, Pin, Star, Clock, ChevronDown, VolumeOn, VolumeOff, Bag, Heart } from "./icons";

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
  const [muted, setMutedState] = useState(isMuted());
  const list = RESTAURANTS.filter((r) => cat === "all" || r.tags.includes(cat));

  function toggleMute() {
    const next = !muted;
    setMuted(next);
    setMutedState(next);
    if (!next) feedback.tap();
  }

  return (
    <div className="h-full overflow-y-auto pb-28 bg-[var(--color-bg)]">
      {/* Sticky header */}
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

        {/* Search */}
        <div className="mt-3 flex items-center gap-2.5 rounded-xl bg-[var(--color-soft)] px-3.5 h-11">
          <Search size={19} className="text-[var(--color-ink-3)]" />
          <span className="text-[14.5px] text-[var(--color-ink-3)]">Search Phantom Eats</span>
        </div>
      </div>

      {/* Categories */}
      <div className="flex gap-5 overflow-x-auto hide-scroll px-5 pt-4 pb-1">
        {CATEGORIES.map((c) => {
          const on = cat === c.key;
          return (
            <button
              key={c.key}
              onClick={() => setCat(c.key)}
              className="shrink-0 flex flex-col items-center gap-1.5 active:scale-95 transition"
            >
              <div
                className={`w-14 h-14 rounded-2xl grid place-items-center text-[26px] transition ${
                  on ? "bg-[var(--color-ink)]" : "bg-[var(--color-soft)]"
                }`}
              >
                <span className={on ? "grayscale-0" : ""}>{c.emoji}</span>
              </div>
              <span className={`text-[12px] ${on ? "font-bold text-[var(--color-ink)]" : "font-medium text-[var(--color-ink-2)]"}`}>
                {c.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Savings / offers strip */}
      <div className="px-5 mt-3">
        <SavingsStrip savings={savings} liveStreak={liveStreak} />
      </div>

      {/* List */}
      <div className="px-5 mt-5">
        <h2 className="text-[20px] font-extrabold tracking-tight mb-3">
          {cat === "all" ? "Featured near you" : `${CATEGORIES.find((c) => c.key === cat)?.label}`}
        </h2>
        <div className="flex flex-col gap-6 stagger">
          {list.map((r) => (
            <RestaurantCard key={r.id} r={r} onOpen={() => onOpen(r.id)} />
          ))}
          {list.length === 0 && (
            <p className="text-[14px] text-[var(--color-ink-3)] py-8 text-center">Nothing in this category yet.</p>
          )}
        </div>
      </div>

      {cartCount > 0 && <FloatingCart count={cartCount} subtotal={subtotal} onCart={onCart} />}
    </div>
  );
}

function RestaurantCard({ r, onOpen }: { r: Restaurant; onOpen: () => void }) {
  return (
    <button onClick={onOpen} className="block w-full text-left active:opacity-95 transition">
      <div className="relative rounded-2xl overflow-hidden aspect-[16/10] shadow-soft">
        <FoodImage src={foodImg(r.photo, r.id, 720, 460)} alt={r.name} className="absolute inset-0" gradient={r.gradient} />
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
          <h3 className="text-[17px] font-extrabold tracking-tight leading-tight">{r.name}</h3>
          <span className="shrink-0 flex items-center gap-1 bg-[var(--color-soft)] rounded-full px-2 py-1">
            <Star size={12} className="text-[var(--color-ink)]" />
            <span className="text-[12.5px] font-bold tabular-nums">{r.rating}</span>
          </span>
        </div>
        <p className="text-[13.5px] text-[var(--color-ink-2)] mt-0.5">
          {r.category} · {r.priceLevel} · {r.distanceKm} km
        </p>
      </div>
    </button>
  );
}

function FloatingCart({ count, subtotal, onCart }: { count: number; subtotal: number; onCart: () => void }) {
  return (
    <div className="fixed bottom-0 left-1/2 -translate-x-1/2 z-30 w-full max-w-[430px] px-5 pb-5 pt-2 pointer-events-none">
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
    <div className="rounded-2xl border border-[var(--color-line)] bg-[var(--color-surface)] shadow-soft p-3.5 flex items-center gap-3">
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
