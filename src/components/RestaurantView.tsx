import { useMemo, useState } from "react";
import type { CartLine, MenuItem, OptionGroup, Restaurant } from "../types";
import { feedback } from "../lib/feedback";
import { foodImg } from "../lib/img";
import { optionGroupsFor } from "../lib/options";
import FoodImage from "./FoodImage";
import PrimaryButton from "./PrimaryButton";
import { Check, ChevronLeft, Heart, Minus, Plus, Star, X } from "./icons";

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
  onAddLine,
  onCart,
  favorite,
  onToggleFavorite,
}: {
  restaurant: Restaurant;
  cart: CartLine[];
  cartCount: number;
  subtotal: number;
  onBack: () => void;
  onAdd: (item: MenuItem) => void;
  onAddLine: (line: CartLine) => void;
  onCart: () => void;
  favorite: boolean;
  onToggleFavorite: () => void;
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
    return cart.filter((l) => l.item.id === id).reduce((n, l) => n + l.qty, 0);
  }

  function jumpToSection(title: string) {
    document.getElementById(`section-${slug(title)}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <div className="h-full overflow-y-auto pb-28 bg-[var(--color-bg)]">
      <div className="relative px-5 pt-3">
        <div className="relative h-52 overflow-hidden rounded-[22px] bg-[var(--color-soft)] shadow-soft">
          <FoodImage src={foodImg(restaurant.photo, restaurant.id + "-hero", 860, 560)} alt={restaurant.name} className="absolute inset-0" gradient={restaurant.gradient} />
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/55 to-transparent" />
          <div className="absolute bottom-3 left-3 right-3 flex flex-wrap gap-2">
            <span className="rounded-full bg-white px-3 py-1.5 text-[12px] font-extrabold shadow-soft">Spend $0, save everything</span>
            <span className="rounded-full bg-white px-3 py-1.5 text-[12px] font-extrabold text-[var(--color-green-ink)] shadow-soft">Free delivery</span>
          </div>
        </div>
        <button onClick={onBack} className="absolute top-6 left-8 w-10 h-10 rounded-full bg-white grid place-items-center shadow-card active:scale-90 transition">
          <ChevronLeft size={22} className="text-[var(--color-ink)]" />
        </button>
        <button onClick={onToggleFavorite} aria-label={favorite ? "Remove favorite" : "Save"} className="absolute top-6 right-8 w-10 h-10 rounded-full bg-white grid place-items-center shadow-card active:scale-90 transition">
          <Heart size={20} className={favorite ? "text-[var(--color-red)] fill-current" : "text-[var(--color-ink)]"} />
        </button>
      </div>

      <div className="mx-5 mt-4 rounded-[18px] border border-[var(--color-line)] bg-[var(--color-surface)] p-4 shadow-soft">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h1 className="text-[27px] font-extrabold tracking-tight leading-tight">{restaurant.name}</h1>
            <p className="text-[14px] text-[var(--color-ink-2)] mt-1">{restaurant.blurb}</p>
          </div>
          <span className="shrink-0 rounded-full bg-[var(--color-green)]/10 px-2.5 py-1 text-[11.5px] font-extrabold text-[var(--color-green-ink)]">
            Open
          </span>
        </div>
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
        <div className="mt-4 grid grid-cols-3 gap-2">
          <InfoPill label={`${restaurant.etaMin}-${restaurant.etaMin + 7} min`} sub="Delivery" />
          <InfoPill label="$0.00" sub="Fees" />
          <InfoPill label={`${restaurant.distanceKm} km`} sub="Away" />
        </div>
      </div>

      <div className="sticky top-0 z-10 bg-[var(--color-bg)]/95 backdrop-blur border-b border-[var(--color-line)] mt-4">
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
              <div className="mt-3 flex gap-3 overflow-x-auto hide-scroll px-5 pb-1">
                {popular.map((item) => (
                  <button key={item.id} onClick={() => setSelected(item)} className="shrink-0 w-[136px] text-left active:scale-[0.98] transition">
                    <div className="relative w-[136px] h-[108px] rounded-xl overflow-hidden shadow-soft">
                      <FoodImage src={foodImg(item.photo, `${item.id}-popular`, 260, 220)} alt={item.name} className="absolute inset-0" gradient={restaurant.gradient} />
                      <span className="absolute left-2 top-2 rounded-full bg-white px-2 py-1 text-[10.5px] font-extrabold">Popular</span>
                    </div>
                    <p className="mt-2 text-[13px] font-bold leading-tight line-clamp-2 min-h-[32px]">{item.name}</p>
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
          onAddLine={(line) => {
            onAddLine(line);
            feedback.add();
            setPopped(line.item.id);
            window.setTimeout(() => setPopped((p) => (p === line.item.id ? null : p)), 340);
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
  onAddLine,
}: {
  item: MenuItem;
  restaurant: Restaurant;
  onClose: () => void;
  onAddLine: (line: CartLine) => void;
}) {
  const groups = useMemo(() => optionGroupsFor(restaurant, item), [restaurant, item]);
  const [singleSel, setSingleSel] = useState<Record<string, string>>(() =>
    Object.fromEntries(groups.filter((g) => g.type === "single").map((g) => [g.id, g.choices[0].id]))
  );
  const [multiSel, setMultiSel] = useState<Record<string, string[]>>({});
  const [qty, setQty] = useState(1);
  const [note, setNote] = useState("");

  function choiceDelta(g: OptionGroup, id: string) {
    return g.choices.find((c) => c.id === id)?.delta ?? 0;
  }
  function choiceLabel(g: OptionGroup, id: string) {
    return g.choices.find((c) => c.id === id)?.label ?? "";
  }

  let delta = 0;
  const selections: string[] = [];
  for (const g of groups) {
    if (g.type === "single") {
      const id = singleSel[g.id];
      delta += choiceDelta(g, id);
      selections.push(choiceLabel(g, id));
    } else {
      for (const id of multiSel[g.id] ?? []) {
        delta += choiceDelta(g, id);
        selections.push(choiceLabel(g, id));
      }
    }
  }
  const unitPrice = item.price + delta;
  const lineTotal = unitPrice * qty;

  function selectSingle(gid: string, cid: string) {
    feedback.tap();
    setSingleSel((prev) => ({ ...prev, [gid]: cid }));
  }
  function toggleMulti(gid: string, cid: string) {
    feedback.tap();
    setMultiSel((prev) => {
      const cur = prev[gid] ?? [];
      return { ...prev, [gid]: cur.includes(cid) ? cur.filter((x) => x !== cid) : [...cur, cid] };
    });
  }

  function handleAdd() {
    const sig = groups
      .map((g) =>
        g.type === "single"
          ? `${g.id}=${singleSel[g.id]}`
          : `${g.id}=${[...(multiSel[g.id] ?? [])].sort().join("+")}`
      )
      .join("|");
    const trimmedNote = note.trim();
    onAddLine({
      lineId: `${item.id}#${sig}#${trimmedNote}`,
      item,
      qty,
      unitPrice,
      selections,
      note: trimmedNote || undefined,
    });
  }

  return (
    <div className="fixed inset-0 z-40 bg-black/35 flex items-end" onClick={onClose}>
      <div className="w-full bg-[var(--color-bg)] rounded-t-3xl max-h-[90%] flex flex-col shadow-lift fade-up" onClick={(e) => e.stopPropagation()}>
        <div className="overflow-y-auto">
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

        <div className="px-5 pt-4 pb-4">
          <p className="text-[13.5px] text-[var(--color-ink-2)] leading-snug">{item.desc}</p>

          {groups.map((g) => (
            <OptionSection key={g.id} title={g.label} hint={g.type === "single" ? "Choose one" : "Add any"}>
              {g.choices.map((choice) => {
                const active = g.type === "single" ? singleSel[g.id] === choice.id : (multiSel[g.id] ?? []).includes(choice.id);
                return (
                  <button
                    key={choice.id}
                    onClick={() => (g.type === "single" ? selectSingle(g.id, choice.id) : toggleMulti(g.id, choice.id))}
                    className={`w-full flex items-center justify-between rounded-xl border px-3.5 py-3 text-left transition ${
                      active
                        ? g.type === "single"
                          ? "border-[var(--color-ink)] bg-[var(--color-soft)]"
                          : "border-[var(--color-green)] bg-[var(--color-green)]/10"
                        : "border-[var(--color-line)] bg-[var(--color-surface)]"
                    }`}
                  >
                    <span className="flex items-center gap-2.5">
                      <span
                        className={`grid place-items-center shrink-0 ${g.type === "single" ? "w-5 h-5 rounded-full border-2" : "w-5 h-5 rounded-md border-2"} ${
                          active ? (g.type === "single" ? "border-[var(--color-ink)]" : "border-[var(--color-green)] bg-[var(--color-green)]") : "border-[var(--color-line-2)]"
                        }`}
                      >
                        {active && (g.type === "single" ? <span className="w-2.5 h-2.5 rounded-full bg-[var(--color-ink)]" /> : <Check size={13} className="text-white" />)}
                      </span>
                      <span className="text-[14px] font-bold">{choice.label}</span>
                    </span>
                    <span className="text-[13px] font-semibold text-[var(--color-ink-2)] tabular-nums">{choice.delta > 0 ? `+$${choice.delta.toFixed(2)}` : "Included"}</span>
                  </button>
                );
              })}
            </OptionSection>
          ))}

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
        </div>
        </div>

        <div className="shrink-0 border-t border-[var(--color-line)] px-5 py-3 grid grid-cols-[126px_minmax(0,1fr)] items-center gap-3">
          <div className="flex items-center justify-between gap-1 border border-[var(--color-line-2)] rounded-full p-1">
            <button onClick={() => setQty((value) => Math.max(1, value - 1))} className="w-9 h-9 grid place-items-center rounded-full active:bg-[var(--color-soft)] transition">
              <Minus size={17} className="text-[var(--color-ink)]" />
            </button>
            <span className="w-8 text-center text-[15px] font-extrabold tabular-nums">{qty}</span>
            <button onClick={() => setQty((value) => value + 1)} className="w-9 h-9 grid place-items-center rounded-full bg-[var(--color-ink)] active:scale-90 transition">
              <Plus size={17} className="text-white" />
            </button>
          </div>
          <PrimaryButton onClick={handleAdd} className="h-12 min-w-0 !py-0">
            <span className="flex items-center justify-between w-full min-w-0 gap-3">
              <span className="truncate">Add to cart</span>
              <span className="tabular-nums">${lineTotal.toFixed(2)}</span>
            </span>
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
}

function OptionSection({ title, hint, children }: { title: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="mt-5">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-[14px] font-extrabold tracking-tight">{title}</h3>
        {hint && <span className="text-[11px] font-semibold text-[var(--color-ink-3)] uppercase tracking-wide">{hint}</span>}
      </div>
      <div className="flex flex-col gap-2">{children}</div>
    </div>
  );
}
