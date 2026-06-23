import { useState } from "react";
import { CATEGORIES, RESTAURANTS } from "../data";
import type { Savings } from "../hooks/useSavings";
import { feedback, isMuted, setMuted } from "../lib/feedback";

export default function Home({
  savings,
  liveStreak,
  onOpen,
  cartCount,
  onCart,
}: {
  savings: Savings;
  liveStreak: number;
  onOpen: (id: string) => void;
  cartCount: number;
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
    <div className="h-[100dvh] overflow-y-auto pb-28">
      {/* Header */}
      <div className="px-5 pt-12 pb-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[12px] text-[var(--color-muted)]">Delivering nothing to</p>
            <h2 className="text-[19px] font-semibold flex items-center gap-1">
              📍 Your couch <span className="text-[var(--color-muted)] text-[13px]">▾</span>
            </h2>
          </div>
          <button
            onClick={toggleMute}
            aria-label={muted ? "Unmute" : "Mute"}
            className="w-11 h-11 rounded-full grid place-items-center text-[18px] bg-[var(--color-ink-2)] border border-[var(--color-line)] active:scale-90 transition"
          >
            {muted ? "🔇" : "🔊"}
          </button>
        </div>

        {/* Savings wallet */}
        <SavingsStrip savings={savings} liveStreak={liveStreak} />

        {/* Fake search */}
        <div className="mt-3 flex items-center gap-2 rounded-2xl bg-[var(--color-ink-3)] border border-[var(--color-line)] px-4 py-3">
          <span className="text-[var(--color-muted)]">🔍</span>
          <span className="text-[14px] text-[var(--color-muted)]">Search cravings you won't act on…</span>
        </div>
      </div>

      {/* Categories */}
      <div className="flex gap-2 overflow-x-auto px-5 py-3">
        {CATEGORIES.map((c) => {
          const on = cat === c.key;
          return (
            <button
              key={c.key}
              onClick={() => setCat(c.key)}
              className={`shrink-0 rounded-full px-4 py-2 text-[13px] font-medium border transition active:scale-95 ${
                on
                  ? "text-[#1a0f08] border-transparent bg-grad"
                  : "text-[var(--color-cream)] border-[var(--color-line)] bg-[var(--color-ink-2)]"
              }`}
            >
              <span className="mr-1">{c.emoji}</span>
              {c.label}
            </button>
          );
        })}
      </div>

      {/* Hero strip */}
      <div className="mx-5 my-2 rounded-3xl p-5 relative overflow-hidden"
        style={{ background: "linear-gradient(135deg,#211e2b,#16141d)", border: "1px solid var(--color-line)" }}>
        <div className="absolute -right-6 -top-6 text-[90px] opacity-20 floaty">🍜</div>
        <p className="text-[12px] tracking-wide text-[var(--color-peach)] font-semibold">TONIGHT ONLY · 0% OF EVERYTHING</p>
        <h3 className="mt-1 text-[20px] font-semibold leading-tight max-w-[15rem]">Free delivery. Free food. Free of charge. Forever.</h3>
        <p className="mt-2 text-[12.5px] text-[var(--color-muted)]">Because nothing is actually coming.</p>
      </div>

      {/* List */}
      <div className="px-5 mt-3">
        <h3 className="text-[15px] font-semibold mb-3">Open now · sort of</h3>
        <div className="flex flex-col gap-4 stagger">
          {list.map((r) => (
            <button
              key={r.id}
              onClick={() => onOpen(r.id)}
              className="text-left rounded-3xl overflow-hidden bg-[var(--color-ink-2)] border border-[var(--color-line)] active:scale-[0.98] transition"
            >
              <div className="h-28 relative grid place-items-center" style={{ background: r.gradient }}>
                <span className="text-[56px] drop-shadow-lg">{r.emoji}</span>
                <span className="absolute top-3 left-3 text-[11px] font-semibold bg-black/35 backdrop-blur px-2.5 py-1 rounded-full">
                  ⏱ {r.etaMin}–{r.etaMin + 7} min
                </span>
                <span className="absolute bottom-3 right-3 text-[11px] font-semibold bg-black/35 backdrop-blur px-2.5 py-1 rounded-full text-[var(--color-mint)]">
                  Free delivery
                </span>
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-[16px] font-semibold">{r.name}</h4>
                  <span className="text-[13px] font-semibold text-[var(--color-amber)]">★ {r.rating}</span>
                </div>
                <p className="text-[13px] text-[var(--color-muted)] mt-0.5">{r.blurb}</p>
                <p className="text-[12px] text-[var(--color-muted)]/80 mt-2">
                  {r.distanceKm} km · {r.reviewsCount.toLocaleString()} reviews
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {cartCount > 0 && <FloatingCart count={cartCount} onCart={onCart} />}
    </div>
  );
}

function FloatingCart({ count, onCart }: { count: number; onCart: () => void }) {
  return (
    <button
      onClick={onCart}
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3 rounded-full px-6 py-3.5 text-[#1a0f08] font-semibold active:scale-95 transition fade-up bg-grad shadow-grad"
      style={{ maxWidth: "400px" }}
    >
      🛒 <span>View cart</span>
      <span className="ml-1 bg-[#1a0f08] text-[var(--color-cream)] rounded-full w-6 h-6 grid place-items-center text-[12px]">{count}</span>
    </button>
  );
}

function SavingsStrip({ savings, liveStreak }: { savings: Savings; liveStreak: number }) {
  const fresh = savings.orders === 0;
  return (
    <div className="mt-4 rounded-2xl bg-[var(--color-ink-2)] border border-[var(--color-line)] p-4 flex items-center justify-between">
      <div>
        <p className="text-[11px] text-[var(--color-muted)] uppercase tracking-wide">
          {fresh ? "Your wallet" : "Saved by not ordering"}
        </p>
        {fresh ? (
          <p className="text-[15px] font-semibold mt-1">Still full. Let's keep it that way →</p>
        ) : (
          <p className="text-[24px] font-semibold text-grad leading-none mt-1 tabular-nums">
            ${savings.totalSaved.toFixed(2)}
          </p>
        )}
        {!fresh && (
          <p className="text-[11px] text-[var(--color-muted)] mt-1 tabular-nums">
            {savings.totalKcal.toLocaleString()} kcal · {savings.orders} phantom order{savings.orders === 1 ? "" : "s"}
          </p>
        )}
      </div>
      <div className="text-center shrink-0 ml-3">
        <div className="text-[22px]">{liveStreak > 0 ? "🔥" : "🌙"}</div>
        <div className="text-[15px] font-semibold tabular-nums leading-none">{liveStreak}</div>
        <div className="text-[10px] text-[var(--color-muted)]">night streak</div>
      </div>
    </div>
  );
}
