import { useState } from "react";
import type { CartLine, MenuItem, Restaurant } from "../types";
import { feedback } from "../lib/feedback";
import { foodImg } from "../lib/img";
import FoodImage from "./FoodImage";
import { ChevronLeft, Star, Clock, Plus, Heart } from "./icons";

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
    window.setTimeout(() => setPopped((p) => (p === item.id ? null : p)), 340);
  }
  function qtyOf(id: string) {
    return cart.find((l) => l.item.id === id)?.qty ?? 0;
  }

  return (
    <div className="h-full overflow-y-auto pb-28 bg-[var(--color-bg)]">
      {/* Hero */}
      <div className="relative h-56">
        <FoodImage src={foodImg(restaurant.photo, restaurant.id + "-hero", 860, 560)} alt={restaurant.name} className="absolute inset-0" gradient={restaurant.gradient} />
        <button onClick={onBack} className="absolute top-3 left-4 w-10 h-10 rounded-full bg-white grid place-items-center shadow-card active:scale-90 transition">
          <ChevronLeft size={22} className="text-[var(--color-ink)]" />
        </button>
        <button className="absolute top-3 right-4 w-10 h-10 rounded-full bg-white grid place-items-center shadow-card active:scale-90 transition">
          <Heart size={20} className="text-[var(--color-ink)]" />
        </button>
      </div>

      {/* Info */}
      <div className="px-5 pt-4">
        <h1 className="text-[26px] font-extrabold tracking-tight leading-tight">{restaurant.name}</h1>
        <p className="text-[14px] text-[var(--color-ink-2)] mt-1">{restaurant.blurb}</p>
        <div className="flex items-center gap-2 mt-3 text-[13px]">
          <span className="flex items-center gap-1 font-bold">
            <Star size={14} className="text-[var(--color-ink)]" /> {restaurant.rating}
          </span>
          <span className="text-[var(--color-ink-3)]">({restaurant.reviewsCount.toLocaleString()})</span>
          <span className="text-[var(--color-ink-3)]">·</span>
          <span className="text-[var(--color-ink-2)]">{restaurant.category}</span>
          <span className="text-[var(--color-ink-3)]">·</span>
          <span className="text-[var(--color-ink-2)]">{restaurant.priceLevel}</span>
        </div>
        <div className="mt-3 flex items-center gap-2 rounded-xl border border-[var(--color-line)] px-3.5 py-2.5">
          <Clock size={17} className="text-[var(--color-ink)]" />
          <span className="text-[13.5px] font-semibold">{restaurant.etaMin}–{restaurant.etaMin + 7} min</span>
          <span className="text-[var(--color-ink-3)] text-[13px]">·</span>
          <span className="text-[13.5px] font-semibold text-[var(--color-green-ink)]">Free delivery</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="sticky top-0 z-10 bg-[var(--color-bg)]/95 backdrop-blur flex gap-6 px-5 mt-5 border-b border-[var(--color-line)]">
        {(["menu", "reviews"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`pb-3 pt-1 text-[14px] font-bold capitalize border-b-2 -mb-px transition ${
              tab === t ? "border-[var(--color-ink)] text-[var(--color-ink)]" : "border-transparent text-[var(--color-ink-3)]"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "menu" ? (
        <div className="px-5">
          {restaurant.sections.map((sec) => (
            <div key={sec.title} className="pt-5">
              <h3 className="text-[18px] font-extrabold tracking-tight mb-1">{sec.title}</h3>
              <div>
                {sec.items.map((item) => {
                  const q = qtyOf(item.id);
                  return (
                    <div key={item.id} className="flex gap-3 py-4 border-b border-[var(--color-line)]">
                      <div className="flex-1 min-w-0">
                        <h4 className="text-[15px] font-bold tracking-tight">{item.name}</h4>
                        <p className="text-[14px] font-semibold mt-1 tabular-nums">${item.price.toFixed(2)}</p>
                        <p className="text-[13px] text-[var(--color-ink-2)] mt-1 leading-snug line-clamp-2">{item.desc}</p>
                        {item.popular && (
                          <span className="inline-flex items-center gap-1 mt-2 text-[11.5px] font-bold text-[var(--color-red)]">
                            <Star size={11} className="text-[var(--color-red)]" /> Popular
                          </span>
                        )}
                      </div>
                      <div className="relative w-[92px] h-[92px] shrink-0">
                        <FoodImage src={foodImg(item.photo, item.id, 220, 220)} alt={item.name} className="w-full h-full rounded-xl" gradient={restaurant.gradient} />
                        <button
                          onClick={() => add(item)}
                          aria-label={`Add ${item.name}`}
                          className={`absolute -bottom-2 -right-2 w-9 h-9 rounded-full bg-white grid place-items-center shadow-card active:scale-90 transition ${
                            popped === item.id ? "animate-pop" : ""
                          }`}
                        >
                          {q > 0 ? (
                            <span className="text-[13px] font-extrabold tabular-nums">{q}</span>
                          ) : (
                            <Plus size={18} className="text-[var(--color-ink)]" />
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="px-5 pt-5 flex flex-col gap-3">
          {restaurant.reviews.map((rv, i) => (
            <div key={i} className="card p-4">
              <div className="flex items-center justify-between">
                <span className="text-[13.5px] font-bold">@{rv.user}</span>
                <span className="flex items-center gap-0.5 text-[var(--color-amber)]">
                  {Array.from({ length: rv.rating }).map((_, k) => (
                    <Star key={k} size={13} className="text-[var(--color-amber)]" />
                  ))}
                </span>
              </div>
              <p className="text-[13.5px] text-[var(--color-ink)] mt-2 leading-relaxed">{rv.text}</p>
              <p className="text-[11.5px] text-[var(--color-ink-3)] mt-2">{rv.ago} ago</p>
            </div>
          ))}
        </div>
      )}

      {cartCount > 0 && (
        <div className="fixed bottom-0 left-1/2 -translate-x-1/2 z-30 w-full max-w-[430px] px-5 pb-5 pt-2 pointer-events-none">
          <button
            onClick={onCart}
            className="pointer-events-auto w-full flex items-center justify-between rounded-[14px] bg-[var(--color-ink)] text-white pl-5 pr-4 py-3.5 shadow-lift active:scale-[0.98] transition fade-up"
          >
            <span className="text-[15px] font-bold">View cart · {cartCount}</span>
            <span className="text-[15px] font-bold tabular-nums">${subtotal.toFixed(2)}</span>
          </button>
        </div>
      )}
    </div>
  );
}
