import { useState } from "react";
import type { CartLine, MenuItem, Restaurant } from "../types";
import { feedback } from "../lib/feedback";

export default function RestaurantView({
  restaurant,
  cart,
  cartCount,
  subtotal,
  onBack,
  onAdd,
  onCart,
}: {
  restaurant: Restaurant;
  cart: CartLine[];
  cartCount: number;
  subtotal: number;
  onBack: () => void;
  onAdd: (item: MenuItem) => void;
  onCart: () => void;
}) {
  const [tab, setTab] = useState<"menu" | "reviews">("menu");
  const [popped, setPopped] = useState<string | null>(null);

  function add(item: MenuItem) {
    onAdd(item);
    feedback.add();
    setPopped(item.id);
    window.setTimeout(() => setPopped((p) => (p === item.id ? null : p)), 360);
  }

  function qtyOf(id: string) {
    return cart.find((l) => l.item.id === id)?.qty ?? 0;
  }

  return (
    <div className="h-[100dvh] overflow-y-auto pb-28">
      {/* Hero */}
      <div className="h-44 relative grid place-items-center" style={{ background: restaurant.gradient }}>
        <button
          onClick={onBack}
          className="absolute top-12 left-4 w-10 h-10 rounded-full grid place-items-center bg-black/35 backdrop-blur text-[18px] active:scale-90 transition"
        >
          ‹
        </button>
        <span className="text-[76px] drop-shadow-xl floaty">{restaurant.emoji}</span>
      </div>

      {/* Info card */}
      <div className="-mt-8 mx-4 rounded-3xl bg-[var(--color-ink-2)] border border-[var(--color-line)] p-5 relative z-10">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-[22px] font-semibold">{restaurant.name}</h2>
            <p className="text-[13px] text-[var(--color-muted)] mt-1 max-w-[15rem]">{restaurant.blurb}</p>
          </div>
          <div className="text-right shrink-0 ml-3">
            <div className="text-[15px] font-semibold text-[var(--color-amber)]">★ {restaurant.rating}</div>
            <div className="text-[11px] text-[var(--color-muted)]">{restaurant.reviewsCount.toLocaleString()}</div>
          </div>
        </div>
        <div className="flex gap-2 mt-4 text-[12px]">
          <span className="rounded-full bg-[var(--color-ink-3)] px-3 py-1.5">⏱ {restaurant.etaMin} min</span>
          <span className="rounded-full bg-[var(--color-ink-3)] px-3 py-1.5 text-[var(--color-mint)]">Free delivery</span>
          <span className="rounded-full bg-[var(--color-ink-3)] px-3 py-1.5">{restaurant.distanceKm} km</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-6 px-6 mt-6 border-b border-[var(--color-line)]">
        {(["menu", "reviews"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`pb-3 text-[14px] font-medium capitalize border-b-2 -mb-px transition ${
              tab === t ? "border-[var(--color-peach)] text-[var(--color-cream)]" : "border-transparent text-[var(--color-muted)]"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "menu" ? (
        <div className="px-4 mt-5">
          {restaurant.sections.map((sec) => (
            <div key={sec.title} className="mb-7">
              <h3 className="text-[15px] font-semibold mb-3 px-1">{sec.title}</h3>
              <div className="flex flex-col gap-3">
                {sec.items.map((item) => {
                  const q = qtyOf(item.id);
                  return (
                    <div
                      key={item.id}
                      className="flex gap-3 rounded-2xl bg-[var(--color-ink-2)] border border-[var(--color-line)] p-3"
                    >
                      <div className="w-16 h-16 shrink-0 rounded-xl grid place-items-center text-[34px] bg-[var(--color-ink-3)]">
                        {item.emoji}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="text-[14.5px] font-semibold truncate">{item.name}</h4>
                          {item.tag && (
                            <span className="text-[10px] font-semibold text-[var(--color-peach)] bg-[var(--color-peach)]/10 px-2 py-0.5 rounded-full shrink-0">
                              {item.tag}
                            </span>
                          )}
                        </div>
                        <p className="text-[12px] text-[var(--color-muted)] mt-1 line-clamp-2">{item.desc}</p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-[14px] font-semibold">${item.price.toFixed(2)}</span>
                          <button
                            onClick={() => add(item)}
                            className={`rounded-full px-4 py-1.5 text-[13px] font-semibold text-[#1a0f08] active:scale-90 transition bg-grad ${
                              popped === item.id ? "animate-pop" : ""
                            }`}
                          >
                            {q > 0 ? `Add · ${q}` : "Add +"}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="px-4 mt-5 flex flex-col gap-3">
          {restaurant.reviews.map((rv, i) => (
            <div key={i} className="rounded-2xl bg-[var(--color-ink-2)] border border-[var(--color-line)] p-4">
              <div className="flex items-center justify-between">
                <span className="text-[13px] font-semibold">@{rv.user}</span>
                <span className="text-[12px] text-[var(--color-amber)]">{"★".repeat(rv.rating)}</span>
              </div>
              <p className="text-[13px] text-[var(--color-cream)]/90 mt-2">{rv.text}</p>
              <p className="text-[11px] text-[var(--color-muted)] mt-2">{rv.ago} ago</p>
            </div>
          ))}
        </div>
      )}

      {cartCount > 0 && (
        <button
          onClick={onCart}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center justify-between gap-6 rounded-full pl-6 pr-3 py-2.5 text-[#1a0f08] font-semibold active:scale-95 transition fade-up w-[calc(100%-2.5rem)] max-w-[400px] bg-grad shadow-grad"
        >
          <span className="flex items-center gap-2">🛒 View cart</span>
          <span className="flex items-center gap-3">
            <span>${subtotal.toFixed(2)}</span>
            <span className="bg-[#1a0f08] text-[var(--color-cream)] rounded-full w-7 h-7 grid place-items-center text-[12px]">{cartCount}</span>
          </span>
        </button>
      )}
    </div>
  );
}
