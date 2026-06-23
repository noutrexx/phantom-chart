import { useMemo, useState } from "react";
import type { CartLine, MenuItem, Restaurant } from "../types";
import { feedback } from "../lib/feedback";
import { foodImg } from "../lib/img";
import FoodImage from "./FoodImage";
import PrimaryButton from "./PrimaryButton";
import { ChevronLeft, Heart, Minus, Plus, Star, X } from "./icons";

const SIZE_OPTIONS = [
  { key: "regular", label: "Regular", delta: 0 },
  { key: "large", label: "Large", delta: 2.5 },
];

const EXTRA_OPTIONS = [
  { key: "sauce", label: "Extra sauce", delta: 0.75 },
  { key: "crispy", label: "Make it crispy", delta: 1.25 },
  { key: "comfort", label: "Comfort boost", delta: 0 },
];

function slug(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

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
  const [selected, setSelected] = useState<MenuItem | null>(null);

  const popular = useMemo(
    () => restaurant.sections.flatMap((section) => section.items).filter((item) => item.popular).slice(0, 5),
    [restaurant]
  );

  function add(item: MenuItem, amount = 1) {
    for (let i = 0; i < amount; i += 1) onAdd(item);
    feedback.add();
    setPopped(item.id);
    window.setTimeout(() => setPopped((p) => (p === item.id ? null : p)), 340);
  }

  function qtyOf(id: string) {
    return cart.find((l) => l.item.id === id)?.qty ?? 0;
  }

  function jumpToSection(title: string) {
    document.getElementById(`section-${slug(title)}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <div className="h-full overflow-y-auto pb-28 bg-[var(--color-bg)]">
      <div className="relative h-56">
        <FoodImage src={foodImg(restaurant.photo, restaurant.id + "-hero", 860, 560)} alt={restaurant.name} className="absolute inset-0" gradient={restaurant.gradient} />
        <button onClick={onBack} className="absolute top-3 left-4 w-10 h-10 rounded-full bg-white grid place-items-center shadow-card active:scale-90 transition">
          <ChevronLeft size={22} className="text-[var(--color-ink)]" />
        </button>
        <button className="absolute top-3 right-4 w-10 h-10 rounded-full bg-white grid place-items-center shadow-card active:scale-90 transition">
          <Heart size={20} className="text-[var(--color-ink)]" />
        </button>
        <div className="absolute bottom-3 left-4 right-4 flex gap-2">
          <span className="rounded-full bg-white px-3 py-1.5 text-[12px] font-extrabold shadow-soft">Spend $0, save everything</span>
          <span className="rounded-full bg-white px-3 py-1.5 text-[12px] font-extrabold text-[var(--color-green-ink)] shadow-soft">Free delivery</span>
        </div>
      </div>

      <div className="px-5 pt-4">
        <h1 className="text-[26px] font-extrabold tracking-tight leading-tight">{restaurant.name}</h1>
        <p className="text-[14px] text-[var(--color-ink-2)] mt-1">{restaurant.blurb}</p>
        <div className="flex items-center gap-2 mt-3 text-[13px]">
          <span className="flex items-center gap-1 font-bold">
            <Star size={14} className="text-[var(--color-ink)]" /> {restaurant.rating}
          </span>
          <span className="text-[var(--color-ink-3)]">({restaurant.reviewsCount.toLocaleString()})</span>
          <span className="text-[var(--color-ink-3)]">-</span>
          <span className="text-[var(--color-ink-2)]">{restaurant.category}</span>
          <span className="text-[var(--color-ink-3)]">-</span>
          <span className="text-[var(--color-ink-2)]">{restaurant.priceLevel}</span>
        </div>
        <div className="mt-3 grid grid-cols-3 gap-2">
          <InfoPill label={`${restaurant.etaMin}-${restaurant.etaMin + 7} min`} sub="Delivery" />
          <InfoPill label="$0.00" sub="Fees" />
          <InfoPill label={`${restaurant.distanceKm} km`} sub="Away" />
        </div>
      </div>

      <div className="sticky top-0 z-10 bg-[var(--color-bg)]/95 backdrop-blur border-b border-[var(--color-line)] mt-5">
        <div className="flex gap-6 px-5">
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
        {tab === "menu" && (
          <div className="flex gap-2 overflow-x-auto hide-scroll px-5 pb-3">
            {restaurant.sections.map((sec) => (
              <button
                key={sec.title}
                onClick={() => jumpToSection(sec.title)}
                className="shrink-0 rounded-full border border-[var(--color-line-2)] bg-[var(--color-surface)] px-3 py-1.5 text-[12.5px] font-bold active:bg-[var(--color-soft)] transition"
              >
                {sec.title}
              </button>
            ))}
          </div>
        )}
      </div>

      {tab === "menu" ? (
        <>
          {popular.length > 0 && (
            <div className="pt-5">
              <div className="px-5 flex items-end justify-between">
                <div>
                  <h2 className="text-[20px] font-extrabold tracking-tight">Most ordered</h2>
                  <p className="text-[12.5px] text-[var(--color-ink-3)]">High craving, zero checkout damage</p>
                </div>
              </div>
              <div className="mt-3 flex gap-3 overflow-x-auto hide-scroll px-5">
                {popular.map((item) => (
                  <button key={item.id} onClick={() => setSelected(item)} className="shrink-0 w-36 text-left active:scale-[0.98] transition">
                    <div className="relative w-36 h-28 rounded-xl overflow-hidden shadow-soft">
                      <FoodImage src={foodImg(item.photo, `${item.id}-popular`, 260, 220)} alt={item.name} className="absolute inset-0" gradient={restaurant.gradient} />
                      <span className="absolute left-2 top-2 rounded-full bg-white px-2 py-1 text-[10.5px] font-extrabold">Popular</span>
                    </div>
                    <p className="mt-2 text-[13px] font-bold leading-tight line-clamp-2">{item.name}</p>
                    <p className="text-[12px] font-semibold text-[var(--color-ink-2)] tabular-nums">${item.price.toFixed(2)}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="px-5">
            {restaurant.sections.map((sec) => (
              <div id={`section-${slug(sec.title)}`} key={sec.title} className="scroll-mt-24 pt-6">
                <h3 className="text-[18px] font-extrabold tracking-tight mb-1">{sec.title}</h3>
                <div>
                  {sec.items.map((item) => (
                    <MenuRow
                      key={item.id}
                      item={item}
                      restaurant={restaurant}
                      qty={qtyOf(item.id)}
                      popped={popped === item.id}
                      onOpen={() => setSelected(item)}
                      onQuickAdd={() => add(item)}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="px-5 pt-5 flex flex-col gap-3">
          <div className="rounded-xl bg-[var(--color-soft)] p-4">
            <p className="text-[28px] font-extrabold leading-none">{restaurant.rating}</p>
            <p className="text-[13px] font-bold mt-1">{restaurant.reviewsCount.toLocaleString()} phantom reviews</p>
            <p className="text-[12.5px] text-[var(--color-ink-2)] mt-1">People loved building the cart and keeping the cash.</p>
          </div>
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

      {selected && (
        <ProductSheet
          item={selected}
          restaurant={restaurant}
          onClose={() => setSelected(null)}
          onAdd={(item, amount) => {
            add(item, amount);
            setSelected(null);
          }}
        />
      )}

      {cartCount > 0 && (
        <div className="fixed bottom-0 left-1/2 -translate-x-1/2 z-30 w-full max-w-[430px] px-5 pb-5 pt-2 pointer-events-none">
          <button
            onClick={onCart}
            className="pointer-events-auto w-full flex items-center justify-between rounded-[14px] bg-[var(--color-ink)] text-white pl-5 pr-4 py-3.5 shadow-lift active:scale-[0.98] transition fade-up"
          >
            <span className="text-[15px] font-bold">View cart - {cartCount}</span>
            <span className="text-[15px] font-bold tabular-nums">${subtotal.toFixed(2)}</span>
          </button>
        </div>
      )}
    </div>
  );
}

function InfoPill({ label, sub }: { label: string; sub: string }) {
  return (
    <div className="rounded-xl border border-[var(--color-line)] px-3 py-2.5">
      <p className="text-[13px] font-extrabold tabular-nums">{label}</p>
      <p className="text-[11.5px] text-[var(--color-ink-3)] mt-0.5">{sub}</p>
    </div>
  );
}

function MenuRow({
  item,
  restaurant,
  qty,
  popped,
  onOpen,
  onQuickAdd,
}: {
  item: MenuItem;
  restaurant: Restaurant;
  qty: number;
  popped: boolean;
  onOpen: () => void;
  onQuickAdd: () => void;
}) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onOpen}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onOpen();
        }
      }}
      className="w-full text-left flex gap-3 py-4 border-b border-[var(--color-line)] active:opacity-90 transition cursor-pointer"
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <h4 className="text-[15px] font-bold tracking-tight">{item.name}</h4>
          {item.popular && <span className="rounded-full bg-[var(--color-red)]/10 text-[var(--color-red)] px-2 py-0.5 text-[10.5px] font-extrabold">Popular</span>}
        </div>
        <p className="text-[14px] font-semibold mt-1 tabular-nums">${item.price.toFixed(2)}</p>
        <p className="text-[13px] text-[var(--color-ink-2)] mt-1 leading-snug line-clamp-2">{item.desc}</p>
      </div>
      <div className="relative w-[92px] h-[92px] shrink-0">
        <FoodImage src={foodImg(item.photo, item.id, 220, 220)} alt={item.name} className="w-full h-full rounded-xl" gradient={restaurant.gradient} />
        <button
          onClick={(event) => {
            event.stopPropagation();
            onQuickAdd();
          }}
          aria-label={`Add ${item.name}`}
          className={`absolute -bottom-2 -right-2 w-9 h-9 rounded-full bg-white grid place-items-center shadow-card active:scale-90 transition ${popped ? "animate-pop" : ""}`}
        >
          {qty > 0 ? <span className="text-[13px] font-extrabold tabular-nums">{qty}</span> : <Plus size={18} className="text-[var(--color-ink)]" />}
        </button>
      </div>
    </div>
  );
}

function ProductSheet({
  item,
  restaurant,
  onClose,
  onAdd,
}: {
  item: MenuItem;
  restaurant: Restaurant;
  onClose: () => void;
  onAdd: (item: MenuItem, amount: number) => void;
}) {
  const [size, setSize] = useState(SIZE_OPTIONS[0].key);
  const [extras, setExtras] = useState<string[]>([]);
  const [qty, setQty] = useState(1);
  const [note, setNote] = useState("");

  const sizeDelta = SIZE_OPTIONS.find((option) => option.key === size)?.delta ?? 0;
  const extrasTotal = extras.reduce((sum, key) => sum + (EXTRA_OPTIONS.find((option) => option.key === key)?.delta ?? 0), 0);
  const lineTotal = (item.price + sizeDelta + extrasTotal) * qty;

  function toggleExtra(key: string) {
    feedback.tap();
    setExtras((current) => (current.includes(key) ? current.filter((itemKey) => itemKey !== key) : [...current, key]));
  }

  return (
    <div className="fixed inset-0 z-40 bg-black/35 flex items-end">
      <div className="w-full bg-[var(--color-bg)] rounded-t-3xl max-h-[88%] overflow-y-auto shadow-lift fade-up">
        <div className="relative h-52">
          <FoodImage src={foodImg(item.photo, `${item.id}-sheet`, 720, 460)} alt={item.name} className="absolute inset-0 rounded-t-3xl" gradient={restaurant.gradient} />
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/72 to-transparent" />
          <button onClick={onClose} aria-label="Close item" className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white grid place-items-center shadow-card active:scale-90 transition">
            <X size={20} className="text-[var(--color-ink)]" />
          </button>
          <div className="absolute left-5 right-5 bottom-4 text-white">
            <h2 className="text-[23px] font-extrabold tracking-tight leading-tight">{item.name}</h2>
            <p className="text-[13px] font-bold mt-1 tabular-nums">${item.price.toFixed(2)}</p>
          </div>
        </div>

        <div className="px-5 pt-4 pb-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[13.5px] text-[var(--color-ink-2)] mt-1 leading-snug">{item.desc}</p>
            </div>
          </div>

          <OptionGroup title="Size">
            {SIZE_OPTIONS.map((option) => {
              const active = size === option.key;
              return (
                <button
                  key={option.key}
                  onClick={() => {
                    feedback.tap();
                    setSize(option.key);
                  }}
                  className={`w-full flex items-center justify-between rounded-xl border px-3.5 py-3 text-left transition ${
                    active ? "border-[var(--color-ink)] bg-[var(--color-soft)]" : "border-[var(--color-line)] bg-[var(--color-surface)]"
                  }`}
                >
                  <span className="text-[14px] font-bold">{option.label}</span>
                  <span className="text-[13px] font-semibold text-[var(--color-ink-2)] tabular-nums">{option.delta > 0 ? `+$${option.delta.toFixed(2)}` : "Included"}</span>
                </button>
              );
            })}
          </OptionGroup>

          <OptionGroup title="Extras">
            {EXTRA_OPTIONS.map((option) => {
              const active = extras.includes(option.key);
              return (
                <button
                  key={option.key}
                  onClick={() => toggleExtra(option.key)}
                  className={`w-full flex items-center justify-between rounded-xl border px-3.5 py-3 text-left transition ${
                    active ? "border-[var(--color-green)] bg-[var(--color-green)]/10" : "border-[var(--color-line)] bg-[var(--color-surface)]"
                  }`}
                >
                  <span className="text-[14px] font-bold">{option.label}</span>
                  <span className="text-[13px] font-semibold text-[var(--color-ink-2)] tabular-nums">{option.delta > 0 ? `+$${option.delta.toFixed(2)}` : "$0.00"}</span>
                </button>
              );
            })}
          </OptionGroup>

          <div className="mt-5">
            <label className="text-[14px] font-extrabold tracking-tight">Special note</label>
            <textarea
              value={note}
              onChange={(event) => setNote(event.target.value)}
              placeholder="Extra napkins, extra drama..."
              maxLength={90}
              className="mt-2 w-full h-20 resize-none rounded-xl border border-[var(--color-line)] bg-[var(--color-surface)] px-3.5 py-3 text-[13.5px] outline-none focus:border-[var(--color-ink)]"
            />
          </div>

          <div className="mt-5 flex items-center gap-3">
            <div className="flex items-center gap-1 border border-[var(--color-line-2)] rounded-full p-1">
              <button onClick={() => setQty((value) => Math.max(1, value - 1))} className="w-9 h-9 grid place-items-center rounded-full active:bg-[var(--color-soft)] transition">
                <Minus size={17} className="text-[var(--color-ink)]" />
              </button>
              <span className="w-8 text-center text-[15px] font-extrabold tabular-nums">{qty}</span>
              <button onClick={() => setQty((value) => value + 1)} className="w-9 h-9 grid place-items-center rounded-full bg-[var(--color-ink)] active:scale-90 transition">
                <Plus size={17} className="text-white" />
              </button>
            </div>
            <PrimaryButton onClick={() => onAdd(item, qty)} className="flex-1">
              <span className="flex items-center justify-between w-full">
                <span>Add to cart</span>
                <span className="tabular-nums">${lineTotal.toFixed(2)}</span>
              </span>
            </PrimaryButton>
          </div>
        </div>
      </div>
    </div>
  );
}

function OptionGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-5">
      <h3 className="text-[14px] font-extrabold tracking-tight mb-2">{title}</h3>
      <div className="flex flex-col gap-2">{children}</div>
    </div>
  );
}
