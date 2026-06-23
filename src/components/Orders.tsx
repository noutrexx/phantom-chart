import type { Order } from "../types";
import { foodImg } from "../lib/img";
import FoodImage from "./FoodImage";
import { Receipt } from "./icons";

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
}: {
  orders: Order[];
  onReorder: (order: Order) => void;
  onOpenActive: (order: Order) => void;
}) {
  return (
    <div className="h-full overflow-y-auto pb-24 bg-[var(--color-bg)]">
      <div className="px-5 pt-3 pb-2">
        <h1 className="text-[24px] font-extrabold tracking-tight">Your orders</h1>
        <p className="text-[13px] text-[var(--color-ink-2)] mt-0.5">{orders.length} phantom order{orders.length === 1 ? "" : "s"} / $0.00 spent, always</p>
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
        <div className="px-5 flex flex-col gap-3">
          {orders.map((o) => {
            const active = o.status === "active";
            return (
              <div key={o.id} className="card shadow-soft overflow-hidden">
                <div className="flex items-center gap-3 p-3">
                  <FoodImage src={foodImg(o.restaurantPhoto, o.restaurantId + "-hist", 140, 140)} alt={o.restaurantName} className="w-14 h-14 rounded-xl shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-[15px] font-extrabold tracking-tight truncate">{o.restaurantName}</h3>
                      <span
                        className={`shrink-0 rounded-full px-2 py-0.5 text-[10.5px] font-extrabold ${
                          active ? "bg-[var(--color-green)]/12 text-[var(--color-green-ink)]" : "bg-[var(--color-soft)] text-[var(--color-ink-2)]"
                        }`}
                      >
                        {active ? "En route" : "Delivered"}
                      </span>
                    </div>
                    <p className="text-[12.5px] text-[var(--color-ink-2)] mt-0.5 truncate">
                      {o.items.map((i) => `${i.qty}x ${i.name}`).join(", ")}
                    </p>
                    <p className="text-[11.5px] text-[var(--color-ink-3)] mt-0.5 tabular-nums">
                      {ago(o.placedAt)} / would've been ${o.subtotal.toFixed(2)}
                    </p>
                  </div>
                </div>
                <div className="px-3 pb-3 flex gap-2">
                  {active && (
                    <button
                      onClick={() => onOpenActive(o)}
                      className="flex-1 h-10 rounded-xl bg-[var(--color-ink)] text-white text-[13px] font-extrabold active:scale-[0.98] transition"
                    >
                      Track order
                    </button>
                  )}
                  <button
                    onClick={() => onReorder(o)}
                    className={`${active ? "px-4" : "flex-1"} h-10 rounded-xl border border-[var(--color-line-2)] text-[13px] font-extrabold active:bg-[var(--color-soft)] transition`}
                  >
                    Reorder
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
