import { useState } from "react";
import type { Order } from "../types";
import { foodImg } from "../lib/img";
import FoodImage from "./FoodImage";
import { Message, Receipt, Star } from "./icons";

function ago(ms: number): string {
  const s = Math.max(0, Math.floor((Date.now() - ms) / 1000));
  if (s < 60) return "just now";
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

export default function Orders({
  orders,
  onReorder,
  onOpenActive,
  onRate,
}: {
  orders: Order[];
  onReorder: (order: Order) => void;
  onOpenActive: (order: Order) => void;
  onRate: (id: string, rating: number, review: string) => void;
}) {
  const reviewed = orders.filter((order) => order.rating).length;

  return (
    <div className="h-full overflow-y-auto pb-24 bg-[var(--color-bg)]">
      <div className="px-5 pt-3 pb-3 border-b border-[var(--color-line)] bg-[var(--color-bg)]/95 backdrop-blur sticky top-0 z-10">
        <h1 className="text-[24px] font-extrabold tracking-tight">Your orders</h1>
        <div className="mt-2 grid grid-cols-2 gap-2">
          <SummaryPill label="Phantom orders" value={String(orders.length)} />
          <SummaryPill label="Reviews posted" value={String(reviewed)} />
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="grid place-items-center px-8 text-center pt-20">
          <div>
            <div className="w-16 h-16 mx-auto rounded-2xl bg-[var(--color-soft)] grid place-items-center">
              <Receipt size={28} className="text-[var(--color-ink-3)]" />
            </div>
            <p className="mt-4 text-[15px] font-semibold">No orders yet</p>
            <p className="text-[13.5px] text-[var(--color-ink-2)] mt-1">Place a phantom order and it shows up here.</p>
          </div>
        </div>
      ) : (
        <div className="px-5 pt-4 flex flex-col gap-3">
          {orders.map((order) => (
            <OrderCard key={order.id} order={order} onOpenActive={onOpenActive} onReorder={onReorder} onRate={onRate} />
          ))}
        </div>
      )}
    </div>
  );
}

function OrderCard({
  order,
  onReorder,
  onOpenActive,
  onRate,
}: {
  order: Order;
  onReorder: (order: Order) => void;
  onOpenActive: (order: Order) => void;
  onRate: (id: string, rating: number, review: string) => void;
}) {
  const active = order.status === "active";
  const [rating, setRating] = useState(order.rating ?? 0);
  const [review, setReview] = useState(order.review ?? "");
  const canSave = !active && rating > 0;

  function saveReview() {
    if (!canSave) return;
    onRate(order.id, rating, review);
  }

  return (
    <div className="card shadow-soft overflow-hidden">
      <div className="flex items-center gap-3 p-3">
        <FoodImage src={foodImg(order.restaurantPhoto, order.restaurantId + "-hist", 140, 140)} alt={order.restaurantName} className="w-14 h-14 rounded-xl shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="text-[15px] font-extrabold tracking-tight truncate">{order.restaurantName}</h3>
            <span
              className={`shrink-0 rounded-full px-2 py-0.5 text-[10.5px] font-extrabold ${
                active ? "bg-[var(--color-green)]/12 text-[var(--color-green-ink)]" : "bg-[var(--color-soft)] text-[var(--color-ink-2)]"
              }`}
            >
              {active ? "En route" : "Delivered"}
            </span>
          </div>
          <p className="text-[12.5px] text-[var(--color-ink-2)] mt-0.5 truncate">
            {order.items.map((item) => `${item.qty}x ${item.name}`).join(", ")}
          </p>
          <p className="text-[11.5px] text-[var(--color-ink-3)] mt-0.5 tabular-nums">
            {ago(order.placedAt)} / would've been ${order.subtotal.toFixed(2)}
          </p>
        </div>
      </div>

      {!active && (
        <div className="mx-3 mb-3 rounded-xl bg-[var(--color-soft)] p-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  onClick={() => setRating(value)}
                  aria-label={`Rate ${value} star`}
                  className="w-8 h-8 rounded-full grid place-items-center active:scale-90 transition"
                >
                  <Star size={19} className={value <= rating ? "text-[var(--color-amber)]" : "text-[var(--color-line-2)]"} />
                </button>
              ))}
            </div>
            {order.rating ? (
              <span className="shrink-0 text-[11px] font-extrabold text-[var(--color-green-ink)]">Reviewed</span>
            ) : (
              <span className="shrink-0 text-[11px] font-extrabold text-[var(--color-ink-3)]">Tap to rate</span>
            )}
          </div>

          <label className="mt-2 flex items-start gap-2 rounded-xl bg-white border border-[var(--color-line)] px-3 py-2">
            <Message size={16} className="mt-0.5 shrink-0 text-[var(--color-ink-3)]" />
            <textarea
              value={review}
              onChange={(event) => setReview(event.target.value)}
              maxLength={180}
              placeholder="Write a short note about this order"
              className="min-w-0 flex-1 h-14 resize-none bg-transparent outline-none text-[13px] leading-snug placeholder:text-[var(--color-ink-3)]"
            />
          </label>

          <button
            onClick={saveReview}
            disabled={!canSave}
            className={`mt-2 h-10 w-full rounded-xl text-[13px] font-extrabold transition ${
              canSave ? "bg-[var(--color-ink)] text-white active:scale-[0.98]" : "bg-[var(--color-line)] text-[var(--color-ink-3)]"
            }`}
          >
            {order.rating ? "Update review" : "Save review"}
          </button>
        </div>
      )}

      <div className="px-3 pb-3 flex gap-2">
        {active && (
          <button
            onClick={() => onOpenActive(order)}
            className="flex-1 h-10 rounded-xl bg-[var(--color-ink)] text-white text-[13px] font-extrabold active:scale-[0.98] transition"
          >
            Track order
          </button>
        )}
        <button
          onClick={() => onReorder(order)}
          className={`${active ? "px-4" : "flex-1"} h-10 rounded-xl border border-[var(--color-line-2)] text-[13px] font-extrabold active:bg-[var(--color-soft)] transition`}
        >
          Reorder
        </button>
      </div>
    </div>
  );
}

function SummaryPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-[var(--color-soft)] px-3 py-2">
      <p className="text-[16px] font-extrabold tabular-nums leading-none">{value}</p>
      <p className="text-[10.5px] text-[var(--color-ink-3)] font-bold mt-1">{label}</p>
    </div>
  );
}
