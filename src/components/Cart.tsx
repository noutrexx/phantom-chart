import type { CartLine } from "../types";
import PrimaryButton from "./PrimaryButton";
import FoodImage from "./FoodImage";
import { foodImg } from "../lib/img";
import { feedback } from "../lib/feedback";
import { ChevronLeft, Plus, Minus, Bag } from "./icons";

export default function Cart({
  cart,
  subtotal,
  onBack,
  onQty,
  onPlace,
  onBrowse,
}: {
  cart: CartLine[];
  subtotal: number;
  onBack: () => void;
  onQty: (id: string, delta: number) => void;
  onPlace: () => void;
  onBrowse: () => void;
}) {
  const empty = cart.length === 0;

  return (
    <div className="h-full flex flex-col bg-[var(--color-bg)]">
      {/* Header */}
      <div className="shrink-0 px-5 pt-2 pb-3 flex items-center gap-3 border-b border-[var(--color-line)]">
        <button onClick={onBack} className="w-9 h-9 -ml-1 rounded-full grid place-items-center active:bg-[var(--color-soft)] transition">
          <ChevronLeft size={24} className="text-[var(--color-ink)]" />
        </button>
        <h1 className="text-[18px] font-extrabold tracking-tight">Your order</h1>
      </div>

      {empty ? (
        <div className="flex-1 grid place-items-center px-8 text-center">
          <div>
            <div className="w-16 h-16 mx-auto rounded-2xl bg-[var(--color-soft)] grid place-items-center">
              <Bag size={28} className="text-[var(--color-ink-3)]" />
            </div>
            <p className="mt-4 text-[15px] font-semibold">Your cart is empty</p>
            <p className="text-[13.5px] text-[var(--color-ink-2)] mt-1">Which is kind of the whole point.</p>
            <PrimaryButton onClick={onBrowse} full={false} size="md" className="mt-5">
              Browse restaurants
            </PrimaryButton>
          </div>
        </div>
      ) : (
        <>
          <div className="flex-1 overflow-y-auto px-5 py-4">
            <div className="flex flex-col">
              {cart.map((l) => (
                <div key={l.item.id} className="flex items-center gap-3 py-3 border-b border-[var(--color-line)]">
                  <FoodImage src={foodImg(l.item.photo, l.item.id, 140, 140)} alt={l.item.name} className="w-14 h-14 rounded-xl shrink-0" />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-[14.5px] font-bold tracking-tight truncate">{l.item.name}</h4>
                    <p className="text-[13.5px] font-semibold text-[var(--color-ink-2)] mt-0.5 tabular-nums">${(l.item.price * l.qty).toFixed(2)}</p>
                  </div>
                  <div className="flex items-center gap-1 border border-[var(--color-line-2)] rounded-full p-1">
                    <button onClick={() => onQty(l.item.id, -1)} className="w-7 h-7 grid place-items-center rounded-full active:bg-[var(--color-soft)] transition">
                      <Minus size={16} className="text-[var(--color-ink)]" />
                    </button>
                    <span className="w-5 text-center text-[14px] font-bold tabular-nums">{l.qty}</span>
                    <button onClick={() => onQty(l.item.id, 1)} className="w-7 h-7 grid place-items-center rounded-full bg-[var(--color-ink)] active:scale-90 transition">
                      <Plus size={16} className="text-white" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="mt-5 card shadow-soft p-4 text-[14px]">
              <Row label="Subtotal" value={`$${subtotal.toFixed(2)}`} />
              <Row label="Delivery fee" value="$0.00" green />
              <Row label="Service fee" value="$0.00" green />
              <Row label="Taxes" value="$0.00" green />
              <div className="divider my-3" />
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-[15px]">Total</span>
                <span className="font-extrabold text-[18px] text-[var(--color-green-ink)] tabular-nums">$0.00</span>
              </div>
              <p className="text-[12px] text-[var(--color-ink-2)] mt-2.5 leading-snug">
                No card required. No order is placed. The cart was the meal.
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="shrink-0 px-5 pb-6 pt-3 border-t border-[var(--color-line)] bg-[var(--color-bg)]">
            <PrimaryButton
              onClick={() => {
                feedback.success();
                onPlace();
              }}
            >
              <span className="flex items-center justify-between w-full">
                <span>Place order</span>
                <span className="tabular-nums">$0.00</span>
              </span>
            </PrimaryButton>
          </div>
        </>
      )}
    </div>
  );
}

function Row({ label, value, green }: { label: string; value: string; green?: boolean }) {
  return (
    <div className="flex items-center justify-between py-1">
      <span className="text-[var(--color-ink-2)]">{label}</span>
      <span className={green ? "text-[var(--color-green-ink)] font-semibold tabular-nums" : "tabular-nums"}>{value}</span>
    </div>
  );
}
